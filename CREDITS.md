# Skills、運行庫與素材來源

本文件記錄正式版使用的生成工作流、前端動效來源與第三方權利邊界。引用工具或 Skill 只用於說明創作與實現過程，不代表自動取得人物肖像、照片、錄音、詞曲、歌詞、字體或其他第三方內容的權利。

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

## 當前內容與權利邊界

- 五張公開海報位於 `web/assets/images/`，由專案方提供並作為本專案個人資產管理；不得因其出現在公開倉庫或 Pages 而下載、轉載或復用。正式公開前仍須確認每張圖涉及的肖像、品牌與生成素材使用範圍。
- 照片背面的文字包含歌曲文字片段時，須另行確認歌詞展示及網路傳播所需權利；標注歌曲或歌手不等於取得許可。
- `web/assets/music/` 現有五首單依純歌曲音源。依專案方提供的權屬資訊標注為「音源版權歸屬單依純工作室」；詞曲、錄音製品、表演及其他權利仍以真實權利鏈與正式授權文件為準。
- 本倉庫與 Pages 均嚴禁商用。專案自有內容適用根目錄 `LICENSE.md` 的保留所有權利條款；GSAP 等第三方元件仍適用各自許可。
- 權利通知、下架請求及交流聯絡：`ziliang.deng99@gmail.com`。
