"use strict";

/* ========================================
    イベント設定
======================================== */

// イベントの発生確率
const EVENT_PROBABILITIES = {
  teacherTalk: 0.40,

  keyDuty: {
    ensemble: 0.10,
    section: 0.10,
    individual: 0.40
  }
};

// 先生の話による時間減少パターン
const TEACHER_TALK_PENALTIES = [30, 45, 60];

/* ========================================
    イベントデータ
======================================== */

// 今日発生するイベント
let todayEvents = {
  teacherTalk: false,
  keyDuty: false,
  musicRoomRestoration: false
};

let teacherTalkPenalty = 0;

/* ========================================
    イベントの抽選
======================================== */

function determineEvents() {
  // 前回のイベントをリセット
  todayEvents = {
    teacherTalk: false,
    keyDuty: false,
    musicRoomRestoration: false
  };

  // 先生の話：全活動共通で40%
  todayEvents.teacherTalk =
    Math.random() < EVENT_PROBABILITIES.teacherTalk;

  // 鍵当番：活動内容によって確率が変化
  const keyDutyProbability =
    EVENT_PROBABILITIES.keyDuty[selectedActivity];

  todayEvents.keyDuty =
    Math.random() < keyDutyProbability;

  // 合奏：音楽室の復元が必須
  todayEvents.musicRoomRestoration =
    selectedActivity === "ensemble";

  // 先生の話の時間減少を抽選
  teacherTalkPenalty =
    TEACHER_TALK_PENALTIES[
      Math.floor(Math.random() * TEACHER_TALK_PENALTIES.length)
    ];
}

/* ========================================
    共通イベント演出
======================================== */

function showEventEffect(options) {
  const {
    id,
    titleKey,
    descriptionKey,
    duration,
    showTime = false,
    onComplete = null
  } = options;

  if (gameFinished) return;

  let overlay = document.getElementById(id);

  // オーバーレイがなければ作成
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = id;

    overlay.innerHTML = `
      <div class="teacher-talk-content">
        <p class="teacher-talk-warning">UNEXPECTED EVENT</p>
        <h2></h2>
        <div class="teacher-talk-scroll">
          <div class="teacher-talk-scroll-text"></div>
        </div>
        <p class="teacher-talk-time"></p>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  // タイトル
  overlay.querySelector("h2").textContent =
    t(titleKey);

  // スクロールメッセージ
  overlay.querySelector(
    ".teacher-talk-scroll-text"
  ).textContent =
    t(descriptionKey) +
    "　　" +
    t(descriptionKey);

  // 時間減少表示
  const timeElement =
    overlay.querySelector(".teacher-talk-time");

  if (showTime) {
    timeElement.textContent =
      `TIME -${teacherTalkPenalty} SEC`;

    timeElement.hidden = false;
  } else {
    timeElement.hidden = true;
  }

  // 演出中は移動・操作を禁止
  isBusy = true;

  stopMoving();
  stopHallMoving();
  stopBranchMoving();

  // 演出を再生
  overlay.classList.remove("show");

  void overlay.offsetWidth;

  overlay.classList.add("show");

  // 指定時間後に演出終了
  setTimeout(() => {
    overlay.classList.remove("show");

    // 移動入力を解除
    stopMoving();
    stopHallMoving();
    stopBranchMoving();

    // ゲーム終了時は次のイベントを実行しない
    if (gameFinished) {
      isBusy = false;
      return;
    }

    // 次のイベントがあれば実行
    if (onComplete) {
      onComplete();
    } else {
      // すべての演出が終了
      isBusy = false;
    }

  }, duration);
}

/* ========================================
    鍵当番イベント演出
======================================== */
function showKeyDutyNotice() {
  if (!todayEvents.keyDuty || gameFinished) return;

  // 鍵をインベントリに追加
  const added = addItem(
    "musicRoomKey",
    "musicRoomKeyName",
    "🔑"
  );

  if (!added) return;

  showEventEffect({
    id: "key-duty-overlay",
    titleKey: "keyDutyTitle",
    descriptionKey: "keyDutyDescription",
    duration: 5000
  });
}
/* ========================================
    先生の話イベント演出
======================================== */

function showTeacherTalkEffect() {
  showEventEffect({
    id: "teacher-talk-overlay",
    titleKey: "teacherTalkTitle",
    descriptionKey: "teacherTalkDescription",
    duration: 3000,
    showTime: true,

    // 先生の話が終わったら鍵当番を通知
    onComplete: () => {
      if (todayEvents.keyDuty) {
        showKeyDutyNotice();
      } else {
        isBusy = false;
      }
    }
  });
}