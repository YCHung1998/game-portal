# 🎮 Eason's Game Arcade

小遊戲總入口，收錄我做的各個小遊戲，點卡片直接連過去玩。

**👉 立即進入：<https://ychung1998.github.io/game-portal/>**

## 目前收錄

| 遊戲 | 說明 | 連結 |
|---|---|---|
| 五子棋 Gomoku | 15×15 五子棋，人機對戰／雙人 PK | <https://ychung1998.github.io/gomoku/> |
| 2048 | 經典數字合併遊戲，固定配色＋合併特效與音效 | <https://ychung1998.github.io/game-2048/> |
| 24點大師 Solve24 | 4 張牌湊 24 點的益智遊戲 | <https://solve24-game.onrender.com/> |

## 專案結構

```
game-portal/
├── index.html      版面骨架
├── style.css       復古像素風樣式
├── script.js       讀取 games.json 動態渲染卡片
├── games.json      遊戲清單（唯一需要維護的資料檔）
├── games.schema.json          games.json 的格式規範
├── thumbnails/                各遊戲縮圖
└── .github/workflows/
    ├── validate.yml           games.json 改動時自動做 schema 驗證
    └── link-check.yml         每週檢查所有遊戲連結是否還能連通
```

## 如何新增一個遊戲

不用改 HTML/CSS/JS，只要在 `games.json` 加一筆物件：

```json
{
  "id": "my-new-game",
  "title": "遊戲名稱",
  "description": "一句話描述",
  "url": "https://your-game-url",
  "thumbnail": "thumbnails/my-new-game.png",
  "tags": ["標籤1", "標籤2"],
  "status": "playable",
  "complexity": "simple"
}
```

欄位說明：

- `status`：`playable`（可玩）／`wip`（開發中，卡片會顯示遮罩且不可點）／`archived`（下架）
- `complexity`：`simple`（單頁小遊戲）／`complex`（較大型專案，`url` 可以是任何網址，不限 GitHub Pages）
- `thumbnail`：留空或圖片載入失敗時，卡片會自動顯示預設圖示，不影響顯示

丟一張縮圖進 `thumbnails/`（沒有也沒關係），commit push 即完成。

## 本機預覽

純靜態網站，直接雙擊開 `index.html` 會因為瀏覽器安全限制擋掉 `fetch('games.json')`，要用簡單的本機伺服器：

```bash
cd game-portal
python3 -m http.server 8000
# 開瀏覽器連 http://localhost:8000
```

## CI 檢查

- Push 或修改 `games.json` 時自動跑 schema 驗證，擋掉格式錯誤（漏欄位、打錯字等）
- 每週一自動檢查所有遊戲連結是否還能連通，連結失效會在 Actions 頁面顯示錯誤
