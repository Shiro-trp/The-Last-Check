
"use strict";

/* ========================================
   1. 翻訳データ
======================================== */

const TEXT = {
  ja: {
    title: "音楽室からの完退",
    subtitle: "放課後。まだ、帰れない。",
    start: "START GAME",
    briefing: "作戦説明",
    mission: "退校準備",
    missionSubtitle: "校内の確認を完了せよ。",
    controlsTitle: "【操作方法】",
    moveHelp: "◀ ▶：移動",
    inspectHelp: "調べる：設備の不備を確認",
    fixHelp: "不備を直す：見つけた不備を修正",
    goalHelp: "目標：すべての不備を解消して玄関へ",
    begin: "▶ ゲーム開始",
    languageLabel: "言語",
    back: "戻る",
    gameTitle: "完退",
    initialMessage: "音楽室。設備を確認して、完退を目指そう。",
    entrance: "玄関",
    classroom1: "普通教室1",
    classroom2: "普通教室2",
    classroom3: "普通教室3",
    toHallway: "廊下へ出る",
    enterClassroom: "教室に入る",
    backToMusic: "音楽室へ戻る",
    exitSchool: "玄関から完退する",
    restart: "もう一度プレイ",
    left: "◀ 左",
    right: "右 ▶",
    inspect: "調べる",
    fix: "不備を直す",
    musicRoom: "音楽室",
    windowName: "窓",
    lightName: "電気",
    deskName: "机・椅子",
    windowOpen: "開いている窓",
    windowClosed: "閉じている窓",
    deskBroken: "整頓前の机と椅子",
    deskFixed: "整頓済みの机と椅子",
    remaining: "この教室の未修正の不備：{n}つ",
    roomComplete: "{room}の確認完了！",
    moving: "移動中…",
    farAway: "設備から遠い！近づいて調べよう。",
    inspectingDesk: "机と椅子を確認中…",
    deskBrokenMessage: "椅子が乱れている！整頓しよう。",
    deskOkay: "机と椅子に不備はない。確認完了！",
    broken: "{item}に不備がある！",
    normal: "{item}は正常だ。",
    fixingDesk: "椅子を整頓中…",
    deskFixedMessage: "椅子を整頓した！机の確認完了。",
    fixed: "{item}の不備を直した！",
    hallwayMessage: "廊下に出た。扉や玄関の近くまで歩こう。",
    doorFar: "扉の近くまで移動しよう。",
    enteredRoom: "{room}に入った。設備を確認しよう。",
    issuesRemain: "まだ校内に未修正の不備が{n}つある。確認しよう！",
    success: "🎉 完退成功！お疲れさま！",
    timeoutMessage: "時間切れ！5分以内に完退できなかった……。",
    currentLanguage: "現在の言語：日本語"
  },

  en: {
    title: "The Last Check",
    subtitle: "School is over. You are not going home yet.",
    start: "START GAME",
    briefing: "MISSION BRIEFING",
    mission: "Final Inspection",
    missionSubtitle: "Complete the school inspection.",
    controlsTitle: "[CONTROLS]",
    moveHelp: "◀ ▶: Move",
    inspectHelp: "INSPECT: Check for problems",
    fixHelp: "FIX: Repair any problems found",
    goalHelp: "GOAL: Fix every problem and reach the entrance",
    begin: "▶ START",
    languageLabel: "LANGUAGE",
    back: "BACK",
    gameTitle: "Final Inspection",
    initialMessage: "Music Room. Check the equipment and finish your inspection.",
    entrance: "EXIT",
    classroom1: "Classroom 1",
    classroom2: "Classroom 2",
    classroom3: "Classroom 3",
    toHallway: "Enter Hallway",
    enterClassroom: "Enter Classroom",
    backToMusic: "Return to Music Room",
    exitSchool: "Leave School",
    restart: "PLAY AGAIN",
    left: "◀ LEFT",
    right: "RIGHT ▶",
    inspect: "INSPECT",
    fix: "FIX",
    musicRoom: "Music Room",
    windowName: "Window",
    lightName: "Light",
    deskName: "Desks and Chairs",
    windowOpen: "Open window",
    windowClosed: "Closed window",
    deskBroken: "Untidy desks and chairs",
    deskFixed: "Neatly arranged desks and chairs",
    remaining: "Unfixed problems in this room: {n}",
    roomComplete: "{room}: Inspection complete!",
    moving: "Moving...",
    farAway: "Too far away! Move closer to the equipment.",
    inspectingDesk: "Checking desks and chairs...",
    deskBrokenMessage: "The chairs are out of place! Put them in order.",
    deskOkay: "The desks and chairs are fine!",
    broken: "There's a problem with the {item}!",
    normal: "The {item} is fine.",
    fixingDesk: "Arranging the chairs...",
    deskFixedMessage: "Chairs arranged! Desk inspection complete.",
    fixed: "Fixed the {item}!",
    hallwayMessage: "You're in the hallway. Walk toward a classroom or the exit.",
    doorFar: "Move closer to a door.",
    enteredRoom: "Entered {room}. Check the equipment.",
    issuesRemain: "{n} unfixed problems remain in the school. Keep checking!",
    success: "🎉 INSPECTION COMPLETE! Well done!",
    timeoutMessage: "TIME'S UP! You couldn't leave within 5 minutes.",
    currentLanguage: "Current language: English"
  }
};

