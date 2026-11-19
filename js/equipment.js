"use strict";

const staffOfficeKeyCabinet = $("staff-office-key-cabinet");
const keyPuzzleScreen = $("key-puzzle-screen");
const keyPuzzleItems = [
  ...document.querySelectorAll(".key-puzzle-item")
];

/* ========================================
    鍵返却ボタンの表示更新
======================================== */

function updateKeyReturnButtonVisibility() {
  if (!inStaffOffice) {
    returnKeyButton.hidden = true;
    return;
  }

  const playerCenter =
    staffOfficePlayerLeftOffset +
    staffOfficeX +
    staffOfficePlayer.offsetWidth / 2;

  const cabinetCenter =
    staffOfficeKeyCabinet.offsetLeft +
    staffOfficeKeyCabinet.offsetWidth / 2;

  const distance = Math.abs(playerCenter - cabinetCenter);

  // キャビネットから離れたら返却ボタンを隠す
  if (distance > 75) {
    returnKeyButton.hidden = true;
    inspectButton.hidden = false;
  }
}

/* ========================================
    楽器置き場ボタンの表示更新
======================================== */

function updateInstrumentCleanupButtonVisibility() {
  if (
    !inMusicRoom ||
    todayTasks.instrumentCleanup
  ) {
    cleanupInstrumentsButton.hidden = true;
    return;
  }

  const playerCenter =
    playerX + player.offsetWidth / 2;

  const storageCenter =
    instrumentStorage.offsetLeft +
    instrumentStorage.offsetWidth / 2;

  const distance = Math.abs(
    playerCenter - storageCenter
  );

  cleanupInstrumentsButton.hidden = distance > 45;
}

/* ========================================
    鍵のランダム配置
======================================== */

function shuffleKeyPuzzleItems() {
  const items = [...keyPuzzleItems];

  // Fisher-Yatesアルゴリズムでシャッフル
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [items[i], items[j]] = [items[j], items[i]];
  }

  const container = document.querySelector(".key-puzzle-items");

  resetKeyPuzzleEffects();

  // シャッフルした順番でHTMLに配置
  for (const item of items) {
    item.style.transform = "";
    item.style.transition = "none";

    const state = keyDragStates.get(item);

if (state) {
  state.x = 0;
  state.y = 0;
  state.startX = 0;
  state.startY = 0;
  state.dragging = false;
  state.returning = false;
  state.locked = false;
}

item.classList.remove("locked");
item.style.zIndex = "";

    container.appendChild(item);
  }
}

/* ========================================
    設備の描画
======================================== */

function renderRoom() {
  const equipment = getEquipment();

  windowImage.src = equipment.window.broken
    ? "assets/window_open.png"
    : "assets/window_closed.png";

  windowImage.alt = t(
    equipment.window.broken ? "windowOpen" : "windowClosed"
  );

  lightImage.classList.toggle("off", !equipment.light.broken);
  room.classList.toggle("dark", !equipment.light.broken);

  deskImage.src = equipment.desk.broken
    ? "assets/desk_false.png"
    : "assets/desk_true.png";

  deskImage.alt = t(
    equipment.desk.broken ? "deskBroken" : "deskFixed"
  );

  deskImage.parentElement.hidden = inMusicRoom;
  instrumentStorage.hidden = !inMusicRoom;
  room.classList.toggle("music-room", inMusicRoom);

  updateResult();
  updateFlashlightPosition();
}

function randomizeIssues() {
  const allRooms = [musicRoom, ...classrooms];

  // すべての設備を正常状態に戻す
  for (const currentRoom of allRooms) {
    for (const item of Object.values(currentRoom.equipment)) {
      item.broken = false;
    }
  }

  // 音楽室の電気は必ず不備あり
  musicRoom.equipment.light.broken = true;

  // 活動内容ごとの不備数
  let totalIssues;

  switch (selectedActivity) {
    case "ensemble":
      totalIssues = Math.floor(Math.random() * 3) + 4;
      break;

    case "section":
      totalIssues = Math.floor(Math.random() * 3) + 8;
      break;

    case "individual":
    default:
      totalIssues = 7;
      break;
  }

  // 音楽室の電気以外を候補にする
  const candidates = [
    musicRoom.equipment.window,
    ...classrooms.flatMap(currentRoom =>
      Object.values(currentRoom.equipment)
    )
  ];

  // 不備の候補をシャッフル
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [candidates[i], candidates[j]] = [
      candidates[j],
      candidates[i]
    ];
  }

  // 音楽室の電気を除いた残りの不備を設定
  candidates.slice(0, totalIssues - 1).forEach(item => {
    item.broken = true;
  });
}

/* ========================================
    設備の調査
======================================== */

