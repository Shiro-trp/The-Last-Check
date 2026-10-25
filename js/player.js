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
}

function animate(time) {
  if (
    !moveDirection ||
    isBusy ||
    inHallway ||
    gameFinished
  ) {
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
    Math.min(
      center - hallwayViewport.clientWidth / 2,
      maxScroll
    )
  );

  updateAreaButtons();
}

function animateHallway(time) {
  if (!hallDirection || !inHallway || gameFinished) {
    hallAnimationId = null;
    return;
  }

  if (!hallLastTime) hallLastTime = time;

  const delta = Math.min(
    (time - hallLastTime) / 1000,
    0.05
  );

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