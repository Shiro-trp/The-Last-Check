"use strict";

/* ========================================
    教室内の移動
======================================== */

function updatePlayer() {
  const maxX = Math.max(
    0,
    room.clientWidth - player.offsetWidth
  );

  playerX = Math.max(0, Math.min(playerX, maxX));

  player.style.transform =
    `translateX(${playerX}px) scaleX(${-facing})`;

  updateAreaButtons();
  updateFlashlightPosition();
}

function animate(time) {
  if (!moveDirection || isBusy || inHallway || inBranchHallway || gameFinished) {
    animationId = null;
    return;
  }

  if (!lastTime) lastTime = time;

  const delta = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  playerX += moveDirection * speed * delta;

  const maxX = Math.max(
    0,
    room.clientWidth - player.offsetWidth
  );

  if (
    (playerX >= maxX && moveDirection > 0) ||
    (playerX <= 0 && moveDirection < 0)
  ) {
    playerX = Math.max(0, Math.min(playerX, maxX));
    updatePlayer();
    stopMoving();
    return;
  }

  updatePlayer();
  animationId = requestAnimationFrame(animate);
}

function startMoving(direction) {
  if (isBusy || inHallway || inBranchHallway || gameFinished) return;

  moveDirection = direction;
  facing = direction;

  selectedEquipment = null;
  fixButton.hidden = true;
  inspectButton.hidden = false;

  player.classList.add("walking");
  updatePlayer();

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
    廊下の移動
======================================== */

function getHallMaxX() {
  return Math.max(
    0,
    hallwayWorld.scrollWidth -
      hallPlayer.offsetWidth -
      hallPlayerLeftOffset
  );
}

function updateHallPlayer() {
  const maxX = getHallMaxX();

  hallPlayerX = Math.max(0, Math.min(hallPlayerX, maxX));

  hallPlayer.style.transform =
    `translateX(${hallPlayerX}px) scaleX(${-hallFacing})`;

  const maxScroll = Math.max(
    0,
    hallwayWorld.scrollWidth - hallwayViewport.clientWidth
  );

  const center =
    hallPlayerLeftOffset +
    hallPlayerX +
    hallPlayer.offsetWidth / 2;

  hallwayViewport.scrollLeft = Math.max(
    0,
    Math.min(
      center - hallwayViewport.clientWidth / 2,
      maxScroll
    )
  );

  updateAreaButtons();
  updateFlashlightPosition();
}

function animateHallway(time) {
  if (!hallDirection || !inHallway || isBusy || gameFinished) {
    hallAnimationId = null;
    return;
  }

  if (!hallLastTime) hallLastTime = time;

  const delta = Math.min((time - hallLastTime) / 1000, 0.05);
  hallLastTime = time;

  hallPlayerX += hallDirection * speed * delta;

  const maxX = getHallMaxX();

  if (
    (hallPlayerX >= maxX && hallDirection > 0) ||
    (hallPlayerX <= 0 && hallDirection < 0)
  ) {
    hallPlayerX = Math.max(0, Math.min(hallPlayerX, maxX));
    updateHallPlayer();
    stopHallMoving();
    return;
  }

  updateHallPlayer();
  hallAnimationId = requestAnimationFrame(animateHallway);
}

function startHallMoving(direction) {
  if (!inHallway || isBusy || gameFinished) return;

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
  const center =
    hallPlayerLeftOffset +
    hallPlayerX +
    hallPlayer.offsetWidth / 2;

  return hallDoorPositions.findIndex(position =>
    Math.abs(center - (position + 50)) < 75
  );
}

function isAtEntrance() {
  const center =
    hallPlayerLeftOffset +
    hallPlayerX +
    hallPlayer.offsetWidth / 2;

  return Math.abs(center - 1555) < 85;
}

/* ========================================
    分岐する廊下の移動
======================================== */

function getBranchMaxX() {
  return Math.max(
    0,
    branchHallwayWorld.scrollWidth -
      branchPlayerLeftOffset -
      branchHallPlayer.offsetWidth
  );
}

function updateBranchPlayer() {
  const maxX = getBranchMaxX();

  branchPlayerX = Math.max(
    0,
    Math.min(branchPlayerX, maxX)
  );

  branchHallPlayer.style.transform =
    `translateX(${branchPlayerX}px) scaleX(${-branchFacing})`;

  const maxScroll = Math.max(
    0,
    branchHallwayWorld.scrollWidth -
      branchHallwayViewport.clientWidth
  );

  const center =
    branchPlayerLeftOffset +
    branchPlayerX +
    branchHallPlayer.offsetWidth / 2;

  branchHallwayViewport.scrollLeft = Math.max(
    0,
    Math.min(
      center - branchHallwayViewport.clientWidth / 2,
      maxScroll
    )
  );

  updateAreaButtons();
  updateFlashlightPosition();
}

function animateBranchHallway(time) {
  if (
    !branchDirection ||
    !inBranchHallway ||
    isBusy ||
    gameFinished
  ) {
    branchAnimationId = null;
    return;
  }

  if (!branchLastTime) branchLastTime = time;

  const delta = Math.min((time - branchLastTime) / 1000, 0.05);
  branchLastTime = time;

  branchPlayerX += branchDirection * speed * delta;

  const maxX = getBranchMaxX();

  if (
    (branchPlayerX >= maxX && branchDirection > 0) ||
    (branchPlayerX <= 0 && branchDirection < 0)
  ) {
    branchPlayerX = Math.max(
      0,
      Math.min(branchPlayerX, maxX)
    );
    updateBranchPlayer();
    stopBranchMoving();
    return;
  }

  updateBranchPlayer();
  branchAnimationId =
    requestAnimationFrame(animateBranchHallway);
}

function startBranchMoving(direction) {
  if (!inBranchHallway || isBusy || gameFinished) return;

  branchDirection = direction;
  branchFacing = direction;

  branchHallPlayer.classList.add("walking");
  updateBranchPlayer();

  if (branchAnimationId === null) {
    branchLastTime = 0;
    branchAnimationId =
      requestAnimationFrame(animateBranchHallway);
  }
}

function stopBranchMoving() {
  branchDirection = 0;
  branchLastTime = 0;

  branchHallPlayer.classList.remove("walking");

  if (branchAnimationId !== null) {
    cancelAnimationFrame(branchAnimationId);
    branchAnimationId = null;
  }

  if (inBranchHallway) {
    updateBranchPlayer();
  }
}


/* ========================================
    事務室の移動
======================================== */

function getStaffOfficeMaxX() {
  return Math.max(
    0,
    staffOfficeWorld.scrollWidth -
      staffOfficePlayerLeftOffset -
      staffOfficePlayer.offsetWidth
  );
}

function updateStaffOfficePlayer() {
  const maxX = getStaffOfficeMaxX();

  staffOfficeX = Math.max(
    0,
    Math.min(staffOfficeX, maxX)
  );

  staffOfficePlayer.style.transform =
    `translateX(${staffOfficeX}px) scaleX(${-staffOfficeFacing})`;

  const maxScroll = Math.max(
    0,
    staffOfficeWorld.scrollWidth -
      staffOfficeViewport.clientWidth
  );

  const center =
    staffOfficePlayerLeftOffset +
    staffOfficeX +
    staffOfficePlayer.offsetWidth / 2;

  staffOfficeViewport.scrollLeft = Math.max(
    0,
    Math.min(
      center - staffOfficeViewport.clientWidth / 2,
      maxScroll
    )
  );

  updateAreaButtons();
  updateFlashlightPosition();
  updateKeyReturnButtonVisibility();
}

function animateStaffOffice(time) {
  if (
    !staffOfficeDirection ||
    !inStaffOffice ||
    isBusy ||
    gameFinished
  ) {
    staffOfficeAnimationId = null;
    return;
  }

  if (!staffOfficeLastTime) {
    staffOfficeLastTime = time;
  }

  const delta = Math.min(
    (time - staffOfficeLastTime) / 1000,
    0.05
  );

  staffOfficeLastTime = time;
  staffOfficeX += staffOfficeDirection * speed * delta;

  const maxX = getStaffOfficeMaxX();

  if (
    (staffOfficeX >= maxX && staffOfficeDirection > 0) ||
    (staffOfficeX <= 0 && staffOfficeDirection < 0)
  ) {
    staffOfficeX = Math.max(
      0,
      Math.min(staffOfficeX, maxX)
    );

    updateStaffOfficePlayer();
    stopStaffOfficeMoving();
    return;
  }

  updateStaffOfficePlayer();

  staffOfficeAnimationId =
    requestAnimationFrame(animateStaffOffice);
}

function startStaffOfficeMoving(direction) {
  if (!inStaffOffice || isBusy || gameFinished) return;

  staffOfficeDirection = direction;
  staffOfficeFacing = direction;

  staffOfficePlayer.classList.add("walking");
  updateStaffOfficePlayer();

  if (staffOfficeAnimationId === null) {
    staffOfficeLastTime = 0;

    staffOfficeAnimationId =
      requestAnimationFrame(animateStaffOffice);
  }
}

function stopStaffOfficeMoving() {
  staffOfficeDirection = 0;
  staffOfficeLastTime = 0;

  staffOfficePlayer.classList.remove("walking");

  if (staffOfficeAnimationId !== null) {
    cancelAnimationFrame(staffOfficeAnimationId);
    staffOfficeAnimationId = null;
  }

  if (inStaffOffice) {
    updateStaffOfficePlayer();
  }
}

/* ========================================
    懐中電灯の位置・向き更新
======================================== */
function updateFlashlightPosition() {
  const lightingLayer = document.getElementById("lighting-layer");
  const svg = document.getElementById("flashlight-svg");
  const cutout = document.getElementById("flashlight-cutout");
  const darkArea = document.getElementById("dark-area");

  // 部屋が消灯しているか確認
  const isInStaffEntrance =
  typeof inStaffEntrance !== "undefined" &&
  inStaffEntrance;

const isInStaffOffice =
  typeof inStaffOffice !== "undefined" &&
  inStaffOffice;

const isDark =
  !inHallway &&
  !inBranchHallway &&
  !isInStaffEntrance &&
  !isInStaffOffice &&
  room.classList.contains("dark");

  // 消灯していなければ照明レイヤーは不要
  if (!isDark) {
    lightingLayer.hidden = true;
    return;
  }

  lightingLayer.hidden = false;

  const layerRect = lightingLayer.getBoundingClientRect();
  const width = layerRect.width;
  const height = layerRect.height;

  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // 暗いレイヤーの大きさを画面に合わせる
  darkArea.setAttribute("x", "0");
  darkArea.setAttribute("y", "0");
  darkArea.setAttribute("width", width);
  darkArea.setAttribute("height", height);

  // 懐中電灯OFFなら部屋全体を暗くする
  if (!flashlightOn) {
    cutout.setAttribute("d", "");
    return;
  }

  let activePlayer = null;
  let direction = 1;

  if (inHallway) {
    activePlayer = hallPlayer;
    direction = hallFacing;
  } else if (inBranchHallway) {
    activePlayer = branchHallPlayer;
    direction = branchFacing;
  } else if (
    typeof inStaffEntrance !== "undefined" &&
    inStaffEntrance
  ) {
    activePlayer = staffEntrancePlayer;
    direction = staffEntranceFacing;
  } else if (
    typeof inStaffOffice !== "undefined" &&
    inStaffOffice
  ) {
    activePlayer = staffOfficePlayer;
    direction = staffOfficeFacing;
  } else {
    activePlayer = player;
    direction = facing;
  }

  if (!activePlayer) return;

  const playerRect = activePlayer.getBoundingClientRect();

  const startX =
    playerRect.left + playerRect.width / 2
    - layerRect.left + direction * 15;

  const startY =
    playerRect.top + playerRect.height * 0.35
    - layerRect.top;

  const distance = 420;

// 光の上下方向の広がり（約60度）
const angle = 30 * Math.PI / 180;
const spread = Math.tan(angle) * distance;

const endX = startX + direction * distance;
const path = `
  M ${startX} ${startY - 12}
  L ${endX} ${startY - spread}
  L ${endX} ${startY + spread}
  L ${startX} ${startY + 12}
  Z
`;

  cutout.setAttribute("d", path);
}