let currentLanguage = "ja";

function t(key, values = {}) {
  let text = TEXT[currentLanguage][key] ?? key;

  for (const [name, value] of Object.entries(values)) {
    text = text.replaceAll(`{${name}}`, value);
  }

  return text;
}

/* ========================================
   2. HTML要素
======================================== */

const $ = id => document.getElementById(id);

const room = $("room");
const player = $("player");
const message = $("message");
const result = $("result");

const windowImage = $("window-image");
const lightImage = $("light-image");
const deskImage = $("desk-image");

const leftButton = $("left-button");
const rightButton = $("right-button");
const inspectButton = $("inspect-button");
const fixButton = $("fix-button");
const exitSchoolButton = $("exit-school-button");
const restartButton = $("restart-button");

const hallwayScene = $("hallway-scene");
const hallwayViewport = $("hallway-viewport");
const hallwayWorld = $("hallway-world");
const hallPlayer = $("hall-player");

const enterHallwayButton = $("enter-hallway");
const enterClassroomButton = $("enter-classroom");

const titleScreen = $("title-screen");
const instructionsScreen = $("instructions-screen");
const settingsScreen = $("settings-screen");

const toInstructionsButton = $("to-instructions-button");
const startButton = $("start-button");
const settingsButton = $("settings-button");
const backToTitleButton = $("back-to-title-button");
const japaneseButton = $("japanese-button");
const englishButton = $("english-button");
const languageStatus = $("language-status");

/* ========================================
   3. ゲームデータと状態
======================================== */

function createEquipment() {
  return {
    window: { nameKey: "windowName", position: 10, broken: false },
    desk: { nameKey: "deskName", position: 50, broken: false },
    light: { nameKey: "lightName", position: 90, broken: false }
  };
}

const musicRoom = {
  nameKey: "musicRoom",
  equipment: createEquipment()
};

const classrooms = [1, 2, 3].map(number => ({
  nameKey: `classroom${number}`,
  equipment: createEquipment()
}));

const hallDoorPositions = [250, 600, 950];
const hallPlayerLeftOffset = 30;
const speed = 180;

let currentRoomIndex = 0;
let inMusicRoom = true;
let inHallway = false;
let gameFinished = false;

const timerElement = document.getElementById("timer");
const TIME_LIMIT = 3 * 60;

let remainingSeconds = TIME_LIMIT;
let timerInterval = null;

let isBusy = false;
let selectedEquipment = null;

let playerX = 0;
let facing = 1;
let moveDirection = 0;
let lastTime = 0;
let animationId = null;

let hallPlayerX = 0;
let hallFacing = 1;
let hallDirection = 0;
let hallLastTime = 0;
let hallAnimationId = null;

let actionTimer = null;
let currentMessageKey = "initialMessage";
let currentMessageValues = {};

/* ========================================
   4. 共通の表示処理
======================================== */

function setMessage(key, values = {}) {
  currentMessageKey = key;
  currentMessageValues = values;
  message.textContent = t(key, values);
}

function getEquipment() {
  return inMusicRoom
    ? musicRoom.equipment
    : classrooms[currentRoomIndex].equipment;
}

function getCurrentRoomName() {
  return t(inMusicRoom
    ? musicRoom.nameKey
    : classrooms[currentRoomIndex].nameKey);
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = t("title");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });

  japaneseButton.classList.toggle("selected", currentLanguage === "ja");
  englishButton.classList.toggle("selected", currentLanguage === "en");

  languageStatus.textContent = t("currentLanguage");

  updateAreaButtons();
  renderRoom();
  setMessage(currentMessageKey, currentMessageValues);
}

