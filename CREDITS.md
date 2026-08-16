# Skills、运行库与素材来源

本文件记录当前原型使用的生成工作流和前端动效来源。引用工具或 Skill 仅用于说明创作与实现过程，不代表自动取得人物肖像、照片、录音、词曲、歌词、字体或其他第三方内容的权利。

## 海报生成工作流

- Skill：[`gc-minimal-zine-poster-v0-1`](https://github.com/LiamGvchi/gc-minimal-zine-poster)
- 用途：为 `web/assets/images/nfc-zine-*.png` 提供旧纸、留白、印刷缺陷和克制色彩的提示词编排方法；图像由内置 ImageGen 独立生成。
- Skill 许可：[MIT License](https://github.com/LiamGvchi/gc-minimal-zine-poster/blob/main/LICENSE)
- 提示词记录：[`docs/海报生成提示词.md`](./docs/海报生成提示词.md)

Skill 的 MIT 许可覆盖其工作流与文档，不替代生成图片涉及的肖像、品牌或其他内容权利审核。

## 前端动效工作流

- Skills：[`gsap-core`](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-core) 与 [`gsap-timeline`](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-timeline)
- Skill 仓库：[`greensock/gsap-skills`](https://github.com/greensock/gsap-skills)
- Skill 许可：[MIT License](https://github.com/greensock/gsap-skills/blob/main/LICENSE)
- 用途：照片入场、滚动显隐、灯箱翻页、正反面切换、提示呼吸和逐行打字机动画。

## GSAP 网页运行库

- 上游项目：[`greensock/GSAP`](https://github.com/greensock/GSAP)
- 页面版本：`GSAP 3.13.0`，通过 jsDelivr HTTPS CDN 加载。
- 运行库许可：[GSAP Standard “No Charge” License](https://gsap.com/standard-license/)

GSAP Skill 的 MIT 许可与 GSAP 网页运行库许可是两项不同的授权，本项目分别记录，发布和后续商业使用应继续遵守运行库当时有效的许可条款。

## 当前内容边界

- 五张海报为原型生成素材；正式公开使用前仍需完成人物肖像、品牌及使用范围审核。
- 照片背面的三行文字目前是原创占位短句，不是正式歌曲歌词。
- `web/assets/music/I Will Follow You.mp3` 是用户提供的临时占位音源；正式发布版本应替换为权利范围明确的音频并登记授权信息。
