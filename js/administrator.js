"use strict";

/* ========================================
   管理員さんの巡回・追跡
======================================== */

const administrator =
  document.getElementById("administrator");

// 管理員さんの表示先を切り替える
function moveAdministratorTo(area) {
  if (area === "branch") {
    branchHallwayWorld.appendChild(administrator);
  } else {
    hallwayWorld.appendChild(administrator);
  }
}

const administratorWarning =
  document.getElementById("administrator-warning");

// ----------------------------------------
// 位置・向き
// ----------------------------------------

// 管理員さんの現在位置
let administratorX = 420;
let administratorDirection = -1;
let administratorFacing = -1;

// 現在いる廊下
let administratorArea = "branch";

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
const administratorWorldWidth = 1660;
const administratorWidth = 64;

// 発見・追跡の距離
const administratorVisionRange = 180;
const administratorEscapeRange = 320;

// 巡回ルートの目標地点
const administratorPatrolRoute = [
  { area: "branch", x: 420 },   // 事務室前
  { area: "branch", x: 10 },    // 管理棟廊下の入口
  { area: "hallway", x: 1310 }, // 教室棟廊下の入口
  { area: "hallway", x: 10 },   // 音楽室前
  { area: "hallway", x: 1550 }, // 玄関前
  { area: "hallway", x: 1310 }, // 分岐廊下の入口
  { area: "branch", x: 10 },    // 管理棟廊下の入口
  { area: "branch", x: 420 }   // 事務室前
];

// 現在の巡回目標
let administratorPatrolIndex = 1;

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

// 管理棟廊下にいるプレイヤーの中心位置
function getBranchPlayerCenter() {
  return (
    branchPlayerLeftOffset +
    branchPlayerX +
    branchHallPlayer.offsetWidth / 2
  );
}

// 管理員さんとプレイヤーが同じ廊下にいるか
function isPlayerInAdministratorArea() {
  if (administratorArea === "branch") {
    return inBranchHallway;
  }

  return inHallway;
}

// 現在いる廊下に応じてプレイヤーの位置を取得
function getAdministratorTargetCenter() {
  if (administratorArea === "branch") {
    return getBranchPlayerCenter();
  }

  return getHallPlayerCenter();
}

function getAdministratorCenter() {
  return administratorX + administratorWidth / 2;
}

function getAdministratorMaxX() {
  const worldWidth =
    administratorArea === "branch"
      ? 600
      : administratorWorldWidth;

  return Math.max(
    administratorMinX,
    worldWidth -
      administratorWidth -
      administratorMargin
  );
}


/* ========================================
   教室退出直後の安全距離確保
======================================== */

function adjustAdministratorAfterRoomExit() {
  // 通常の廊下に管理員さんがいる場合のみ
  if (
    administratorArea !== "hallway" ||
    !inHallway ||
    gameFinished
  ) {
    return;
  }

  const playerCenter = getHallPlayerCenter();
  const administratorCenter = getAdministratorCenter();

  const distance = Math.abs(
    playerCenter - administratorCenter
  );

  // 接触判定距離より少し広い範囲を確保
  const safeDistance = administratorCatchDistance + 150;

  if (distance > safeDistance) return;

  const minX = administratorMinX;
  const maxX = getAdministratorMaxX();

  // プレイヤーの左側・右側に移動する候補
  const leftX = Math.max(
    minX,
    Math.min(
      maxX,
      playerCenter - safeDistance - administratorWidth / 2
    )
  );

  const rightX = Math.max(
    minX,
    Math.min(
      maxX,
      playerCenter + safeDistance - administratorWidth / 2
    )
  );

  // よりプレイヤーから離れられる側を選ぶ
  const leftDistance = Math.abs(
    playerCenter - (leftX + administratorWidth / 2)
  );

  const rightDistance = Math.abs(
    playerCenter - (rightX + administratorWidth / 2)
  );

  if (rightDistance >= leftDistance) {
    administratorX = rightX;
    administratorFacing = -1;
  } else {
    administratorX = leftX;
    administratorFacing = 1;
  }
}

/* ========================================
   プレイヤーの発見判定
======================================== */

function detectPlayer() {
  if (!isPlayerInAdministratorArea() || gameFinished) {
    administratorWarning.hidden = true;
    return false;
  }

  const distance =
    getAdministratorTargetCenter() -
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
   巡回目標への移動
======================================== */

function moveAdministratorAlongRoute(delta) {
  const target =
    administratorPatrolRoute[administratorPatrolIndex];

  // 現在の目標地点までの距離
  const distance = target.x - administratorX;

  // 到着判定
  if (Math.abs(distance) <= administratorSpeed * delta) {
    administratorX = target.x;

    // 次の巡回地点へ
    administratorPatrolIndex++;

    if (
      administratorPatrolIndex >=
      administratorPatrolRoute.length
    ) {
      administratorPatrolIndex = 0;
    }

    const nextTarget =
      administratorPatrolRoute[administratorPatrolIndex];

    // 廊下が変わる場合
    if (administratorArea !== nextTarget.area) {
      administratorArea = nextTarget.area;

      moveAdministratorTo(administratorArea);

      administratorX = nextTarget.x;
    }

    return;
  }

  // 目標地点の方向を向く
  administratorFacing = distance > 0 ? 1 : -1;

  // 目標地点へ移動
  administratorX +=
    administratorFacing *
    administratorSpeed *
    delta;
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

  // プレイヤーと別の廊下にいる場合は追跡しない
if (!isPlayerInAdministratorArea()) {
  administratorChasing = false;
  administratorWarning.hidden = true;
}

  // プレイヤーとの距離
  const distance =
  getAdministratorTargetCenter() -
  getAdministratorCenter();

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

  if (
  administratorChasing &&
  isPlayerInAdministratorArea()
) {
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
  moveAdministratorAlongRoute(delta);
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

// 管理員さんを現在の廊下に配置
moveAdministratorTo(administratorArea);

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
    !isPlayerInAdministratorArea() ||
    gameFinished ||
    !administratorChasing
  ) {
    return;
  }

  const playerCenter =
    getAdministratorTargetCenter();

  const administratorCenter =
    getAdministratorCenter();

  const distance = Math.abs(
    playerCenter - administratorCenter
  );

  if (distance <= administratorCatchDistance) {
    failByAdministrator();
  }
}
