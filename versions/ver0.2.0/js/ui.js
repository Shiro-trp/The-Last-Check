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
  settingsScreen.style.display = "none";

  document.body.classList.remove("game-started");
}

toInstructionsButton.addEventListener("click", () => {
  titleScreen.style.display = "none";
  settingsScreen.style.display = "none";
  instructionsScreen.style.display = "flex";
});

settingsButton.addEventListener("click", () => {
  titleScreen.style.display = "none";
  instructionsScreen.style.display = "none";
  settingsScreen.style.display = "flex";
});

startButton.addEventListener("click", () => {
  instructionsScreen.style.display = "none";
  settingsScreen.style.display = "none";

  document.body.classList.add("game-started");

  // 最初のメッセージを改めて表示
  setMessage("initialMessage");
  
  startTimer();
});

backToTitleButton.addEventListener("click", showTitle);

/* ========================================
    操作ボタンとブラウザイベント
======================================== */

leftButton.addEventListener("pointerdown", event => {
  event.preventDefault();

  if (inHallway) {
    startHallMoving(-1);
  } else {
    startMoving(-1);
  }
});

rightButton.addEventListener("pointerdown", event => {
  event.preventDefault();

  if (inHallway) {
    startHallMoving(1);
  } else {
    startMoving(1);
  }
});

document.addEventListener("pointerup", () => {
  stopMoving();
  stopHallMoving();
});

document.addEventListener("pointercancel", () => {
  stopMoving();
  stopHallMoving();
});

window.addEventListener("blur", () => {
  stopMoving();
  stopHallMoving();
});

window.addEventListener("resize", () => {
  updatePlayer();

  if (inHallway) {
    updateHallPlayer();
  }
});

enterHallwayButton.addEventListener("click", showHallway);

enterClassroomButton.addEventListener(
  "click",
  enterSelectedClassroom
);

exitSchoolButton.addEventListener("click", finishGame);

restartButton.addEventListener("click", restartGame);

/* ========================================
    初期化
======================================== */

randomizeIssues();

room.hidden = false;
hallwayScene.hidden = true;
result.hidden = false;

enterHallwayButton.hidden = true;
enterClassroomButton.hidden = true;
exitSchoolButton.hidden = true;

fixButton.hidden = true;
restartButton.hidden = true;

renderRoom();
updatePlayer();
applyLanguage();
showTitle();