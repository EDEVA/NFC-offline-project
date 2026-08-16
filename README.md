# 照片之外 · NFC GitHub Pages 原型

面向 iOS / Android 浏览器的静态单页。NFC 标签应写入 GitHub Pages 的 HTTPS 地址，而不是媒体文件。

## 发布

1. 新建 GitHub 仓库并推送本项目到 `main` 分支。
2. 在仓库 **Settings → Pages** 选择 **GitHub Actions** 作为发布来源。
3. Actions 成功后，获取 `https://<用户名>.github.io/<仓库名>/`。
4. 用 NFC 写卡工具将该 HTTPS URL 写为 NDEF URL 记录，先以手机实测后再锁卡。

## 素材替换

- 当前 `web/assets/images/` 的五张图是原创生成的纸刊风格原型；上线前仍需审核肖像与使用范围。
- 播放器目前使用 `web/assets/music/I Will Follow You.mp3` 作为临时占位音源，并支持上一曲、下一曲和从文件名读取曲名。获得正式歌曲、歌词、录音和公开网页分发许可后，再替换为本地授权音频文件与获授权文案。
- 不要把任何密钥、个人信息或未授权媒体提交到公开仓库。

## 技术与生成引用

海报生成工作流、前端动效 Skill、GSAP 运行库及许可边界见 [CREDITS.md](./CREDITS.md)。引用 Skill 或工具不替代照片、肖像、歌曲、歌词及字体的权利确认。