function updateResult() {
  let remaining = 0;

  for (const item of Object.values(getEquipment())) {
    if (item.broken) remaining++;
  }

  result.textContent = t("remaining", { n: remaining });

  if (remaining === 0) {
    setMessage("roomComplete", { room: getCurrentRoomName() });
  }
}

function renderRoom() {
  const equipment = getEquipment();

  windowImage.src = equipment.window.broken
    ? "assets/window_open.png"
    : "assets/window_closed.png";
  windowImage.alt = t(equipment.window.broken ? "windowOpen" : "windowClosed");

  lightImage.classList.toggle("off", !equipment.light.broken);
  room.classList.toggle("dark", !equipment.light.broken);

  deskImage.src = equipment.desk.broken
    ? "assets/desk_false.png"
    : "assets/desk_true.png";
  deskImage.alt = t(equipment.desk.broken ? "deskBroken" : "deskFixed");

  deskImage.parentElement.hidden = inMusicRoom;
  room.classList.toggle("music-room", inMusicRoom);

  updateResult();
}

function countAllIssues() {
  const allRooms = [musicRoom, ...classrooms];
  return allRooms.reduce((total, currentRoom) =>
    total + Object.values(currentRoom.equipment)
      .filter(item => item.broken).length, 0);
}

/* ========================================
   5. 不備のランダム配置
======================================== */

function randomizeIssues() {
  const allRooms = [musicRoom, ...classrooms];

  for (const currentRoom of allRooms) {
    for (const item of Object.values(currentRoom.equipment)) {
      item.broken = false;
    }
  }

  musicRoom.equipment.light.broken = true;

  const candidates = [
    musicRoom.equipment.window,
    ...classrooms.flatMap(currentRoom =>
      Object.values(currentRoom.equipment))
  ];

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  candidates.slice(0, 6).forEach(item => {
    item.broken = true;
  });
}

/* ========================================
   6. 教室内の移動
======================================== */

function updatePlayer() {
  const maxX = Math.max(0, room.clientWidth - player.offsetWidth);
  playerX = Math.max(0, Math.min(playerX, maxX));

  player.style.transform =
    `translateX(${playerX}px) scaleX(${-facing})`;

  updateAreaButtons();
}

function animate(time) {
  if (!moveDirection || isBusy || inHallway || gameFinished) {
    animationId = null;
    return;
  }

  if (!lastTime) lastTime = time;

  const delta = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  playerX += moveDirection * speed * delta;

  const maxX = Math.max(0, room.clientWidth - player.offsetWidth);

  if (playerX >= maxX && moveDirection > 0 ||
      playerX <= 0 && moveDirection < 0) {
    playerX = Math.max(0, Math.min(playerX, maxX));
    stopMoving();
    updatePlayer();
    return;
  }

  updatePlayer();
  animationId = requestAnimationFrame(animate);
}

function startMoving(direction) {
  if (isBusy || inHallway || gameFinished) return;

  moveDirection = direction;
  facing = direction;
  selectedEquipment = null;
  fixButton.hidden = true;

  player.classList.add("walking");
  updatePlayer();
  setMessage("moving");

  if (animationId === null) {
    lastTime = 0;
    animationId = requestAnimationFrame(animate);
  }
}

