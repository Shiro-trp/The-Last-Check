"use strict";

// 読み込むCSSファイル
const styles = [
  "base.css",
  "title.css",
  "player.css",
  "events.css",
  "room.css",
  "equipment.css",
  "item.css",
  "game.css"
];

// 読み込むJavaScriptファイル
const scripts = [
  "language.js",
  "main.js",
  "player.js",
  "rooms.js",
  "equipment.js",
  "events.js",
  "tasks.js",
  "item.js",
  "game.js",
  "ui.js",
  "administrator.js"
];

// CSSを読み込む
async function loadStyles() {
  await Promise.all(
    styles.map(src => {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "css/" + src;

        link.onload = resolve;

        link.onerror = () => {
          reject(new Error(
            "CSSファイル「" + src + "」の読み込みに失敗しました"
          ));
        };

        document.head.appendChild(link);
      });
    })
  );
}

// JavaScriptを順番に読み込む
async function loadScripts() {
  for (const src of scripts) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.src = "js/" + src;

      script.onload = resolve;

      script.onerror = () => {
        reject(new Error(
          "JavaScriptファイル「" + src + "」の読み込みに失敗しました"
        ));
      };

      document.head.appendChild(script);
    });
  }
}

// 読み込み開始
async function startGame() {
  const loadingScreen = document.getElementById("loading-screen");
  const loadingProgress = document.getElementById("loading-progress");
  const loadingPercent = document.getElementById("loading-percent");

  // ロード開始時刻
  const startTime = Date.now();

  // 進捗表示
  function updateProgress(percent) {
    loadingProgress.style.width = percent + "%";
    loadingPercent.textContent = percent + "%";
  }

  try {
    // CSS読み込み
    await loadStyles();
    updateProgress(30);

    // JavaScript読み込み
    await loadScripts();
    updateProgress(90);

    // 最低3秒間表示
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, 3000 - elapsed);

    await new Promise(resolve => {
      setTimeout(resolve, remaining);
    });

    // 100%表示
    updateProgress(100);

    // 少し待ってロード画面を閉じる
    await new Promise(resolve => {
      setTimeout(resolve, 300);
    });

    loadingScreen.remove();
    document.getElementById("loading-style").remove();

  } catch (error) {
  console.error(error);

  loadingPercent.textContent = "ERROR";

  loadingProgress.style.width = "100%";
  loadingProgress.style.background = "#d33b35";

  const message = document.querySelector(".loading-message");

  message.textContent =
    "読み込みに失敗しました。ページを再読み込みしてください。";

  message.style.color = "#d33b35";
  }
}

startGame();