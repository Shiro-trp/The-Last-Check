"use strict";

/* ========================================
    エリア移動ボタン
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

    enterClassroomButton.textContent = t(
      atMusicRoom ? "backToMusic" : "enterClassroom"
    );

    exitSchoolButton.hidden = !atExit;
    return;
  }

  exitSchoolButton.hidden = true;

  const maxX = Math.max(
    0,
    room.clientWidth - player.offsetWidth
  );

  enterHallwayButton.hidden = playerX < maxX - 15;
  enterClassroomButton.hidden = true;
}

function showHallway() {
  if (isBusy || inHallway || gameFinished) return;

  stopMoving();

  selectedEquipment = null;
  fixButton.hidden = true;
  inspectButton.hidden = false;

  inHallway = true;

room.hidden = true;
hallwayScene.hidden = false;

// 管理員さんの現在位置をそのまま画面に反映
updateAdministrator();
startAdministratorPatrol();
  
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
  administratorChasing = false;
  administratorWarning.hidden = true;
  hallwayScene.hidden = true;
  room.hidden = false;
  result.hidden = false;

  playerX = Math.max(
    0,
    room.clientWidth - player.offsetWidth
  );

  facing = -1;
  selectedEquipment = null;

  fixButton.hidden = true;
  inspectButton.hidden = false;

  renderRoom();
  updatePlayer();

  setMessage("enteredRoom", {
    room: getCurrentRoomName()
  });
}
