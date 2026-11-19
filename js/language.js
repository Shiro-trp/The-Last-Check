"use strict";

/* ========================================
    翻訳データ
======================================== */
const TEXT = {
  ja: {
    // タイトル・画面
    title: "音楽室からの完退",
    subtitle: "放課後。まだ、帰れない。",
    start: "START GAME",
    briefing: "作戦説明",
    mission: "退校準備",
    missionSubtitle: "校内の確認を完了せよ。",
    controlsTitle: "【操作方法】",

    // 操作説明
    moveHelp: "◀ ▶：移動",
    inspectHelp: "調べる：設備の不備を確認",
    fixHelp: "不備を直す：見つけた不備を修正",
    goalHelp: "目標：すべての不備を解消して玄関へ",

    // 活動選択
    begin: "▶ ゲーム開始",
    chooseActivity: "▶ 活動内容を選択",
    activityHeader: "本日の活動内容",
    activityTitle: "今日の活動",
    activitySubtitle: "今日の活動内容を選択してください。",
    ensembleName: "合奏",
    ensembleDescription: "教室の不備が少ない / 音楽室の復元あり",
    sectionName: "パート練習",
    sectionDescription: "教室の不備が多い",
    individualName: "個人練習",
    individualDescription: "鍵当番が発生しやすい",
    confirmActivity: "▶ この活動で開始",

    // 設定
    languageLabel: "言語",
    back: "戻る",
    currentLanguage: "現在の言語：日本語",

    // エリア名
    musicRoom: "音楽室",
    entrance: "玄関",
    classroom1: "普通教室1",
    classroom2: "普通教室2",
    classroom3: "普通教室3",
    branchHallway: "管理棟",
    staffEntrance: "職員玄関",
    staffOffice: "事務室",

    // エリア移動
    initialMessage: "音楽室。設備を確認して、完退を目指そう。",
    toHallway: "廊下へ出る",
    enterClassroom: "教室に入る",
    backToMusic: "音楽室へ戻る",
    enterBranchHallway: "管理棟に行く",
    returnToHallway: "教室棟へ戻る",
    enterStaffEntrance: "職員玄関に入る",
    enterStaffOffice: "事務室に入る",
    returnToBranchHallway: "管理棟へ戻る",
    exitSchool: "玄関から完退する",

    // 事務室
    officeDesk: "事務机",
    returnKey: "鍵を返す",
    keyReturned: "鍵を返却した！",

    // ボタン
    restart: "もう一度プレイ",
    left: "◀ 左",
    right: "右 ▶",
    inspect: "調べる",
    fix: "不備を直す",

    // 設備
    windowName: "窓",
    lightName: "電気",
    deskName: "机・椅子",
    windowOpen: "開いている窓",
    windowClosed: "閉じている窓",
    deskBroken: "整頓前の机と椅子",
    deskFixed: "整頓済みの机と椅子",

    // 設備確認・修理
    lockMusicRoom: "音楽室を施錠する",
    musicRoomLocked: "音楽室を施錠した！",
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
    keyCabinetFound: "鍵保管庫を調べた。鍵を返却しよう。",
    returningKey: "鍵を返却しよう。",
    keyNotSelected: "鍵を返却するには、インベントリから鍵を選択してください。",
    keyNotOwned: "返却する鍵を持っていないようだ。",
    noKeyDuty: "今日は鍵当番ではないようだ。今は用はない。",
    musicRoomNotLocked: "音楽室が施錠されていないようだ。施錠してから鍵を返却しよう。",

    // メッセージ
    hallwayMessage: "廊下に出た。扉や玄関の近くまで歩こう。",
    doorFar: "扉の近くまで移動しよう。",
    enteredRoom: "{room}に入った。設備を確認しよう。",
    issuesRemain: "まだ校内に未修正の不備が{n}つある。確認しよう！",
    branchHallwayMessage: "管理棟に入った",
    enteredStaffOffice: "事務室に入った。",
    keyDutyIncomplete: "鍵当番の仕事が終わっていません。",
    musicRoomIssuesRemain: "音楽室に不備が残っている。すべて修繕してから施錠しよう。",

    // 楽器の片付け・音楽室の復元
    instrumentCleanupRequired: "楽器を片付けよう。",
    cleaningInstruments: "楽器を片付けています……",
    instrumentCleanupComplete: "楽器の片付けが完了した！",
    musicRoomRestorationRequired: "合奏後の音楽室を復元しよう。",
    restoringMusicRoom: "音楽室を復元しています……",
    musicRoomRestorationComplete: "音楽室の復元が完了した！",

    // ゲーム結果
    success: "🎉 完退成功！お疲れさま！",
    timeoutMessage: "時間切れ！3分以内に完退できなかった……。",
    administratorCaught: "管理員さんに捕まってしまった……。今回の完退は失敗だ。",
    administratorWarning: "見つかった！",

    //アイテム インベントリ
    musicRoomKeyName: "音楽室の鍵",
    flashlightName: "懐中電灯",
    inventoryFull: "アイテムをこれ以上持てない！",

    //タスク
    taskInstrumentCleanup: "楽器片付け",
    taskIssuesRemaining: "不備 残り{n}個",
    taskLockMusicRoom: "音楽室の施錠",
    taskReturnKey: "鍵の返却",
    taskRestoreMusicRoom: "音楽室の復元",
    taskExitSchool: "玄関を出て完退",

    // イベント
    teacherTalk30: "先生に少し呼び止められてしまった！残り時間が30秒減少した。",
    teacherTalk45: "先生の話が少し長引いてしまった！残り時間が45秒減少した。",
    teacherTalk60: "先生の長い話に付き合うことになってしまった！残り時間が60秒減少した。",
    teacherTalkTitle: "先生のお話",
    teacherTalkDescription: "先生の話が始まってしまった！",
    keyDutyTitle: "鍵当番",
    keyDutyDescription:
    "今日は音楽室の鍵当番だ。音楽室の不備を確認し、鍵を閉めて事務室に返却しよう。",
  },

  en: {
    // Title and screens
    title: "The Last Check",
    subtitle: "School is over. You are not going home yet.",
    start: "START GAME",
    briefing: "MISSION BRIEFING",
    mission: "Final Inspection",
    missionSubtitle: "Complete the school inspection.",
    controlsTitle: "CONTROLS",

    // Instructions
    moveHelp: "◀ ▶: Move",
    inspectHelp: "Inspect: Check equipment for problems",
    fixHelp: "Fix: Repair identified problems",
    goalHelp: "Goal: Fix all problems and leave the school",

    // Activity selection
    begin: "▶ Start Game",
    chooseActivity: "▶ Choose Activity",
    activityHeader: "TODAY'S PRACTICE",
    activityTitle: "Today's Activity",
    activitySubtitle: "Choose today's activity.",
    ensembleName: "Ensemble Practice",
    ensembleDescription: "Fewer classroom problems / Music room restoration required",
    sectionName: "Section Practice",
    sectionDescription: "More classroom problems",
    individualName: "Individual Practice",
    individualDescription: "Higher chance of key duty",
    confirmActivity: "▶ Start with This Activity",

    // Settings
    languageLabel: "Language",
    back: "Back",
    currentLanguage: "Current language: English",

    // Area names
    musicRoom: "Music Room",
    entrance: "Entrance",
    classroom1: "Classroom 1",
    classroom2: "Classroom 2",
    classroom3: "Classroom 3",
    branchHallway: "Administration Building",
    staffEntrance: "Staff Entrance",
    staffOffice: "Administrative Office",

    // Area transitions
    initialMessage: "Music Room. Check the equipment and prepare to leave.",
    toHallway: "Go to Hallway",
    enterClassroom: "Enter Classroom",
    backToMusic: "Return to Music Room",
    enterBranchHallway: "Enter Branch Hallway",
    returnToHallway: "Return to Main Hallway",
    enterStaffEntrance: "Enter Staff Entrance",
    enterStaffOffice: "Enter Administrative Office",
    returnToBranchHallway: "Return to Branch Hallway",
    exitSchool: "Leave through the Entrance",

    // Administrative office
    officeDesk: "Office Desk",
    returnKey: "Return Key",
    keyReturned: "The key has been returned!",

    // Buttons
    restart: "Play Again",
    left: "◀ Left",
    right: "Right ▶",
    inspect: "Inspect",
    fix: "Fix",

    // Equipment
    windowName: "Window",
    lightName: "Light",
    deskName: "Desks and Chairs",
    windowOpen: "Open Window",
    windowClosed: "Closed Window",
    deskBroken: "Untidy Desks and Chairs",
    deskFixed: "Neatly Arranged Desks and Chairs",

    // Inspection and repair
    lockMusicRoom: "Lock the Music Room",
    musicRoomLocked: "The music room has been locked!",
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
    keyCabinetFound: "You checked the key cabinet. It's time to return the key.",
    returningKey: "Let's return the key.",
    keyNotSelected: "Select the key in your inventory to return it.",
    keyNotOwned: "You don't have a key to return.",
    noKeyDuty: "You are not on key duty today. There is no reason to use this cabinet.",
    musicRoomNotLocked: "The music room is still unlocked. Lock it before returning the key.",

    // Messages
    hallwayMessage: "You're in the hallway. Walk toward a classroom or the exit.",
    doorFar: "Move closer to a door.",
    enteredRoom: "Entered {room}. Check the equipment.",
    issuesRemain: "{n} unfixed problems remain in the school. Keep checking!",
    branchHallwayMessage: "You entered the Administration Building.",
    enteredStaffOffice: "You entered the staff office.",
    keyDutyIncomplete: "You haven't finished your key duty.",
    musicRoomIssuesRemain: "There are still issues in the music room. Fix them all before locking it.",

    // Instrument Cleanup and Music Room Restoration
    instrumentCleanupRequired: "Put away the instruments.",
    cleaningInstruments: "Putting away the instruments...",
    instrumentCleanupComplete: "The instruments have been put away!",
    musicRoomRestorationRequired: "Restore the music room after ensemble practice.",
    restoringMusicRoom: "Restoring the music room...",
    musicRoomRestorationComplete: "The music room has been restored!",

    // Game results
    success: "🎉 INSPECTION COMPLETE! Well done!",
    timeoutMessage: "TIME'S UP! You couldn't leave within 3 minutes.",
    administratorCaught: "The administrator caught you! You failed to leave school successfully.",
    administratorWarning: "I've spotted you!",

    //Item Inventory
    musicRoomKeyName: "Music Room Key",
    flashlightName: "Flashlight",
    inventoryFull: "Your inventory is full!",

    //Task
    taskInstrumentCleanup: "Put away instruments",
    taskIssuesRemaining: "Problems remaining: {n}",
    taskLockMusicRoom: "Lock the music room",
    taskReturnKey: "Return the key",
    taskRestoreMusicRoom: "Restore the music room",
    taskExitSchool: "Leave through the entrance",

    // Event
    teacherTalk30: "The teacher briefly stopped you! 30 seconds have been deducted.",
    teacherTalk45: "The teacher's talk went on longer than expected! 45 seconds have been deducted.",
    teacherTalk60: "You got caught up in a long talk with the teacher! 60 seconds have been deducted.",
    teacherTalkTitle: "TEACHER'S TALK",
    teacherTalkDescription: "The teacher has started talking!",
    keyDutyTitle: "KEY DUTY",
    keyDutyDescription:
    "You are responsible for the music room key today. Check the room, lock it, and return the key to the office.",
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
