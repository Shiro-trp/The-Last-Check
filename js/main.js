"use strict";

/* ========================================
    翻訳データ
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
    timeoutMessage: "時間切れ！3分以内に完退できなかった……。",
    administratorCaught:
    "管理員さんに捕まってしまった……。今回の完退は失敗だ。",
    administratorWarning: "見つかった！",
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
    farAway: "Too far away! Move closer to the equipment.",
    inspectingDesk: "Checking desks and chairs…",
    deskBrokenMessage: "The chairs are out of place! Put them in order.",
    deskOkay: "The desks and chairs are fine!",
    broken: "There's a problem with the {item}!",
    normal: "The {item} is fine.",
    fixingDesk: "Arranging the chairs…",
    deskFixedMessage: "Chairs arranged! Desk inspection complete.",
    fixed: "Fixed the {item}!",
    hallwayMessage: "You're in the hallway. Walk toward a classroom or the exit.",
    doorFar: "Move closer to a door.",
    enteredRoom: "Entered {room}. Check the equipment.",
    issuesRemain: "{n} unfixed problems remain in the school. Keep checking!",
    success: "🎉 INSPECTION COMPLETE! Well done!",
    timeoutMessage: "TIME'S UP! You couldn't leave within 3 minutes.",
    administratorCaught:
    "The administrator caught you! You failed to leave school successfully.",
    administratorWarning: "I've spotted you!",
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

const TIME_LIMIT = 3 * 60;
const timerElement = $("timer");

let remainingSeconds = TIME_LIMIT;
let timerInterval = null;

let currentRoomIndex = 0;
let inMusicRoom = true;
let inHallway = false;
let gameFinished = false;
let isBusy = false;

let selectedEquipment = null;
let actionTimer = null;

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

let currentMessageKey = "initialMessage";
let currentMessageValues = {};
let messageTimeout = null;

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

  result.textContent = t("remaining", { n: remaining });

  if (remaining === 0) {
    setMessage("roomComplete", {
      room: getCurrentRoomName()
    });
  }
}