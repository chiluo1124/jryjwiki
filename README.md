# 旧日余烬设定百科 WIKI（多页面版）

《旧日余烬》—— 一月九十秋 著 · 粉丝设定站。

## 页面结构（每个模块一个独立页面，点导航切换，不再长滚动）

| 页面 | 内容 |
|------|------|
| `index.html` | 首页：世界观摘要 + 快速导航 |
| `world.html` | 世界观：魇灾 / 魇生物 / 觉醒 / 梦境行者 / 法律 |
| `paths.html` | 四途体系：织梦 · 窥梦 · 窃梦 · 驭梦 |
| `chars.html` | 人物（26 位，点卡片弹详情） |
| `factions.html` | 势力组织（8 个） |
| `yanzai.html` | 魇灾图鉴（6 类） |
| `places.html` | 地点（8 处） |
| `items.html` | 物件 · 魇器（5 类） |
| `quiz.html` | **梦境行者资质测试（独立页，30 题）** |
| `chapters.html` | 章节目录（1-60 章） |
| `about.html` | 关于 |
| `search.html` | 搜索结果页 |

共享文件：`assets/style.css`（样式）、`assets/data.js`（全部数据）、`assets/common.js`（导航高亮、搜索、弹窗、数字动画）。

## 梦境测试说明

- 30 道选择题，每题 4 选项分别对应「织·窥·窃·驭」的资质权重。
- 数据在 `data.js` 的 `questions` 数组：每项为 `{q, o:[4个选项文本], w:"wprs"}`，
  `w` 的 4 个字母依次对应 A/B/C/D 选项归属的倾向（w=织, p=窥, s=窃, r=驭）。
- 修改题目：改 `q` / `o` / `w` 即可；`w` 保持 4 字母且最好恰好含一个 w、一个 p、一个 s、一个 r（分布均衡）。
- 结果映射：`PATH_RESULTS = {w,p,s,r}`，每项含 `name/emoji/color/desc/match/strengths`。

## 本地预览

直接用浏览器打开 `index.html` 即可（推荐 Chrome）。若搜索/弹窗报错，是因为浏览器对本地 `file://` 的限制，用任一静态服务器即可：

```bash
# 任选其一
python3 -m http.server 8000
# 或
npx serve .
```

然后访问 `http://localhost:8000`。

## 部署到 Netlify / GitHub Pages

1. 把整个 `wiki-site` 文件夹内容**全部上传到 GitHub 仓库根目录**（覆盖旧的单个 `index.html`）。
2. Netlify 设置：Branch = main，Build command = 留空，Publish directory = `.`。
3. 推送后自动部署，1-2 分钟生效。

## 验证（开发者用）

```bash
node verify.js      # 数据结构 + 打分逻辑 + 链接完整性（80 项）
node render_test.js # jsdom 真实 DOM 渲染（模拟点击测试全流程）
```
