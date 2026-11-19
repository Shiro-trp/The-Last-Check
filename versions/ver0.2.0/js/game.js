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

  if (remaining > 0) {
    setMessage("issuesRemain", {
      n: remaining
    });

    return;
  }

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
  stopMoving();
  stopHallMoving();
  stopTimer();

  if (actionTimer !== null) {
    clearTimeout(actionTimer);
    actionTimer = null;
  }

  gameFinished = false;
  isBusy = false;
  selectedEquipment = null;

  inHallway = false;
  inMusicRoom = true;
  currentRoomIndex = 0;

  playerX = 0;
  facing = 1;

  hallPlayerX = 0;
  hallFacing = 1;
  hallDirection = 0;

  room.hidden = false;
  hallwayScene.hidden = true;
  result.hidden = false;

  leftButton.hidden = false;
  rightButton.hidden = false;
  inspectButton.hidden = false;
  fixButton.hidden = true;

  enterHallwayButton.hidden = true;
  enterClassroomButton.hidden = true;
  exitSchoolButton.hidden = true;
  restartButton.hidden = true;

  hallwayViewport.scrollLeft = 0;

  randomizeIssues();

  renderRoom();
  updatePlayer();

  setMessage("initialMessage");
  startTimer();
}