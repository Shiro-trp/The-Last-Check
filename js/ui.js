"use strict";

/* ========================================
    言語切り替え
======================================== */

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = t("title");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  japaneseButton.classList.toggle(
    "selected",
    currentLanguage === "ja"
  );

  englishButton.classList.toggle(
    "selected",
    currentLanguage === "en"
  );

  languageStatus.textContent = t("currentLanguage");

  updateAreaButtons();
  renderRoom();

  setMessage(currentMessageKey, currentMessageValues);
}

japaneseButton.addEventListener("click", () => {
  currentLanguage = "ja";
  applyLanguage();
});

englishButton.addEventListener("click", () => {
  currentLanguage = "en";
  applyLanguage();
});

/* ========================================
    タイトル・設定・説明画面
======================================== */

function showTitle() {
  titleScreen.style.display = "flex";
  instructionsScreen.style.display = "none";
  activityScreen.style.display = "none";
  settingsScreen.style.display = "none";

  timerElement.hidden = true;

  document.body.classList.remove("game-started");
}

toInstructionsButton.addEventListener("click", () => {
  titleScreen.style.display = "none";
  settingsScreen.style.display = "none";
  instructionsScreen.style.display = "flex";

  timerElement.hidden = true;
});

settingsButton.addEventListener("click", () => {
  titleScreen.style.display = "none";
  instructionsScreen.style.display = "none";
  settingsScreen.style.display = "flex";

  timerElement.hidden = true;
});

// 作戦説明 → 活動内容選択
startButton.addEventListener("click", () => {
  instructionsScreen.style.display = "none";
  activityScreen.style.display = "flex";

  timerElement.hidden = true;
});

// 活動内容の選択
activityChoiceButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedActivity = button.dataset.activity;

    updateActivitySelection();
  });
});

// 選択状態の表示更新
function updateActivitySelection() {
  activityChoiceButtons.forEach(button => {
    button.classList.toggle(
      "selected",
      button.dataset.activity === selectedActivity
    );
  });
}

// 活動内容決定 → ゲーム開始
startGameButton.addEventListener("click", () => {
  activityScreen.style.display = "none";
  timerElement.hidden = false;

// 音楽室を表示
room.hidden = false;
hallwayScene.hidden = true;
branchHallwayScene.hidden = true;
staffEntranceScene.hidden = true;
staffOfficeScene.hidden = true;

// 設備の不備を再抽選
randomizeIssues();
// ゲーム開始直後のボタン表示
cleanupInstrumentsButton.hidden = true;
inspectButton.hidden = false;
fixButton.hidden = true;
renderRoom();
updateAreaButtons();

  // 今日のイベントを決定
  determineEvents();
  updateTaskUI();

  document.body.classList.add("game-started");

  setMessage("initialMessage");

  // タイマー開始
  startTimer();

  // 先生の話イベントを適用
  applyTeacherTalk();

  // 先生の話が発生しなかった場合は鍵当番を通知
  if (!todayEvents.teacherTalk) {
    showKeyDutyNotice();
  }
});

backToTitleButton.addEventListener("click", showTitle);

/* ========================================
    タスクパネルの開閉
======================================== */

const taskToggleButton =
  document.getElementById("task-toggle");

const taskList =
  document.getElementById("task-list");

const taskArrow =
  document.getElementById("task-arrow");

taskToggleButton.addEventListener("click", () => {
  const isOpen = taskList.hidden;

  taskList.hidden = !isOpen;
  taskArrow.textContent = isOpen ? "▲" : "▼";
});

/* ========================================
    操作ボタンとブラウザイベント
======================================== */

let activeMovePointerId = null;

// 移動開始
function handleMovePointerDown(event, direction) {
  event.preventDefault();

  // 同時に複数の指で操作しない
  if (activeMovePointerId !== null) return;

  activeMovePointerId = event.pointerId;

  event.currentTarget.setPointerCapture(event.pointerId);

  if (inStaffOffice) {
  startStaffOfficeMoving(direction);
  } else if (inBranchHallway) {
  startBranchMoving(direction);
  } else if (inHallway) {
  startHallMoving(direction);
  } else {
  startMoving(direction);
  }
}

function resetMoveInput() {
  activeMovePointerId = null;

  stopMoving();
  stopHallMoving();
  stopBranchMoving();
  stopStaffOfficeMoving();
}

// 移動停止
function handleMovePointerUp(event) {
  if (event.pointerId !== activeMovePointerId) return;

  activeMovePointerId = null;

  stopMoving();
  stopHallMoving();
  stopBranchMoving();
  stopStaffOfficeMoving();
}

leftButton.addEventListener("pointerdown", event => {
  handleMovePointerDown(event, -1);
});

rightButton.addEventListener("pointerdown", event => {
  handleMovePointerDown(event, 1);
});

leftButton.addEventListener("pointerup", handleMovePointerUp);
rightButton.addEventListener("pointerup", handleMovePointerUp);

leftButton.addEventListener("pointercancel", handleMovePointerUp);
rightButton.addEventListener("pointercancel", handleMovePointerUp);

leftButton.addEventListener("lostpointercapture", handleMovePointerUp);
rightButton.addEventListener("lostpointercapture", handleMovePointerUp);

window.addEventListener("blur", () => {
  activeMovePointerId = null;

  stopMoving();
  stopHallMoving();
  stopBranchMoving();
});

window.addEventListener("resize", () => {
  updatePlayer();

if (inStaffOffice) {
  updateFlashlightPosition();
}

  if (inHallway) {
    updateHallPlayer();
  }

  if (inBranchHallway) {
    updateBranchPlayer();
  }
});

enterHallwayButton.addEventListener("click", showHallway);

enterClassroomButton.addEventListener(
  "click",
  enterSelectedClassroom
);

enterBranchHallwayButton.addEventListener(
  "click",
  showBranchHallway
);

returnToHallwayButton.addEventListener(
  "click",
  returnToHallway
);

enterStaffOfficeButton.addEventListener(
  "click",
  enterStaffOffice
);

returnToBranchHallwayButton.addEventListener(
  "click",
  returnToBranchHallway
);

exitSchoolButton.addEventListener("click", finishGame);

restartButton.addEventListener("click", restartGame);

/* ========================================
    初期化
======================================== */

randomizeIssues();

room.hidden = false;
hallwayScene.hidden = true;
result.hidden = true;

enterHallwayButton.hidden = true;
enterClassroomButton.hidden = true;
enterBranchHallwayButton.hidden = true; // 追加
exitSchoolButton.hidden = true;

fixButton.hidden = true;
restartButton.hidden = true;

enterStaffOfficeButton.hidden = true;
returnToBranchHallwayButton.hidden = true;

renderRoom();
updatePlayer();
applyLanguage();
updateTaskUI();
showTitle();

addItem("flashlight", "flashlightName", "🔦");