inspectButton.addEventListener("click", () => {
  if (isBusy || inHallway || gameFinished) return;

  stopMoving();

    selectedEquipment = null;
  fixButton.hidden = true;
  returnKeyButton.hidden = true;
  inspectButton.hidden = true;
  
  // 事務室の鍵保管キャビネットを調査
  if (inStaffOffice) {
    stopStaffOfficeMoving();

    const playerCenter =
      staffOfficePlayerLeftOffset +
      staffOfficeX +
      staffOfficePlayer.offsetWidth / 2;

    const cabinetCenter =
      staffOfficeKeyCabinet.offsetLeft +
      staffOfficeKeyCabinet.offsetWidth / 2;

    const distance = Math.abs(playerCenter - cabinetCenter);

    // キャビネットから遠い
    if (distance > 75) {
      inspectButton.hidden = false;
      setMessage("farAway");
      return;
    }

    // 鍵当番イベントが発生していない
    if (!todayEvents.keyDuty) {
      inspectButton.hidden = false;
      setMessage("noKeyDuty");
      return;
    }

    // 鍵を所持していない
    if (!inventoryItems.some(item => item.id === "musicRoomKey")) {
      inspectButton.hidden = false;
      setMessage("keyNotOwned");
      return;
    }

    // 鍵を選択していない
    if (selectedItem !== "musicRoomKey") {
      inspectButton.hidden = false;
      setMessage("keyNotSelected");
      return;
    }

    // 鍵を選択中
    returnKeyButton.hidden = false;
    setMessage("keyCabinetFound");
    return;
  }

   // 音楽室の楽器置き場を調査
  if (inMusicRoom && !todayTasks.instrumentCleanup) {
    const playerCenter =
      playerX + player.offsetWidth / 2;

    const storageCenter =
      instrumentStorage.offsetLeft +
      instrumentStorage.offsetWidth / 2;

    const distance = Math.abs(
      playerCenter - storageCenter
    );

    // 楽器置き場から遠い
    if (distance > 90) {
      inspectButton.hidden = false;
      setMessage("farAway");
      return;
    }

    // 楽器置き場の近く
    cleanupInstrumentsButton.hidden = false;
    setMessage("instrumentCleanupRequired");
    return;
  }
  
  const equipment = getEquipment();

  const keys = inMusicRoom
    ? ["window", "light"]
    : Object.keys(equipment);

  const maxX = Math.max(
    1,
    room.clientWidth - player.offsetWidth
  );

  const playerPercent = playerX / maxX * 100;

  let nearestKey = null;
  let nearestDistance = Infinity;

  for (const key of keys) {
    const distance = Math.abs(
      playerPercent - equipment[key].position
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestKey = key;
    }
  }

  // 設備から遠い
  if (nearestDistance > 18) {
    inspectButton.hidden = false;
    setMessage("farAway");
    return;
  }

  const target = equipment[nearestKey];

  // 机・椅子の調査には時間がかかる
  if (nearestKey === "desk") {
    isBusy = true;
    setMessage("inspectingDesk");

    actionTimer = setTimeout(() => {
      actionTimer = null;
      isBusy = false;

      if (gameFinished || inHallway) {
        inspectButton.hidden = false;
        return;
      }

      selectedEquipment = nearestKey;

      if (target.broken) {
        setMessage("deskBrokenMessage");
        fixButton.hidden = false;
        inspectButton.hidden = true;
      } else {
        inspectButton.hidden = false;
        setMessage("deskOkay");
      }
    }, 2000);

    return;
  }

  selectedEquipment = nearestKey;

  if (target.broken) {
    setMessage("broken", {
      item: t(target.nameKey)
    });

    fixButton.hidden = false;
    inspectButton.hidden = true;
  } else {
    inspectButton.hidden = false;

    setMessage("normal", {
      item: t(target.nameKey)
    });
  }
});

/* ========================================
    楽器の片付け
======================================== */
cleanupInstrumentsButton.addEventListener("click", () => {
  if (
    isBusy ||
    gameFinished ||
    inHallway ||
    !inMusicRoom ||
    todayTasks.instrumentCleanup
  ) {
    return;
  }

  stopMoving();

  isBusy = true;

  cleanupInstrumentsButton.hidden = true;
  inspectButton.hidden = true;

  setMessage("cleaningInstruments");

  actionTimer = setTimeout(() => {
    actionTimer = null;

    completeTask("normal", "instrumentCleanup");

    isBusy = false;

        if (gameFinished || inHallway) {
      return;
    }

    if (todayEvents.musicRoomRestoration) {
      restoreMusicRoomButton.hidden = false;
      setMessage("musicRoomRestorationRequired");
      return;
    }

    inspectButton.hidden = false;

    setMessage("instrumentCleanupComplete");
  }, 7000);
});

