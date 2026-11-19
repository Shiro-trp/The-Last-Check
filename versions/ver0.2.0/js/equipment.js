"use strict";

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
  room.classList.toggle("music-room", inMusicRoom);

  updateResult();
}

function randomizeIssues() {
  const allRooms = [musicRoom, ...classrooms];

  for (const currentRoom of allRooms) {
    for (const item of Object.values(currentRoom.equipment)) {
      item.broken = false;
    }
  }

  // 音楽室の電気は必ず不備あり
  musicRoom.equipment.light.broken = true;

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

  // 追加で6か所に不備を設定
  candidates.slice(0, 6).forEach(item => {
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
  inspectButton.hidden = true;

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

  renderRoom();

  setMessage("fixed", {
    item: t(target.nameKey)
  });
});