function stopMoving() {
  moveDirection = 0;
  lastTime = 0;
  player.classList.remove("walking");

  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

/* ========================================
   7. 廊下の移動
======================================== */

function updateHallPlayer() {
  const maxX = Math.max(
    0,
    hallwayWorld.scrollWidth -
      hallPlayer.offsetWidth -
      hallPlayerLeftOffset
  );

  hallPlayerX = Math.max(0, Math.min(hallPlayerX, maxX));

  hallPlayer.style.transform =
    `translateX(${hallPlayerX}px) scaleX(${-hallFacing})`;

  const maxScroll = Math.max(
    0,
    hallwayWorld.scrollWidth - hallwayViewport.clientWidth
  );

  const center = hallPlayerLeftOffset +
    hallPlayerX + hallPlayer.offsetWidth / 2;

  hallwayViewport.scrollLeft = Math.max(
    0,
    Math.min(center - hallwayViewport.clientWidth / 2, maxScroll)
  );

  updateAreaButtons();
}

function animateHallway(time) {
  if (!hallDirection || !inHallway || gameFinished) {
    hallAnimationId = null;
    return;
  }

  if (!hallLastTime) hallLastTime = time;

  const delta = Math.min((time - hallLastTime) / 1000, 0.05);
  hallLastTime = time;
  hallPlayerX += hallDirection * speed * delta;

  updateHallPlayer();
  hallAnimationId = requestAnimationFrame(animateHallway);
}

function startHallMoving(direction) {
  if (!inHallway || gameFinished) return;

  hallDirection = direction;
  hallFacing = direction;
  hallPlayer.classList.add("walking");
  updateHallPlayer();

  if (hallAnimationId === null) {
    hallLastTime = 0;
    hallAnimationId = requestAnimationFrame(animateHallway);
  }
}

function stopHallMoving() {
  hallDirection = 0;
  hallLastTime = 0;
  hallPlayer.classList.remove("walking");

  if (hallAnimationId !== null) {
    cancelAnimationFrame(hallAnimationId);
    hallAnimationId = null;
  }

  if (inHallway) updateHallPlayer();
}

function findNearbyDoor() {
  const center = hallPlayerLeftOffset +
    hallPlayerX + hallPlayer.offsetWidth / 2;

  return hallDoorPositions.findIndex(position =>
    Math.abs(center - (position + 50)) < 75
  );
}

function isAtEntrance() {
  const center = hallPlayerLeftOffset +
    hallPlayerX + hallPlayer.offsetWidth / 2;

  return Math.abs(center - 1295) < 85;
}

/* ========================================
   8. エリア移動
======================================== */

function updateAreaButtons() {
  if (gameFinished) {
    enterHallwayButton.hidden = true;
    enterClassroomButton.hidden = true;
    exitSchoolButton.hidden = true;
    return;
  }

  if (inHallway) {
    enterHallwayButton.hidden = true;

    const atMusicRoom = hallPlayerX <= 0;
    const nearbyDoor = findNearbyDoor();
    const atExit = isAtEntrance();

    enterClassroomButton.hidden =
      atExit || (!atMusicRoom && nearbyDoor === -1);

    enterClassroomButton.textContent =
      t(atMusicRoom ? "backToMusic" : "enterClassroom");

    exitSchoolButton.hidden = !atExit;
    return;
  }

  exitSchoolButton.hidden = true;

  const maxX = Math.max(0, room.clientWidth - player.offsetWidth);
  enterHallwayButton.hidden = playerX < maxX - 15;
  enterClassroomButton.hidden = true;
}

function showHallway() {
  if (isBusy || inHallway || gameFinished) return;

  stopMoving();
  inHallway = true;
  room.hidden = true;
  hallwayScene.hidden = false;
  result.hidden = true;

  hallPlayerX = inMusicRoom
    ? 0
    : hallDoorPositions[currentRoomIndex] - 12;

  hallDirection = 0;
  hallFacing = inMusicRoom ? 1 : -1;

  updateHallPlayer();
  setMessage("hallwayMessage");
}

function enterSelectedClassroom() {
  if (!inHallway || gameFinished) return;

  const doorIndex = findNearbyDoor();
  const atMusicRoom = hallPlayerX <= 0;

  if (!atMusicRoom && doorIndex === -1) {
    setMessage("doorFar");
    return;
  }

  stopHallMoving();

  if (atMusicRoom) {
    inMusicRoom = true;
  } else {
    inMusicRoom = false;
    currentRoomIndex = doorIndex;
  }

  inHallway = false;
  hallwayScene.hidden = true;
  room.hidden = false;
  result.hidden = false;

  playerX = Math.max(0, room.clientWidth - player.offsetWidth);
  facing = -1;
  selectedEquipment = null;
  fixButton.hidden = true;

  renderRoom();
  updatePlayer();
  setMessage("enteredRoom", { room: getCurrentRoomName() });
}

/* ========================================
   9. 設備の調査と修正
======================================== */

inspectButton.addEventListener("click", () => {
  if (isBusy || inHallway || gameFinished) return;

  stopMoving();
  selectedEquipment = null;
  fixButton.hidden = true;

  const equipment = getEquipment();
  const keys = inMusicRoom
    ? ["window", "light"]
    : Object.keys(equipment);

  const maxX = Math.max(1, room.clientWidth - player.offsetWidth);
  const playerPercent = playerX / maxX * 100;

  let nearestKey = null;
  let nearestDistance = Infinity;

  for (const key of keys) {
    const distance = Math.abs(playerPercent - equipment[key].position);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestKey = key;
    }
  }

  if (nearestDistance > 18) {
    setMessage("farAway");
    return;
  }

  const target = equipment[nearestKey];

  if (nearestKey === "desk") {
    isBusy = true;
    setMessage("inspectingDesk");

    actionTimer = setTimeout(() => {
      actionTimer = null;
      isBusy = false;

      if (gameFinished || inHallway) return;

      selectedEquipment = nearestKey;

      if (target.broken) {
        setMessage("deskBrokenMessage");
        fixButton.hidden = false;
      } else {
        setMessage("deskOkay");
      }
    }, 2000);

    return;
  }

  selectedEquipment = nearestKey;

  if (target.broken) {
    setMessage("broken", { item: t(target.nameKey) });
    fixButton.hidden = false;
  } else {
    setMessage("normal", { item: t(target.nameKey) });
  }
});