/* ========================================
    音楽室の復元
======================================== */

restoreMusicRoomButton.addEventListener("click", () => {
  if (
    isBusy ||
    gameFinished ||
    inHallway ||
    !inMusicRoom ||
    !todayEvents.musicRoomRestoration ||
    eventTasks.musicRoomRestoration
  ) {
    return;
  }

  stopMoving();

  isBusy = true;

  restoreMusicRoomButton.hidden = true;
  inspectButton.hidden = true;

  setMessage("restoringMusicRoom");

  actionTimer = setTimeout(() => {
    actionTimer = null;

    completeTask("event", "musicRoomRestoration");

    isBusy = false;

    if (gameFinished || inHallway) {
      return;
    }

    inspectButton.hidden = false;

    setMessage("musicRoomRestorationComplete");
  }, 15000);
});

/* ========================================
    設備の修正
======================================== */

fixButton.addEventListener("click", () => {
  if (
    selectedEquipment === null ||
    isBusy ||
    inHallway ||
    gameFinished
  ) {
    return;
  }

  const target = getEquipment()[selectedEquipment];

  if (!target || !target.broken) return;

  const key = selectedEquipment;

  // 机・椅子の修正
  if (key === "desk") {
    isBusy = true;
    stopMoving();

    fixButton.hidden = true;
    inspectButton.hidden = true;

    setMessage("fixingDesk");

    actionTimer = setTimeout(() => {
      actionTimer = null;

      target.broken = false;
      selectedEquipment = null;
      isBusy = false;

      if (gameFinished || inHallway) {
        inspectButton.hidden = false;
        return;
      }

      renderRoom();

      inspectButton.hidden = false;
      fixButton.hidden = true;

      setMessage("deskFixedMessage");
    }, 3000);

    return;
  }

  // 窓・電気の修正
  target.broken = false;
  selectedEquipment = null;
  fixButton.hidden = true;
  inspectButton.hidden = false;
    cleanupInstrumentsButton.hidden = true;

  renderRoom();

  setMessage("fixed", {
    item: t(target.nameKey)
  });
});

/* ========================================
    鍵の返却
======================================== */

returnKeyButton.addEventListener("click", () => {
  if (isBusy || gameFinished || !inStaffOffice) return;
  
  // すでに鍵返却が完了している
  if (eventTasks.keyReturn) return;

  // 音楽室が施錠されていない
  if (!eventTasks.musicRoomLock) {
    setMessage("musicRoomNotLocked");
    return;
  }

  // 移動を停止
stopMoving();
stopStaffOfficeMoving();

// 鍵をランダムに配置
shuffleKeyPuzzleItems();

// パズル画面を表示
returnKeyButton.hidden = true;
keyPuzzleScreen.hidden = false;

// ゲーム操作ボタンを非表示にする
keyPuzzleScreen.closest(".game").classList.add("key-puzzle-open");

setMessage("returningKey");
});


/* ========================================
    鍵返却パズル：ドラッグ操作
======================================== */

const keyHooks = [
  ...document.querySelectorAll(".key-hook")
];

const keyPuzzlePanel =
  document.querySelector(".key-puzzle-panel");

const keyDragStates = new Map();

const keyPuzzleMessage = $("key-puzzle-message");

// パズルの演出を初期状態に戻す
function resetKeyPuzzleEffects() {
  keyHooks.forEach(hook => {
    hook.classList.remove("verified");
  });

  keyPuzzleMessage.textContent = "鍵を正しい場所に戻そう。";
  keyPuzzleMessage.classList.remove("completed");
}

for (const item of keyPuzzleItems) {
  keyDragStates.set(item, {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    pointerX: 0,
    pointerY: 0,
    baseLeft: 0,
    baseTop: 0,
    dragging: false,
    returning: false,
    locked: false
  });
}

// 鍵とフックの重なり率
function getOverlapRatio(itemRect, hookRect) {
  const left = Math.max(itemRect.left, hookRect.left);
  const right = Math.min(itemRect.right, hookRect.right);
  const top = Math.max(itemRect.top, hookRect.top);
  const bottom = Math.min(itemRect.bottom, hookRect.bottom);

  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);

  return (
    width * height /
    (itemRect.width * itemRect.height)
  );
}

// パネル内に収まる移動位置を計算
function getClampedPosition(state, clientX, clientY) {
  const panelRect = keyPuzzlePanel.getBoundingClientRect();

  const dx = clientX - state.pointerX;
  const dy = clientY - state.pointerY;

  const item = state.item;
  const width = item.offsetWidth;
  const height = item.offsetHeight;

  let x = state.startX + dx;
  let y = state.startY + dy;

  const minX = panelRect.left - state.baseLeft;
  const maxX = panelRect.right - width - state.baseLeft;

  const minY = panelRect.top - state.baseTop;
  const maxY = panelRect.bottom - height - state.baseTop;

  x = Math.max(minX, Math.min(x, maxX));
  y = Math.max(minY, Math.min(y, maxY));

  return { x, y };
}

