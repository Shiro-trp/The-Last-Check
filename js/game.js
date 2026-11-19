"use strict";

/* ========================================
    タイマー
======================================== */

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const timeText =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");

  timerElement.textContent =
    currentLanguage === "en"
      ? `Time left: ${timeText}`
      : `残り時間：${timeText}`;

  timerElement.classList.toggle(
    "time-warning",
    remainingSeconds <= 30
  );
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function startTimer() {
  stopTimer();

  remainingSeconds = TIME_LIMIT;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      stopTimer();
      failByTimeout();
    }
  }, 1000);
}

/* ========================================
    先生の話イベント
======================================== */

function applyTeacherTalk() {
  if (!todayEvents.teacherTalk) return;

remainingSeconds -= teacherTalkPenalty;

  updateTimerDisplay();

  // 先生の話イベント演出
  showTeacherTalkEffect();

  setMessage("teacherTalk" + teacherTalkPenalty);
  
  // 時間が0秒以下になった場合
  if (remainingSeconds <= 0) {
    stopTimer();
    failByTimeout();
  }
}

/* ========================================
    完退・時間切れ
======================================== */

function hideGameButtons() {
  leftButton.hidden = true;
  rightButton.hidden = true;
  inspectButton.hidden = true;
  fixButton.hidden = true;
  enterHallwayButton.hidden = true;
  enterClassroomButton.hidden = true;
  exitSchoolButton.hidden = true;
}

function failByTimeout() {
  if (gameFinished) return;

  gameFinished = true;

  stopMoving();
  stopHallMoving();
  stopTimer();

  if (actionTimer !== null) {
    clearTimeout(actionTimer);
    actionTimer = null;
  }

  isBusy = false;
  selectedEquipment = null;

  setMessage("timeoutMessage");

  result.hidden = true;
  hideGameButtons();

  restartButton.hidden = false;
}

function failByAdministrator() {
  if (gameFinished) return;

  gameFinished = true;

  stopMoving();
  stopHallMoving();
  stopTimer();

  if (actionTimer !== null) {
    clearTimeout(actionTimer);
    actionTimer = null;
  }

  isBusy = false;
  selectedEquipment = null;

  setMessage("administratorCaught");

  result.hidden = true;
  hideGameButtons();

  restartButton.hidden = false;
}

function finishGame() {
  if (!inHallway || gameFinished) return;

  const remaining = countAllIssues();

  // 校内に不備が残っている場合
  if (remaining > 0) {
    setMessage("issuesRemain", {
      n: remaining
    });

    return;
  }

  // 鍵当番など、追加の完退条件を満たしていない場合
  if (!canCompleteExit()) {
    setMessage("keyDutyIncomplete");
    return;
  }

  // 完退成功
  gameFinished = true;

  stopMoving();
  stopHallMoving();
  stopTimer();

  setMessage("success");

  hideGameButtons();
  restartButton.hidden = false;
}

/* ========================================
    リスタート
======================================== */

function restartGame() {
  resetMoveInput();
  stopMoving();
  stopHallMoving();
  stopBranchMoving();
  stopTimer();

  if (actionTimer !== null) {
    clearTimeout(actionTimer);
    actionTimer = null;
  }

  gameFinished = false;
  isBusy = false;
  selectedEquipment = null;
  resetInventory();

  // エリア状態を初期化
  inHallway = false;
  inBranchHallway = false;
  inMusicRoom = true;
  currentRoomIndex = 0;

  // 音楽室のプレイヤー
  playerX = 0;
  facing = 1;

  // 通常廊下のプレイヤー
  hallPlayerX = 0;
  hallFacing = -1;
  hallDirection = 0;

  // 分岐廊下のプレイヤー
  branchPlayerX = 0;
  branchFacing = 1;
  branchDirection = 0;

  // 画面を初期状態に戻す
  hallwayScene.hidden = true;
  branchHallwayScene.hidden = true;
  staffEntranceScene.hidden = true;
  staffOfficeScene.hidden = true;

  // ボタンを初期状態に戻す
  leftButton.hidden = false;
  rightButton.hidden = false;
  inspectButton.hidden = false;

  fixButton.hidden = true;
  enterHallwayButton.hidden = true;
  enterClassroomButton.hidden = true;
  enterBranchHallwayButton.hidden = true;
  enterStaffOfficeButton.hidden = true;
  exitSchoolButton.hidden = true;
  returnToHallwayButton.hidden = true;
  returnToBranchHallwayButton.hidden = true;
  restartButton.hidden = true;

  cleanupInstrumentsButton.hidden = true;
  restoreMusicRoomButton.hidden = true;

  // スクロール位置を初期化
  hallwayViewport.scrollLeft = 0;
  branchHallwayViewport.scrollLeft = 0;

  // タスク状態を初期化
  todayTasks = {
    musicRoomInspection: false,
    instrumentCleanup: false
  };

  eventTasks = {
    musicRoomLock: false,
    keyReturn: false,
    musicRoomRestoration: false
  };

  inStaffOffice = false;

  // 懐中電灯を再配布
  addItem("flashlight", "flashlightName", "🔦");

  // タスクパネルを初期状態に戻す
  document.getElementById("task-list").hidden = true;
  document.getElementById("task-arrow").textContent = "▼";

  // ゲーム画面を隠す
  room.hidden = true;
  hallwayScene.hidden = true;
  branchHallwayScene.hidden = true;
  staffEntranceScene.hidden = true;
  staffOfficeScene.hidden = true;
  result.hidden = true;

  // 活動内容選択画面に戻る
  titleScreen.style.display = "none";
  instructionsScreen.style.display = "none";
  settingsScreen.style.display = "none";
  activityScreen.style.display = "flex";

  // タイマーを非表示にする
  timerElement.hidden = true;

  // ゲーム中の表示状態を解除
  document.body.classList.remove("game-started");

  updatePlayer();
}