fixButton.addEventListener("click", () => {
  if (selectedEquipment === null ||
      isBusy || inHallway || gameFinished) return;

  const target = getEquipment()[selectedEquipment];
  if (!target || !target.broken) return;

  const key = selectedEquipment;

  if (key === "desk") {
    isBusy = true;
    stopMoving();
    fixButton.hidden = true;
    setMessage("fixingDesk");

    actionTimer = setTimeout(() => {
      actionTimer = null;
      target.broken = false;
      selectedEquipment = null;
      isBusy = false;

      if (gameFinished || inHallway) return;

      renderRoom();
      setMessage("deskFixedMessage");
    }, 3000);

    return;
  }

  target.broken = false;
  selectedEquipment = null;
  fixButton.hidden = true;

  renderRoom();
  setMessage("fixed", { item: t(target.nameKey) });
});

/* ========================================
   10. 完退とリスタート
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

function failByTimeout() {
  if (gameFinished) return;

  gameFinished = true;

  stopMoving();
  stopHallMoving();
  stopTimer();

  setMessage("timeoutMessage");
  
  result.hidden = true;
  leftButton.hidden = true;
  rightButton.hidden = true;
  inspectButton.hidden = true;
  fixButton.hidden = true;
  enterHallwayButton.hidden = true;
  enterClassroomButton.hidden = true;
  exitSchoolButton.hidden = true;

  restartButton.hidden = false;
}

function finishGame() {
  if (!inHallway || gameFinished) return;

  const remaining = countAllIssues();

  if (remaining > 0) {
    setMessage("issuesRemain", { n: remaining });
    return;
  }

  gameFinished = true;
stopMoving();
stopHallMoving();
stopTimer();

setMessage("success");

  leftButton.hidden = true;
  rightButton.hidden = true;
  inspectButton.hidden = true;
  fixButton.hidden = true;
  enterHallwayButton.hidden = true;
  enterClassroomButton.hidden = true;
  exitSchoolButton.hidden = true;
  restartButton.hidden = false;
}

function restartGame() {
  stopMoving();
  stopHallMoving();

  if (actionTimer !== null) {
    clearTimeout(actionTimer);
    actionTimer = null;
  }

  gameFinished = false;
  isBusy = false;
  selectedEquipment = null;
  
  startTimer();
  
  inHallway = false;
  inMusicRoom = true;
  currentRoomIndex = 0;

  playerX = 0;
  facing = 1;
  hallPlayerX = 0;
  hallFacing = 1;

  room.hidden = false;
  hallwayScene.hidden = true;
  result.hidden = false;

  leftButton.hidden = false;
  rightButton.hidden = false;
  inspectButton.hidden = false;
  enterHallwayButton.hidden = true;
  enterClassroomButton.hidden = true;
  exitSchoolButton.hidden = true;
  restartButton.hidden = true;
  fixButton.hidden = true;

  hallwayViewport.scrollLeft = 0;

  randomizeIssues();
  renderRoom();
  updatePlayer();
  setMessage("initialMessage");
}

/* ========================================
   11. 言語と画面切り替え
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
  document.body.classList.add("game-started");

  startTimer();
});

backToTitleButton.addEventListener("click", showTitle);

japaneseButton.addEventListener("click", () => {
  currentLanguage = "ja";
  applyLanguage();
});

englishButton.addEventListener("click", () => {
  currentLanguage = "en";
  applyLanguage();
});

/* ========================================
   12. ブラウザと操作ボタンのイベント
======================================== */

leftButton.addEventListener("pointerdown", event => {
  event.preventDefault();
  inHallway ? startHallMoving(-1) : startMoving(-1);
});

rightButton.addEventListener("pointerdown", event => {
  event.preventDefault();
  inHallway ? startHallMoving(1) : startMoving(1);
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
  if (inHallway) updateHallPlayer();
});

enterHallwayButton.addEventListener("click", showHallway);
enterClassroomButton.addEventListener("click", enterSelectedClassroom);
exitSchoolButton.addEventListener("click", finishGame);
restartButton.addEventListener("click", restartGame);

/* ========================================
   13. 初期化
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
