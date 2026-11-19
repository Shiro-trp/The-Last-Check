"use strict";

/* ========================================
    アイテム管理
======================================== */

const MAX_INVENTORY = 4;

let inventoryItems = [];
let selectedItem = null;
let flashlightOn = false;

/* ========================================
    アイテム操作
======================================== */

// アイテムを追加
function addItem(id, nameKey, icon) {
  // すでに所持している場合
  if (inventoryItems.some(item => item.id === id)) {
    return false;
  }

  // 最大所持数を超える場合
  if (inventoryItems.length >= MAX_INVENTORY) {
    setMessage("inventoryFull");
    return false;
  }

  inventoryItems.push({
    id,
    nameKey,
    icon
  });

  renderInventory();
  return true;
}

// アイテム欄を描画
function renderInventory() {
  inventorySlots.innerHTML = "";

  inventory.hidden = inventoryItems.length === 0;

  inventoryItems.forEach(item => {
    const slot = document.createElement("button");

    slot.className = "inventory-slot";
    slot.type = "button";

    if (selectedItem === item.id) {
    slot.classList.add("selected");
    }

    if (item.id === "flashlight" && flashlightOn) {
    slot.classList.add("flashlight-on");
    }

    const icon = document.createElement("span");
    icon.className = "inventory-icon";
    icon.textContent = item.icon;

    slot.append(icon);

    slot.addEventListener("click", () => {

  // 懐中電灯の場合
  if (item.id === "flashlight") {
    flashlightOn = !flashlightOn;

    // ONにしたら他のアイテムの選択を解除
    if (flashlightOn) {
      selectedItem = null;
    }

    renderInventory();
    updateFlashlightPosition();
    updateAreaButtons();
    return;
  }

  // その他のアイテム
  const wasFlashlightOn = flashlightOn;

  selectedItem = selectedItem === item.id
    ? null
    : item.id;

  // 他のアイテムを選択したら懐中電灯をOFF
  if (selectedItem !== null) {
    flashlightOn = false;
  }

  renderInventory();

  if (wasFlashlightOn && !flashlightOn) {
    updateFlashlightPosition();
  }

  // アイテム選択に合わせてエリアボタンを即時更新
  updateAreaButtons();
});
    
    inventorySlots.appendChild(slot);
  });
}

// アイテムを消費
function removeItem(id) {
  inventoryItems = inventoryItems.filter(
    item => item.id !== id
  );

  if (selectedItem === id) {
    selectedItem = null;
  }

  renderInventory();
}


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

// アイテム状態を初期化
function resetInventory() {
  inventoryItems = [];
  selectedItem = null;
  flashlightOn = false;

  renderInventory();
  updateFlashlightPosition();
}