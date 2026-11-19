# 音楽室からの完退 The Last Check

### Version: 0.3.0 (Prototype)

## 日本語 / English

---

## 日本語

### ゲーム概要

『音楽室からの完退』は、放課後の学校を舞台にした、探索とシミュレーションの要素を組み合わせたゲームです。

プレイヤーは部活動終了後の音楽室から活動を開始します。活動内容を選択し、設備の点検や片付けなど、完退に必要な作業を進めながら校内を探索します。

校内では、活動内容や行動、場所などに応じてさまざまなイベントが発生します。また、管理員さん（鬼）が校内を巡回しています。見つかると追いかけられ、捕まるとゲームオーバーになってしまいます。

必要な作業をすべて終え、管理員さんに捕まることなく玄関から学校を退出することが目標です。

本作は現在開発中のβ版です。

### 操作方法

- ◀ / ▶：キャラクターを左右に移動
- 調べる：近くの設備を調べ、不備を確認
- 不備を直す：見つけた不備を修正
- 廊下へ出る：教室から廊下へ移動
- 教室に入る：廊下から教室へ入る
- 玄関から完退する：玄関から学校を出る
- もう一度プレイ：ゲームを最初からやり直す

### イベントについて

ゲーム中には、活動内容や行動、場所などに応じてさまざまなイベントが発生します。

主なイベントは以下のとおりです。

- 合奏イベント：音楽室の復元作業が必要になります。
- 先生の話イベント：発生すると制限時間が1分短縮されます。
- 鍵当番イベント：音楽室の施錠と職員室への鍵の返却が必要になります。

イベントによって通常の点検作業以外のタスクが発生することもあります。タスクパネルを確認し、必要な作業をすべて完了させましょう。

### クリア条件

1. 校内のすべての不備を修正する。
2. 5分以内に玄関へ到達する。

### ゲームオーバー条件

- 制限時間の5分を超過する。
- 管理員さんに捕まる。

ゲームオーバーになった場合は、「もう一度プレイ」を選択して再挑戦してください。

### 言語設定

タイトル画面の設定から、日本語と英語を切り替えられます。

---

## English

### Game Overview

The Last Check is a game that combines exploration and simulation, set in a school after club activities.

Players begin in the music room after their club activities. They choose an activity and explore the school while completing tasks such as inspecting facilities and putting equipment away.

Various events occur depending on the selected activity, player actions, and location. Meanwhile, a school administrator patrols the premises. If spotted, the administrator will chase the player. Getting caught results in a game over.

The goal is to complete all required tasks and leave the school through the entrance without getting caught.

This game is currently in development as a beta version.

### Controls

- ◀ / ▶: Move the character left or right
- Inspect: Check nearby facilities for problems
- Fix: Repair any problems you find
- Exit to Hallway: Move from the classroom into the hallway
- Enter Classroom: Enter a classroom from the hallway
- Leave School: Exit through the entrance
- Play Again: Restart the game

### Events

Various events occur depending on the selected activity, player actions, and location.

The main events include:

- Ensemble Event: Requires the player to restore the music room.
- Teacher Talk Event: Reduces the remaining time limit by one minute.
- Key Duty Event: Requires the player to lock the music room and return the key to the staff office.

Some events introduce additional tasks beyond the regular facility inspections. Check the task panel and make sure all required tasks are completed.

### Clear Conditions

1. Fix all problems throughout the school.
2. Reach the entrance within 5 minutes.

### Game Over Conditions

- The 5-minute time limit expires.
- You are caught by the school administrator.

If the game ends in failure, select "Play Again" to try once more.

### Language Settings

You can switch between Japanese and English from the settings menu on the title screen.

---

## バージョン情報 | Version Information

### ver.0.1 — Prototype

リリース日： 2026-10-23
ステータス： 開発中

実装済み機能

- タイトル画面・設定画面
- 日本語・英語の言語切り替え
- キャラクターの移動
- 校内マップの探索
- 設備の確認・不備の修正
- 3分間の制限時間
- 完退成功・時間切れによる完退失敗
- リスタート機能

### ver.0.2.0 — Administrator Update

リリース日：2026-10-26
ステータス：開発中

実装済み機能

- 管理員さん（鬼）の導入
- 管理員さんの巡回・追跡システム
- 捕まるとゲームオーバーになる機能
- ファイル構成の再編（css/・js/ フォルダの作成）
- その他、細かな修正

### ver.0.3.0 — Event & Activity Update

リリース日：2026-11-19
ステータス：開発中

実装済み機能

- 活動内容の選択機能（合奏・パート練習・個人練習）
- 活動内容に応じたゲーム内状況の変化
- イベントシステムの導入
- 場所や状況に応じたランダムイベント
- 校内マップの拡張（分岐廊下・職員室など）
- 鍵当番イベントと鍵返却ミニゲーム
- 作業タスクの管理機能
- 楽器の片付け・音楽室の復元
- ゲーム画面・操作性の改善
- その他、細かな修正
---

### ver.0.1 — Prototype

Release Date: October 23, 2026
Status: In Development

Implemented Features

- Title screen and settings menu
- Japanese and English language options
- Character movement
- School map exploration
- Facility inspection and repair
- 3-minute time limit
- Successful completion and timeout failure
- Restart functionality

### ver.0.2.0 — Administrator Update

Release Date: October 26, 2026
Status: In Development

Implemented Features

- Introduction of the administrator (enemy)
- Administrator patrol and chase system
- Game over when caught
- Reorganization of project files (creation of css/ and js/ directories)
- Various minor fixes

### ver.0.3.0 — Event & Activity Update

Release Date: November 19, 2026
Status: In Development

Implemented Features

- Activity selection (Ensemble, Section Practice, Individual Practice)
- Gameplay changes based on selected activities
- Introduction of the event system
- Random events based on location and situation
- Expanded school map (branch hallway, staff office, etc.)
- Key duty event and key return minigame
- Task management system
- Instrument cleanup and music room restoration
- Improvements to the game interface and controls
- Various minor fixes

---

### 開発状況 | Development Status

本作は現在、試作版 ver.0.3.0 の段階です。
今後のアップデートで機能や演出を追加していく予定です。

The game is currently in prototype version 0.3.0
More features and visual improvements may be added in future updates.
