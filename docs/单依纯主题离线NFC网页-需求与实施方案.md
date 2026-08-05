# 单依纯主题离线 NFC 网页：需求与实施方案

> 文档版本：v0.1（方案阶段）  
> 日期：2026-08-05  
> 状态：待确认关键决策；不含艺人肖像、歌曲或音频文件。

> **决策更新（2026-08-05）**：不要求用户安装 App，采用 GitHub Pages 托管纯静态前端。NFC 标签写入 HTTPS 页面地址。该选择放弃“首次访问也可离线”的目标；用户首次轻触标签时必须能联网。

## 1. 结论与推荐方案

“把一个含照片与背景音乐的完整网页直接写进普通 NFC 芯片，并在手机上离线打开”**不可行**：NFC 标签应保存轻量 NDEF 启动数据，而不是网页、图片和音频资源；移动系统收到 NDEF 后通常按 URI / MIME 类型分发给应用。Android 的 NDEF 文档也将 URI、MIME 和应用专用记录作为常见载荷类型。[Android NFC 基础文档](https://developer.android.com/develop/connectivity/nfc/nfc)  

若要求首次断网也能打开，推荐做成 **移动端离线内容包 + NFC 启动器**：页面是嵌在 App 内的本地 H5，而不是由系统浏览器加载的网页。

```text
NFC 标签（contentId、版本、启动入口）
              ↓ 轻触
已安装的 iOS / Android App（原生 NFC + 本地 WebView）
              ↓
本地网页（HTML / CSS / JS / GSAP） + 本地图片贴图 + 本地音频
```

这样 NFC 仅负责“唤起”；页面、照片和 BGM 均打入 App 安装包，因此首次安装后可以在飞行模式下运行。iOS 可通过 Core NFC 读取和写入 NDEF 标签，但依赖具有 NFC 能力的设备和 App 能力；Android 同样支持 NDEF 读写与按记录分发。[Apple Core NFC](https://developer.apple.com/documentation/CoreNFC)  

### 方案对比

| 方案 | 是否真正离线 | 首次使用 | 支持面 | 推荐度 |
| --- | --- | --- | --- | --- |
| A. 原生壳 + 本地网页资源 + NFC | 是 | 安装 App 一次 | iOS / Android，可控 | 仅适合坚持真正离线时 |
| B. GitHub Pages 在线 URL + NFC | 否；首次及缓存失效后需联网 | 无安装 | iOS / Android 浏览器 | **本项目采用** |
| C. 在线 URL + PWA 预缓存 + NFC | 仅成功预缓存后可能 | 首次必须联网访问 | 浏览器与缓存策略有差异 | 可作为 B 的增强 |
| D. 将网页/照片/歌曲直接写标签 | 否 | 无 | 容量与系统打开方式均不成立 | 不采用 |

Web NFC 的浏览器兼容性不应作为跨平台主链路；MDN 明确提示生产使用需谨慎核验兼容性。因此，纯网页方案将标签写成普通 HTTPS URL，由系统浏览器打开，而不是让网页自行读取 NFC。[MDN NDEFReader](https://developer.mozilla.org/en-US/docs/Web/API/NDEFReader)

## 2. 目标、范围与边界

### 2.1 产品目标

制作一个克制、纸张感的单依纯主题数字小刊：用户轻触实体 NFC 卡片/贴纸后，在移动浏览器打开公开 HTTPS 单页；可浏览经授权的照片贴图、阅读短句，并主动播放《照片》的授权音频片段或完整曲目。首次访问需联网。

### 2.2 本期范围（MVP）

- 一张主题首页：封面、艺人主题文字、播放控制与进入按钮。
- 1 个照片贴图墙：6–12 张经授权图片，可点按放大、关闭、切换。
- 1 个音频模块：播放/暂停、进度、静音、当前状态；默认静音且由用户点击后播放。
- 3 组轻量 GSAP 动效：入场、贴图散开/聚焦、播放时的微弱呼吸效果。
- 一个适配 iOS/Android 移动浏览器的 HTTPS 单页网站。
- 一枚可重复写入的 NFC 标签，写入该网站的固定 HTTPS URL。
- 推送到 GitHub 后自动构建、部署和更新；无自建服务器、数据库或常驻进程。
- 可选 PWA 缓存：用户成功打开过网页后，允许浏览器尝试离线复访；不作为首次打开或所有机型的承诺。

### 2.3 不在本期范围

- 通过 NFC 标签保存歌曲、照片或完整 HTML 包。
- 未经许可抓取、嵌入、分发艺人照片、音频、封面或歌词。
- 登录、评论、分享、数据采集、后台内容更新。
- 基于浏览器 Web NFC 的跨平台读写，以及任意形式的用户账户/后端服务。

## 3. 权利、内容与隐私门槛

上线/公开分发前必须获得下列书面授权，未满足则只交付“可替换占位素材版”：

| 素材 | 必需权利/确认 | MVP 处理 |
| --- | --- | --- |
| 单依纯照片贴图 | 肖像及图片著作权、编辑/公开网络展示与分发许可 | 使用授权原图，保留来源与授权编号 |
| 《照片》音频 | 录音制品、词曲相关权利及公开网络播放/分发许可 | 仅放入获授权的音频文件或授权试听片段 |
| 歌词、封面、字体 | 对应版权或商用许可 | 不默认使用；改用原创短句和开源/获授权字体 |

不能以“个人、离线或非商业”自动推定可以复制、写入或分发受版权保护的音频和图片。项目资料库应保存每项素材的来源、许可范围、期限、地域、可否离线复制，以及撤下联系人。页面不上传设备 ID、位置或扫描记录。

## 4. 体验与视觉设计

### 4.1 页面流程

```text
轻触 NFC → 系统浏览器打开固定 HTTPS URL
          ├─ 网络可用 → 加载封面 → 用户点击播放 → 浏览贴图墙
          └─ 网络不可用 → 浏览器离线页 / 已缓存内容（非首次访问保证）
```

音频不得假定自动播放：移动浏览器和 WebView 常要求用户手势后才能发声，因此首屏应将“播放”设计成明确的主动作；无障碍模式下同时提供文本状态。

### 4.2 zine 视觉规范

采用 `gc-minimal-zine-poster` 的视觉语言。当前原型使用原创生成的风格化人物海报，不以网络照片为编辑底片；正式发布前仍须完成肖像及使用范围审核：

- 竖版 3:5、70%–90% 留白、暖灰旧纸底与扫描颗粒。
- 每屏只有一组小型贴图簇；照片由已授权原图裁切并保留真实来源。
- 主题色使用一处饱和钴蓝（例如撕纸形状或播放按钮），其余为纸色、灰黑与低对比照片。
- 字体使用短句、日期式微文案与打字机/衬线字；当前使用原创短句，不使用歌词原文，除非歌词授权已覆盖。
- 避免广告化大标题、霓虹、3D、满屏拼贴和密集装饰。

建议首屏文案（原创）：`照片之外，声音仍在。`  
建议视觉配方：`lower-left-float / torn-paper clipping / archive microtext / cobalt cutout / risograph grain / memory`。

### 4.3 GSAP 动效规范

- 原型使用 HTTPS CDN 载入 GSAP；若未来启用 PWA 离线缓存，再改为随站点发布本地副本。
- 进入：标题、贴图与播放按钮按 80–120ms stagger 淡入和上移。
- 交互：点击照片时用 `gsap.to` 动画化 `x`、`y`、`scale` 与 `autoAlpha`；不要频繁动画化布局属性。
- 播放：仅让播放盘或色块以低幅度、低频率旋转/呼吸；暂停和减少动态偏好时停止。
- 以 `gsap.matchMedia()` 响应 `prefers-reduced-motion: reduce`，将装饰动画设为 0 秒或关闭，音频功能不受影响。

## 5. 技术设计

### 5.1 纯前端部署架构（本项目采用）

```text
NFC 标签（NDEF URI：HTTPS 固定链接）
                ↓
iOS Safari / Android 默认浏览器
                ↓
GitHub Pages（静态 HTML、CSS、JS、图片、授权音频）
                ↑
GitHub Actions：push 后构建并发布
```

GitHub Pages 能从公开仓库提供站点，GitHub Actions 可执行 Vite、Astro 或纯 HTML 项目的构建并发布其静态产物；它不是常驻后端，不能运行数据库、登录接口、动态鉴权或私密音频流。[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

推荐 URL 格式：`https://<GitHub用户名>.github.io/<仓库名>/`。写入标签后不要轻易改仓库名或路径；如需更稳定、品牌化的短链接，可另购域名并绑定 GitHub Pages。GitHub Pages 支持自定义域名和 HTTPS。[GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

### 5.2 备用：安装 App 时的离线架构

| 层级 | 技术选择 | 离线职责 |
| --- | --- | --- |
| NFC | NTAG 215/216 或同类 NDEF 标签 | 保存短 URI / 自定义内容 ID / 版本；标签锁定前先验证 |
| iOS 容器 | Swift + Core NFC + `WKWebView` | 从 App 内发起扫描、校验 NDEF、加载 App 包内网页 |
| Android 容器 | Kotlin + Android NFC + `WebView` | NFC Intent / App 内扫描、校验 NDEF、加载 App assets 内网页 |
| 页面 | 静态 HTML、CSS、原生 JavaScript、GSAP | 呈现与动效，无远程请求 |
| 媒体 | 应用包内 `web/assets/` | 图像、音频、字体均本地读取 |
| 内容清单 | `manifest.json` | 文件 hash、版本、素材授权编号、展示顺序 |

建议 NFC NDEF 使用短 URI 或应用专用记录，例如逻辑内容：

```json
{
  "schema": 1,
  "contentId": "syc-photo-zine",
  "contentVersion": "1.0.0",
  "entry": "zine"
}
```

不把歌曲标题、照片 URL、许可证或大段 JSON 放入标签；标签丢失、复制或被读取均不应泄露私密信息。容器应只接受白名单 `contentId` 和签名/校验通过的本地 manifest。

### 5.3 备用：双端 App NFC 交互策略

为保证跨平台离线体验，统一的产品主路径是：**打开 App → 点击“轻触卡片” → 贴近 NFC 标签 → 进入页面**。这避免依赖系统浏览器或不同机型的后台识别行为。

| 平台 | MVP 路径 | 可选优化 | 注意点 |
| --- | --- | --- | --- |
| iOS | Core NFC 前台扫描会话 → 读取 NDEF → 本地 WebView 路由 | 评估 NDEF URL 的系统后台识别 | 是否可直接从锁屏/后台进入指定 App，须以目标机型和签名配置 PoC 为准；不将其作为验收前提 |
| Android | NFC Intent 或 App 内扫描 → 读取 NDEF → 本地 WebView 路由 | 将目标 App 声明为匹配记录的处理者 | 可用 Intent 提升直达体验，但仍需处理未安装 App、标签冲突和系统选择器 |

这套设计依赖平台官方的 NDEF 能力：iOS 的 Core NFC 支持 NDEF 标签读写；Android 的 NFC 分发会解析 NDEF 记录并将匹配的 URI / MIME 记录交给应用处理。[Apple Core NFC](https://developer.apple.com/documentation/CoreNFC) [Android NFC 基础文档](https://developer.android.com/develop/connectivity/nfc/nfc)

### 5.4 建议目录（GitHub Pages）

```text
web/
  index.html
  styles/main.css
  scripts/app.js
  vendor/gsap.min.js
  assets/images/               # 仅授权照片与贴图导出物
  assets/audio/                # 仅授权音频，建议 AAC/MP3
  assets/fonts/
  manifest.json
.github/workflows/
  deploy-pages.yml             # push 后构建并部署至 GitHub Pages
docs/
  单依纯主题离线NFC网页-需求与实施方案.md
```

### 5.5 资源预算

- NFC 记录目标小于 300 B；保持足够冗余，不依赖标签容量承载媒体。
- 首屏图片采用 WebP/AVIF（兼容性验证后），单张建议 200–500 KB；原始文件不进包。
- 音频优先使用已授权的 30–60 秒试听片段；若确有完整曲目离线授权，建议 AAC 96–128 kbps，并在真机评估包体、启动和解码体验。
- 首屏关键资源总量建议控制在 3 MB 左右；媒体延迟载入且显示本地加载状态。

## 6. 实施计划与交付物

| 阶段 | 工作 | 产物 | 完成门槛 |
| --- | --- | --- | --- |
| 0. 权利确认 | 收集授权、素材清单、发行范围 | `asset-register.csv`、授权确认 | 每项公开网络分发素材均可追溯 |
| 1. 原型 | 纸张视觉、占位图、无版权测试音频、GSAP 动效 | 本地静态页面 | 本地手机预览正常，减少动态可用 |
| 2. 前端与部署 | 静态页面、GSAP、GitHub Actions、GitHub Pages | 已完成本地可预览原型 | 手机浏览器可打开；推送 GitHub 后验证 Actions 构建成功 |
| 3. 集成 | 替换获授权素材、生成 manifest 与 hash | 发布版本、写卡说明 | 媒体经 HTTPS 正常加载、授权登记完整 |
| 4. 写卡与验收 | 批量写入、抽检、锁卡（若决定锁定） | 标签清单、验收记录 | iOS/Android 手机扫码打开站点通过 |

## 7. 测试与验收标准

### 7.1 功能验收

- iOS 与 Android 各至少两台 NFC 设备完成 20 次连续扫描；可联网状态下正确打开 HTTPS 页面。
- 首次访问应明确要求网络；若启用 PWA，另行测试“已访问后”的离线复访，不将其作为硬性承诺。
- 点击播放/暂停、拖动进度、关闭放大图均正常；首次进入不擅自播放声音。
- 标签内容 ID 非白名单、manifest 缺文件、校验失败时展示本地错误提示，不加载任意 URL。
- 开启“减少动态效果”后，没有持续装饰动画，页面仍可操作。

### 7.2 内容与交付验收

- 每个上线素材都能在资产登记中找到授权/来源、版本和 hash。
- 页面不含数据库、登录、分析 SDK 或未声明的第三方请求；可使用受控的 GitHub Pages HTTPS 静态资源 URL。
- 写卡前后读取 NDEF 并与预期 bytes / contentId 核对；批次抽检不少于 10%（最少 10 枚）。
- 交付：App 安装包、网页源代码、manifest、资产登记、NFC 写入脚本/说明、测试记录与回滚方案。

## 8. 风险、待决策与下一步

| 风险 / 决策 | 影响 | 建议 |
| --- | --- | --- |
| 未取得《照片》离线授权 | 不得使用完整音源 | 先以原创测试音频完成技术原型；取得许可后替换 |
| 未取得艺人图片使用许可 | 不得交付照片贴图 | 先用抽象撕纸与用户提供的授权照片占位 |
| 用户不愿安装 App | “真正离线”无法保证 | 已改选 GitHub Pages；明确首次联网和缓存差异 |
| GitHub Pages 上线素材公开可下载 | 音频和图片无法保密，可能违反授权范围 | 仅上传明确允许公开网络发布的素材；否则不要将其部署到 Pages |
| GitHub Pages 并非 SLA 型后端 | 不能承诺永不变更、无限流量或动态能力 | 用公开仓库备份、固定 URL、版本化发布；高流量再迁移专业静态托管 |
| 标签被复制 | 内容入口可被仿制 | 标签只存公开 ID；高价值场景再评估签名/服务端验签 |
| iOS/Android 唤起差异 | 扫描路径不同 | 双端真机 PoC 先行，避免只在网页中实现 Web NFC |

下一步请确认三件事：

1. 是否以 `GitHub用户名.github.io/仓库名` 先发布，还是同时购买并绑定一个短域名？
2. 《照片》使用范围是获授权的完整曲目、试听片段，还是先用无版权占位音频？
3. 照片贴图由谁提供，以及是否附带可在**公开网页**展示/分发的书面授权？