// 元の位置に戻す
function returnKeyToPreviousPosition(item, state) {
  state.returning = true;

  item.style.transition = "transform 0.35s ease";
  item.style.transform =
    `translate(${state.startX}px, ${state.startY}px)`;

  state.x = state.startX;
  state.y = state.startY;

  const finishReturn = () => {
    state.returning = false;
    item.style.zIndex = "";
  };

  item.addEventListener("transitionend", finishReturn, {
    once: true
  });

  setTimeout(finishReturn, 450);
}

// ドラッグ処理
for (const item of keyPuzzleItems) {
  const state = keyDragStates.get(item);
  state.item = item;

  // ドラッグ開始
  item.addEventListener("pointerdown", (event) => {
    if (
      keyPuzzleScreen.hidden ||
      state.returning ||
      state.locked
    ) return;

    event.preventDefault();

    const rect = item.getBoundingClientRect();

    state.dragging = true;
    state.pointerX = event.clientX;
    state.pointerY = event.clientY;

    state.startX = state.x;
    state.startY = state.y;

    // transform適用前の基準位置
    state.baseLeft = rect.left - state.x;
    state.baseTop = rect.top - state.y;

    item.style.transition = "none";
    item.style.zIndex = "10";

    item.setPointerCapture(event.pointerId);
  });

  // ドラッグ中
  item.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;

    const position = getClampedPosition(
      state,
      event.clientX,
      event.clientY
    );

    item.style.transform =
      `translate(${position.x}px, ${position.y}px)`;
  });


  // ドラッグ終了
  function finishDrag(event) {
    if (!state.dragging) return;

    state.dragging = false;

    const position = getClampedPosition(
      state,
      event.clientX,
      event.clientY
    );

    state.x = position.x;
    state.y = position.y;

    item.style.transform =
      `translate(${state.x}px, ${state.y}px)`;

    const itemRect = item.getBoundingClientRect();

    // 最も重なっているフックを探す
    let targetHook = null;
    let maxOverlap = 0;

    for (const hook of keyHooks) {
      const hookRect = hook.getBoundingClientRect();
      const ratio = getOverlapRatio(itemRect, hookRect);

      if (ratio >= 0.90 && ratio > maxOverlap) {
        maxOverlap = ratio;
        targetHook = hook;
      }
    }

    // 正しいフックに重なっていない
    if (!targetHook) {
      item.style.zIndex = "";
      return;
    }

    const keyNumber = item.dataset.key;
    const hookNumber = targetHook.dataset.hook;

    // 番号が不一致
    if (keyNumber !== hookNumber) {
      returnKeyToPreviousPosition(item, state);
      return;
    }

    // 正解：フックの中央に移動
    const hookRect = targetHook.getBoundingClientRect();

    const targetX =
      hookRect.left + hookRect.width / 2 -
      (itemRect.left + itemRect.width / 2);

    const targetY =
      hookRect.top + hookRect.height / 2 -
      (itemRect.top + itemRect.height / 2);

    state.x += targetX;
    state.y += targetY;

    item.style.transition = "transform 0.2s ease";
    item.style.transform =
      `translate(${state.x}px, ${state.y}px)`;

    // 正解した鍵を固定
    state.locked = true;
    item.classList.add("locked");
    item.style.zIndex = "2";

    // 対応するフックを点灯
    targetHook.classList.add("verified");

    // 正解した鍵の本数を確認
    const verifiedCount = [
      ...keyDragStates.values()
    ].filter(state => state.locked).length;

    if (verifiedCount === 4) {
      keyPuzzleMessage.textContent = "ALL KEYS VERIFIED";
      keyPuzzleMessage.classList.add("completed");

      setTimeout(() => {
  // インベントリから音楽室の鍵を削除
  removeItem("musicRoomKey");

  // 鍵返却イベントを完了
  completeTask("event", "keyReturn");

  // 鍵返却画面を閉じる
  keyPuzzleScreen.hidden = true;
  keyPuzzleScreen.closest(".game")
    .classList.remove("key-puzzle-open");

  // エリアボタンを更新
  updateAreaButtons();
}, 1500);

    } else {
      keyPuzzleMessage.textContent = "返却確認 ✓";
    }
  }

  // ドラッグ終了イベント
  item.addEventListener("pointerup", finishDrag);

  // 操作がキャンセルされた場合は元の位置へ戻す
  item.addEventListener("pointercancel", () => {
    if (!state.dragging) return;

    state.dragging = false;
    returnKeyToPreviousPosition(item, state);
  });
}