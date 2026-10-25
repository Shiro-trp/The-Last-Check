
"use strict";

/* ========================================
   管理員さんの巡回・追跡
======================================== */

const administrator =
  document.getElementById("administrator");

const administratorWarning =
  document.getElementById("administrator-warning");

// ----------------------------------------
// 位置・向き
// ----------------------------------------

let administratorX = 750;
let administratorDirection = 1;
let administratorFacing = 1;

// ----------------------------------------
// アニメーション
// ----------------------------------------

let administratorLastTime = 0;
let administratorAnimationId = null;

// ----------------------------------------
// 追跡状態
// ----------------------------------------

let administratorChasing = false;

// ----------------------------------------
// 設定
// ----------------------------------------

const administratorSpeed = 90;
const administratorChaseSpeed = 130;

const administratorMinX = 10;
const administratorMargin = 30;

// 廊下・管理員さんのサイズ
const administratorWorldWidth = 1400;
const administratorWidth = 64;

// 発見・追跡の距離
const administratorVisionRange = 180;
const administratorEscapeRange = 320;


/* ========================================
   位置の取得
======================================== */

function getHallPlayerCenter() {
  return (
    hallPlayerLeftOffset +
    hallPlayerX +
    hallPlayer.offsetWidth / 2
  );
}

function getAdministratorCenter() {
  return administratorX + administratorWidth / 2;
}

function getAdministratorMaxX() {
  return Math.max(
    administratorMinX,
    administratorWorldWidth -
      administratorWidth -
      administratorMargin
  );
}


/* ========================================
   プレイヤーの発見判定
======================================== */

function detectPlayer() {
  if (!inHallway || gameFinished) {
    administratorWarning.hidden = true;
    return false;
  }

  const distance =
    getHallPlayerCenter() -
    getAdministratorCenter();

  const isInFront =
    administratorFacing === 1
      ? distance > 0
      : distance < 0;

  const isInRange =
    Math.abs(distance) <= administratorVisionRange;

  const detected = isInFront && isInRange;

  administratorWarning.hidden = !detected;

  return detected;
}

/* ========================================
   表示の更新
======================================== */

function updateAdministrator() {
  // 座標を廊下の範囲内に制限
  administratorX = Math.max(
    administratorMinX,
    Math.min(getAdministratorMaxX(), administratorX)
  );

  // 左右位置と向きを更新
  administrator.style.left = administratorX + "px";
  administrator.style.transform =
    `scaleX(${-administratorFacing})`;

  // 警告表示の向きを調整
  administratorWarning.style.transform =
    `translateX(-50%) scaleX(${-administratorFacing})`;

  // 現在の言語に合わせて警告文を更新
  administratorWarning.textContent =
    t("administratorWarning");
}

/* ========================================
   巡回・追跡のアニメーション
======================================== */

function animateAdministrator(time) {
  // ゲーム終了
  if (gameFinished) {
    administrator.classList.remove("walking");
    administratorWarning.hidden = true;
    administratorChasing = false;
    administratorAnimationId = null;
    administratorLastTime = 0;
    return;
  }

  // 前回からの経過時間
  if (administratorLastTime === 0) {
    administratorLastTime = time;
  }

  const delta = Math.min(
    (time - administratorLastTime) / 1000,
    0.05
  );

  administratorLastTime = time;

  const maxX = getAdministratorMaxX();

  // 教室にいる間は追跡せず、巡回を続ける
  if (!inHallway) {
    administratorChasing = false;
    administratorWarning.hidden = true;
  }

  // プレイヤーとの距離
  const distance =
    getHallPlayerCenter() - getAdministratorCenter();

  const distanceAbs = Math.abs(distance);

  // ----------------------------------------
  // 発見
  // ----------------------------------------

  if (!administratorChasing && detectPlayer()) {
    administratorChasing = true;
  }

  // ----------------------------------------
  // 追跡
  // ----------------------------------------

  if (administratorChasing && inHallway) {
    // 十分に離れたら追跡終了
    if (distanceAbs > administratorEscapeRange) {
      administratorChasing = false;
      administratorWarning.hidden = true;
    } else {
      // プレイヤーの方向を向く
      if (distance > 0) {
        administratorFacing = 1;
      } else if (distance < 0) {
        administratorFacing = -1;
      }

      // プレイヤーへ移動
      administratorX +=
        administratorFacing *
        administratorChaseSpeed *
        delta;

      // 端で止める
      administratorX = Math.max(
        administratorMinX,
        Math.min(maxX, administratorX)
      );

      administratorWarning.hidden = false;
    }
  }

  // ----------------------------------------
  // 巡回
  // ----------------------------------------

  if (!administratorChasing) {
    administratorX +=
      administratorDirection *
      administratorSpeed *
      delta;

    // 右端
    if (administratorX >= maxX) {
      administratorX = maxX;
      administratorDirection = -1;
      administratorFacing = -1;
    }

    // 左端
    if (administratorX <= administratorMinX) {
      administratorX = administratorMinX;
      administratorDirection = 1;
      administratorFacing = 1;
    }
  }

  // 位置を画面へ反映
  updateAdministrator();

  checkAdministratorCollision();

if (gameFinished) {
  administratorAnimationId = null;
  return;
}

  // 次のフレーム
  administratorAnimationId =
    requestAnimationFrame(animateAdministrator);
}


/* ========================================
   巡回の開始
======================================== */

function startAdministratorPatrol() {
  if (
    administratorAnimationId !== null ||
    !inHallway ||
    gameFinished
  ) {
    return;
  }

  administratorLastTime = 0;

  administrator.classList.add("walking");

  updateAdministrator();

  administratorAnimationId =
    requestAnimationFrame(animateAdministrator);
}


/* ========================================
   教室に入ったときの処理
======================================== */

function stopAdministratorPatrol() {
  // 追跡だけ解除し、巡回アニメーションは継続
  administratorChasing = false;

  // 警告を消す
  administratorWarning.hidden = true;
}

/* ========================================
   管理員さんとの接触判定
======================================== */

const administratorCatchDistance = 42;

function checkAdministratorCollision() {
  if (
    !inHallway ||
    gameFinished ||
    !administratorChasing
  ) {
    return;
  }

  const playerCenter = getHallPlayerCenter();
  const administratorCenter = getAdministratorCenter();

  const distance = Math.abs(
    playerCenter - administratorCenter
  );

  if (distance <= administratorCatchDistance) {
  failByAdministrator();
  }
}
