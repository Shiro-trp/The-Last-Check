# The Last Check — ver.0.3.0

## Event System Update

## 日本語版

### 1. 実装予定の概要

- 活動内容選択システム
  
  - 合奏・パート練習・個人練習の3種類から選択。
  - 活動内容に応じて設備の不備数やイベント発生確率を変更する。
  - 不備数は合奏4〜6か所、パート練習8〜10か所、個人練習7か所を暫定値とする。

- イベントシステム
  
  - 先生の話：残り時間を60秒短縮。
  - 鍵当番：音楽室の施錠と鍵の返却が必要。個人練習で発生確率が上昇。
  - 合奏：音楽室の復元タスクが必須で発生。

- タスク管理システム
  
  - 設備修復タスク：窓・電気・机・椅子などの既存設備の修復。
  - 活動関連タスク：楽器の片付け、音楽室の復元、鍵当番など。
  - 楽器の片付けは毎回必須（約7秒）。
  - 音楽室の復元は合奏時のみ必須（約15秒）。

- 新エリア
  
  - 鍵当番に対応するため、事務室・職員玄関を追加する。

### 2. 実装方針

- 活動内容の選択時に、その日のイベント・タスクをすべて決定する。
- 設備修復と活動関連タスクを統一的に管理する。ただし、既存の設備管理・修復処理は維持する。
- "tasks.js" でタスク一覧・達成状況を管理し、完退判定と連携させる。
- "events.js" でイベントの抽選・管理を行う。
- タスク実行中はプレイヤーの移動を禁止する。
- 既存のゲームシステムへの影響を最小限に抑え、機能ごとに分けて実装する。
- リスタート時にはイベント・タスクを含むすべての状態を初期化する。
- 将来の完退評価システムを考慮し、拡張しやすい構造にする。

---

## English Version

### 1. Planned Features

- Practice Activity Selection
  
  - Choose from Ensemble Practice, Section Practice, and Individual Practice.
  - The selected activity affects the number of equipment issues and event probabilities.
  - Provisional issue counts: Ensemble 4–6, Section 8–10, Individual 7.

- Event System
  
  - Teacher's Talk: Reduces the remaining time by 60 seconds.
  - Key Duty: Requires locking the Music Room and returning its key. More likely during Individual Practice.
  - Ensemble: Makes the Music Room Restoration task mandatory.

- Task Management System
  
  - Equipment Repair Tasks: Repair existing equipment such as windows, lights, desks, and chairs.
  - Activity-related Tasks: Instrument cleanup, Music Room restoration, Key Duty, etc.
  - Instrument Cleanup is mandatory every game (approx. 7 seconds).
  - Music Room Restoration is mandatory during Ensemble Practice (approx. 15 seconds).

- New Areas
  
  - Add the Office and Staff Entrance for the Key Duty event.

### 2. Implementation Policy

- Determine all events and tasks when the player selects a practice activity.
- Manage equipment repairs and activity-related tasks under a unified task system while preserving existing equipment logic.
- Use "tasks.js" to manage task lists and completion status, integrating them with the game completion check.
- Use "events.js" to determine and manage events.
- Prevent player movement while performing a task.
- Minimize changes to existing systems and implement features separately.
- Reset all game states, including events and tasks, when restarting.
- Keep the system extensible for the future Completion Rating system.

---

### The Last Check — ver.0.3.0 Event System Update
