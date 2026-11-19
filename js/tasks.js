"use strict";

/* ========================================
    通常タスク
======================================== */
let todayTasks = {
  musicRoomInspection: false,
  instrumentCleanup: false,
};

/* ========================================
    イベントタスク
======================================== */
let eventTasks = {
  musicRoomLock: false,
  keyReturn: false,
  musicRoomRestoration: false
};

/* ========================================
    タスク表示
======================================== */

// タスク1件分のHTMLを作成
function createTaskItem(label, completed) {
  return `
    <div class="task-item ${completed ? "completed" : ""}">
      <span>${completed ? "✓" : "○"}</span>
      <span>${label}</span>
    </div>
  `;
}

// タスク一覧を更新
function updateTaskUI() {
  const progress = document.getElementById("task-progress");
  const normalList = document.getElementById("normal-task-list");
  const eventList = document.getElementById("event-task-list");

  // HTML要素がまだ存在しない場合は終了
  if (!progress || !normalList || !eventList) return;

  const issueCount = countAllIssues();

  // 通常タスク
  const normalTasks = [
    {
      label: t("taskInstrumentCleanup"),
      completed: todayTasks.instrumentCleanup
    },
    {
      label: t("taskIssuesRemaining", { n: issueCount }),
      completed: issueCount === 0
    }
  ];

  // イベントタスク
  const currentEventTasks = [];

  if (todayEvents.keyDuty) {
    currentEventTasks.push({
      label: t("taskLockMusicRoom"),
      completed: eventTasks.musicRoomLock
    });

    currentEventTasks.push({
      label: t("taskReturnKey"),
      completed: eventTasks.keyReturn
    });
  }

  if (todayEvents.musicRoomRestoration) {
    currentEventTasks.push({
      label: t("taskRestoreMusicRoom"),
      completed: eventTasks.musicRoomRestoration
    });
  }

  // タスク一覧を表示
  normalList.innerHTML = normalTasks
    .map(task => createTaskItem(task.label, task.completed))
    .join("");

  eventList.innerHTML = currentEventTasks
    .map(task => createTaskItem(task.label, task.completed))
    .join("");

  // 進捗を計算
  const allTasks = [...normalTasks, ...currentEventTasks];
  const completedCount = allTasks.filter(task => task.completed).length;

  progress.textContent = `${completedCount} / ${allTasks.length}`;

  // 全タスク完了時
  const allCompleted = completedCount === allTasks.length;

  document.getElementById("task-details").hidden = allCompleted;
  document.getElementById("task-exit").hidden = !allCompleted;
}

/* ========================================
    タスク完了処理
======================================== */

function completeTask(taskGroup, taskId) {
  const tasks = taskGroup === "event"
    ? eventTasks
    : todayTasks;

  if (!(taskId in tasks)) return;

  tasks[taskId] = true;

  updateTaskUI();
}

/* ========================================
    完退条件の判定
======================================== */

function canCompleteExit() {
  // 不備が残っている場合
  if (countAllIssues() > 0) return false;

  // 楽器の片付けが未完了の場合
  if (!todayTasks.instrumentCleanup) return false;

  // 合奏イベント発生時、音楽室の復元が未完了の場合
  if (
    todayEvents.musicRoomRestoration &&
    !eventTasks.musicRoomRestoration
  ) {
    return false;
  }

  // 鍵当番イベントのタスク
  if (todayEvents.keyDuty) {
    if (!eventTasks.musicRoomLock || !eventTasks.keyReturn) {
      return false;
    }
  }

  return true;
}

// 音楽室の不備数を取得
function countMusicRoomIssues() {
  return Object.values(musicRoom.equipment)
    .filter(item => item.broken).length;
}
