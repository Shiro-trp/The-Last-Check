"use strict";

/* ========================================
    HTML要素
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
const returnKeyButton = $("return-key-button");
const cleanupInstrumentsButton = $("cleanup-instruments-button");
const restoreMusicRoomButton = $("restore-music-room-button");
const exitSchoolButton = $("exit-school-button");
const restartButton = $("restart-button");

const hallwayScene = $("hallway-scene");
const hallwayViewport = $("hallway-viewport");
const hallwayWorld = $("hallway-world");
const hallPlayer = $("hall-player");
const branchHallwayScene = $("branch-hallway-scene");
const branchHallwayViewport = $("branch-hallway-viewport");
const branchHallwayWorld = $("branch-hallway-world");
const branchHallPlayer = $("branch-hall-player");
const staffOfficeViewport = $("staff-office-viewport");
const staffOfficeWorld = $("staff-office-world");

const enterHallwayButton = $("enter-hallway");
const enterClassroomButton = $("enter-classroom");
const enterBranchHallwayButton = $("enter-branch-hallway");

const titleScreen = $("title-screen");
const instructionsScreen = $("instructions-screen");
const settingsScreen = $("settings-screen");

const activityScreen = $("activity-screen");
const startGameButton = $("start-game-button");
const activityChoiceButtons =
  document.querySelectorAll(".activity-choice");

const toInstructionsButton = $("to-instructions-button");
const startButton = $("start-button");
const settingsButton = $("settings-button");
const backToTitleButton = $("back-to-title-button");
const japaneseButton = $("japanese-button");
const englishButton = $("english-button");
const languageStatus = $("language-status");
const returnToHallwayButton = $("return-to-hallway-button");
const staffEntranceScene = $("staff-entrance-scene");
const staffOfficeScene = $("staff-office-scene");
const staffOfficePlayer = $("staff-office-player");

const instrumentStorage = $("instrument-storage");

const enterStaffOfficeButton = $("enter-staff-office");
const returnToBranchHallwayButton =
  $("return-to-branch-hallway");

const inventory = $("inventory");
const inventorySlots = $("inventory-slots");

/* ========================================
    ゲームデータ
======================================== */

function createEquipment() {
  return {
    window: {
      nameKey: "windowName",
      position: 10,
      broken: false
    },
    desk: {
      nameKey: "deskName",
      position: 50,
      broken: false
    },
    light: {
      nameKey: "lightName",
      position: 90,
      broken: false
    }
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

// 分岐する廊下
let inBranchHallway = false;
// 事務室
let inStaffOffice = false;
let staffOfficeFacing = 1;
let staffOfficeX = 0;
let staffOfficeDirection = 0;
let staffOfficeLastTime = 0;
let staffOfficeAnimationId = null;

const staffOfficePlayerLeftOffset = 30;

let branchPlayerX = 0;
let branchDirection = 0;
let branchFacing = 1;

let branchAnimationId = null;
let branchLastTime = 0;

const branchPlayerLeftOffset = 30;

const TIME_LIMIT = 5 * 60;
const timerElement = $("timer");

let selectedActivity = "ensemble";

/* ========================================
    共通処理
======================================== */

function formatMessage(text) {
  return text
    .replace(/([。！？.!?])\s*/g, "$1\n")
    .trim();
}

function setMessage(key, values = {}) {
  currentMessageKey = key;
  currentMessageValues = values;

  // 前のメッセージの消去タイマーを解除
  if (messageTimeout !== null) {
    clearTimeout(messageTimeout);
    messageTimeout = null;
  }

  // メッセージを表示
  const formattedText = formatMessage(t(key, values));
  message.textContent = formattedText;
  message.style.whiteSpace = "pre-line";

  // 3秒後にメッセージを消す
  messageTimeout = setTimeout(() => {
    message.textContent = "";
    messageTimeout = null;
  }, 3000);
}

function getEquipment() {
  return inMusicRoom
    ? musicRoom.equipment
    : classrooms[currentRoomIndex].equipment;
}

function getCurrentRoomName() {
  const key = inMusicRoom
    ? musicRoom.nameKey
    : classrooms[currentRoomIndex].nameKey;

  return t(key);
}

function countAllIssues() {
  const allRooms = [musicRoom, ...classrooms];

  return allRooms.reduce((total, currentRoom) => {
    return total + Object.values(currentRoom.equipment)
      .filter(item => item.broken).length;
  }, 0);
}


function updateResult() {
  const remaining = Object.values(getEquipment())
    .filter(item => item.broken).length;

  // 音楽室の設備確認タスク
  if (inMusicRoom && remaining === 0) {
    completeTask("normal", "musicRoomInspection");
  }

  // タスクパネルを更新
  updateTaskUI();

  // 部屋の不備がすべて修正された場合
  if (remaining === 0) {
    setMessage("roomComplete", {
      room: getCurrentRoomName()
    });
  }
}
