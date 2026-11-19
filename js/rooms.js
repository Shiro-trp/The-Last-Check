"use strict";

/* ========================================
    エリア移動ボタン
======================================== */

function updateAreaButtons() {
  if (gameFinished) {
    enterHallwayButton.hidden = true;
    enterClassroomButton.hidden = true;
    enterBranchHallwayButton.hidden = true;
    exitSchoolButton.hidden = true;
    returnToHallwayButton.hidden = true;
    return;
  }

  // 通常の廊下
  if (inHallway) {
    enterHallwayButton.hidden = true;

    const atMusicRoom = hallPlayerX <= 15;
    const nearbyDoor = findNearbyDoor();
    const atExit = isAtEntrance();

    const center =
      hallPlayerLeftOffset +
      hallPlayerX +
      hallPlayer.offsetWidth / 2;

    const nearBranchHallway = Math.abs(center - 1310) < 75;

    enterClassroomButton.hidden =
  atExit ||
  nearBranchHallway ||
  (atMusicRoom && eventTasks.musicRoomLock) ||
  (!atMusicRoom && nearbyDoor === -1);

    const shouldLockMusicRoom =
  atMusicRoom &&
  todayEvents.keyDuty &&
  selectedItem === "musicRoomKey" &&
  !eventTasks.musicRoomLock;

enterClassroomButton.textContent = t(
  shouldLockMusicRoom
    ? "lockMusicRoom"
    : atMusicRoom
      ? "backToMusic"
      : "enterClassroom"
);
    
    enterBranchHallwayButton.hidden = !nearBranchHallway;
    exitSchoolButton.hidden = !atExit;

    enterStaffOfficeButton.hidden = true;
    returnToBranchHallwayButton.hidden = true;

    returnToHallwayButton.hidden = true;
    return;
  }

  // 事務室内部
  if (inStaffOffice) {
  enterStaffOfficeButton.hidden = true;
  returnToBranchHallwayButton.hidden = staffOfficeX > 15;

  enterHallwayButton.hidden = true;
  enterClassroomButton.hidden = true;
  enterBranchHallwayButton.hidden = true;
  exitSchoolButton.hidden = true;
  returnToHallwayButton.hidden = true;

  return;
}

  // 管理棟の廊下
  if (inBranchHallway) {
    enterHallwayButton.hidden = true;
    enterClassroomButton.hidden = true;
    enterBranchHallwayButton.hidden = true;
    exitSchoolButton.hidden = true;

    const center =
      branchPlayerLeftOffset +
      branchPlayerX +
      branchHallPlayer.offsetWidth / 2;

    const nearStaffOffice = Math.abs(center - 542) < 75;
    enterStaffOfficeButton.hidden = !nearStaffOffice;
    
    returnToHallwayButton.hidden = center >= 110;
    returnToBranchHallwayButton.hidden = true;

    return;
  }

  // 音楽室・教室など
  enterBranchHallwayButton.hidden = true;
  exitSchoolButton.hidden = true;
  returnToHallwayButton.hidden = true;
  enterStaffOfficeButton.hidden = true;
  returnToBranchHallwayButton.hidden = true;

  const maxX = Math.max(0, room.clientWidth - player.offsetWidth);

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
  enterStaffOfficeButton.hidden = true;
returnToBranchHallwayButton.hidden = true;

// 管理員さんとの距離を確保
adjustAdministratorAfterRoomExit();

// 管理員さんの位置を画面に反映
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

  // 鍵を選択している場合は音楽室を施錠
if (
  atMusicRoom &&
  todayEvents.keyDuty &&
  selectedItem === "musicRoomKey" &&
  !eventTasks.musicRoomLock
) {

  // 音楽室に不備が残っている場合
  const remaining = countMusicRoomIssues();

  if (remaining > 0) {
  setMessage("musicRoomIssuesRemain");
  return;
  }

  // 施錠完了
  completeTask("event", "musicRoomLock");

 // 鍵の選択を解除（所持は継続）
selectedItem = null;
renderInventory();

updateAreaButtons();

setMessage("musicRoomLocked");

  return;
}

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
  result.hidden = true;

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

/* ========================================
    分岐する廊下への移動
======================================== */

function showBranchHallway() {
  if (!inHallway || isBusy || gameFinished) return;

  stopHallMoving();
  stopAdministratorPatrol();

  inHallway = false;
  inBranchHallway = true;

  hallwayScene.hidden = true;
  branchHallwayScene.hidden = false;

  // プレイヤーを左端から登場させる
  branchPlayerX = 0;
  branchDirection = 0;
  branchFacing = 1;

  branchHallPlayer.classList.remove("walking");

  updateBranchPlayer();

  setMessage("branchHallwayMessage");
}

/* ========================================
    通常の廊下へ戻る
======================================== */

function returnToHallway() {
  if (!inBranchHallway || gameFinished) return;

  stopBranchMoving();

  inBranchHallway = false;
  inHallway = true;

  // 画面を切り替える
  branchHallwayScene.hidden = true;
  hallwayScene.hidden = false;

  // 分岐廊下の入口付近にプレイヤーを配置
  hallPlayerX =
    1310 -
    hallPlayerLeftOffset -
    hallPlayer.offsetWidth / 2;

  hallDirection = 0;
  hallFacing = -1;

  // プレイヤーの位置と画面を更新
  updateHallPlayer();

  // 管理員さんの巡回を再開
  updateAdministrator();
  startAdministratorPatrol();

  setMessage("hallwayMessage");
}

/* ========================================
    事務室への移動
======================================== */

function enterStaffOffice() {
  if (!inBranchHallway || isBusy || gameFinished) return;

  stopBranchMoving();

  inBranchHallway = false;
  inStaffOffice = true;
  staffOfficeX = 0;
  staffOfficeDirection = 0;
  staffOfficeFacing = 1;

  updateStaffOfficePlayer();

  branchHallwayScene.hidden = true;
  staffOfficeScene.hidden = false;

  // 事務室のプレイヤーの向き
  staffOfficeFacing = 1;
  staffOfficePlayer.style.transform =
    `scaleX(${-staffOfficeFacing})`;

  updateFlashlightPosition();

  setMessage("enteredStaffOffice");
}

/* ========================================
    事務室から分岐廊下へ戻る
======================================== */

function returnToBranchHallway() {
  if (!inStaffOffice || gameFinished) return;

  inStaffOffice = false;
  inBranchHallway = true;

  staffOfficeScene.hidden = true;
  branchHallwayScene.hidden = false;

  // 事務室のドア付近に配置
  branchPlayerX = 400;
  branchDirection = 0;
  branchFacing = -1;

  updateBranchPlayer();

  setMessage("branchHallwayMessage");
}