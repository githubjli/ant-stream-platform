# Ant Stream Platform (MVP)

这是一个基于 Umi + Ant Design Pro Components 的最小可用前端页面，用于先完成“发现页 + 播放器”闭环。

## 已实现能力

- 左侧导航：`艺术频道`、`教育频道`（`config/routes.ts`）。
- 发现页：`ProList` 瀑布流卡片布局。
- 点击卡片：弹出 `Modal`，并渲染统一播放器 `UniversalPlayer`。
- 播放兼容：
  - 直播流：`.m3u8`（HLS）
  - 本地录像：`.mp4`

## 本地视频加载路径（AMS）

Ant Media Server 会把下面目录自动映射为 HTTP：

`/usr/local/antmedia/webapps/LiveApp/streams/`

例如把 `sample.mp4` 放到目录后，可直接通过以下地址访问：

`http://<AMS_HOST>:5080/LiveApp/streams/sample.mp4`

前端代码中已按此约定拼接 URL。

## AMS 列表接口

页面会优先请求：

`GET /LiveApp/rest/v2/broadcasts/list/0/200`

请求失败时自动回退到示例数据，方便先做 UI 联调。

## 运行

```bash
npm install
npm run start
```

可通过环境变量覆盖 AMS 地址：

```bash
UMI_APP_AMS_BASE_URL=http://your-ams-host:5080 npm run start
```
