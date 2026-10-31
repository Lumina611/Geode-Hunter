# Credits / 署名与依赖

- Three.js 0.160.1：three.js authors，MIT。随包文件 `prototype/vendor/three.min.js`，许可证 `prototype/vendor/THREE-LICENSE.txt`。本轮未升级依赖，避免引入联网和构建步骤。
- 原始晶洞几何、生成材质、灯光与基础交互：基于作者提供的独立 Geode Hunter Three.js 验证版复用与修改。原版说明及验证记录在工作区 inputs 中原样保留。此前具体作者/AI 使用细节尚待作者补充；不把复用代码全部声称为本轮原创手写。
- 本轮页面结构、猜想反馈、状态重置、交互修正、文档和测试记录：OpenAI Codex 辅助完成，作者审阅状态见 PROCESS。
- 原仓库 Momo 第一版：保留原提交历史与 archive 中原文件，标记为历史探索；不作为晶洞当前成果。
- 本轮截图：来自实际运行原型的浏览器截图，不含参与者姓名、录音或肖像。
- 未引入第三方照片、音效、实物扫描、课程教程代码或真实矿物数据。生成标本不是科学鉴定依据。

公开前请作者确认对提供的前期验证版拥有使用/分享权限，并补充任何尚未披露的借用来源。

## 本轮单石验证新增依赖与素材

- Three.js 官方 r160：本地 three.module.js、GLTFLoader.js、BufferGeometryUtils.js，来源 https://github.com/mrdoob/three.js/tree/r160 ，MIT；许可继续随包保留。为本地目录，将 GLTFLoader 的 utils 相对导入改为 ./BufferGeometryUtils.js，其余保持官方文件。import map 将 three 指向本地模块。旧 three.min.js 作为历史依赖保留但当前不加载。
- 本轮模型、裂纹、材质仍是 Codex 辅助生成的临时程序资产，不是摄影级 GLB 或扫描贴图。
- 美术参考来自聊天 2 的 AI 概念图 01/03，作为输入留在工作区 inputs，没有把概念图当可旋转模型或冒充 Opal 资产。

- 直接敲击、双语词典和 Web Audio 合成撞击音：本轮由 Codex 辅助编写。没有下载或借用第三方音效录音；新增截图均来自实际运行页面。暖色矿物美术说明由作者提供，仍为目标而非已达摄影级的声明。

## V0.2

沿用现有模型/Three.js 依赖和声音模块，未引入新外部资产。25 外壳缩略图来自同一程序渲染器；五种内部仍是程序几何。纯状态模块参考此前项目中未接入的玩法草稿并重新接线、加强存档重放；代码与文档由作者指示、Codex 辅助实现。图鉴色标是临时 CSS 视觉，不是矿物照片。测试操作者为助手，不冒充他人试玩。

## V0.3

工作台、程序木纹、模型形态变体、石屑及图鉴渲染由 Codex 按作者要求编写，沿用 Three.js r160 / MIT、本地 GLTFLoader。未引入第三方摄影或扫描模型。矿物简介新增核对来源，见 [MINERAL_SOURCES](docs/MINERAL_SOURCES.md)；此前“未引入真实矿物数据”属于前阶段记录，本轮新增的是有来源的简短说明，并非下载资料表或图片。星空/极光明确为虚构，稀有度和产区主题为玩法配置。

## 2026-10-29 · 二维参考与三维材质重建

- 作者提供 `geode-art-candidates-v01` 四张候选及素材说明，说明标注为 OpenAI 内置 image_gen 生成，非实物摄影。原文件复制至 `prototype/assets/reference/`，原说明保留为 `source-manifest.json`。没有下载第三方矿物照片，没有把 AI 图片归为实物扫描或科学矿物资料。
- 四种 GLB、15 张 PBR 通道 PNG 和生成器由 Codex 按作者要求编写与生成，使用现有本地 Three.js、Node 内置 zlib/fs；不新增外部依赖。数学噪声制作颜色、法线、粗糙度，不是从候选图恢复真实材质；未调用图转三维服务或 Blender。
- 保留三维背面和内部结构的推测性质、近似空腔顶点暗化、摄影质量与性能限制，见 `docs/REFERENCE_MODELS.md`。截图来自真实浏览器，不是效果概念图或参与者试用证据。

## 2026-10-29 · 工作室场景

- 工作台构图与氛围依据作者在聊天中提供的参考图。未将该整张截图分发为游戏背景或冒充交互；原参考备份留在工作区 work 中。
- `prototype/assets/workshop/` 三张图片由 OpenAI 内置 image_gen 辅助生成，作为二维房间后景、岩石/旧木颜色图，均不是实物摄影或扫描资产。完整最终提示词和实际像素见 `docs/WORKSHOP_ASSETS.md`。未使用 API key 或 CLI 路径。
- 木桌、垫布、台灯、笔记本、放大镜、锤子、刷子和托盘为 Codex 辅助编写的原始 Three.js 几何；材质处理与界面在原 V0.3 基础上修改。后景和可交互三维前景明确区分，保留程序工作样的品质限制。
- 本轮过程截图来自实际运行浏览器；测试使用独立本地端口，不是另一位参与者的试玩记录。所有旧过程、图片和 Git 历史保留。

### 白水晶细闪内部 V2

2026-10-29，按作者提供的 A/B/DETAIL 参考和明确反馈，由 Codex 辅助编写原创程序网格、三张微晶 PBR 图和白晶专用摄影棚反射配置。没有图转三维服务、下载新模型或以参考图投影替代三维。外壳保持仓库已有模型；参考图未复制为新的游戏贴图。代码与参数见 `tools/build-white-druse-v2.mjs`，实际渲染录像和限制见 `docs/WHITE_DRUSE_V2.md`。

### 2026-10-30 · 葡萄状覆晶改版

- 原创程序几何/PBR：Codex辅助编写 `tools/build-grape-drusy-v2.mjs`；连生标量场主体、微小石英几何、三张细晶PBR图。沿用原外壳与本地Three.js，无新运行依赖。
- AI方向图：内置OpenAI image_gen生成 `prototype/assets/reference/09-grape-drusy-direction-v02.png`，仅用于二维方向/参考展示，不是实物照片、扫描或模型渲染。[完整提示词](docs/GRAPE_DIRECTION_PROMPT.txt)。
- 真实标本参考：[FossilEra #105118](https://www.fossilera.com/minerals/1-7-purple-botryoidal-druzy-grape-agate-indonesia)、[Khyber ING01/02/04/05](https://www.khyberminerals.com/collections/50/)、[Mardani 13452](https://www.mardanifineminerals.com/blog/2020/10/11/amethyst-13452/)、[St Andrews GE12275](https://collections.st-andrews.ac.uk/item/botryoidal-crust-of-chalcedony/1021090)。照片版权归来源方，本轮只链接观察，没有下载、贴图、输入图像生成器或再分发。未下载或购买外部三维模型。
- 网页截图与旋转录像来自实际本地三维渲染；不作为真人试玩证据。[实际结果和局限](docs/GRAPE_DRUSY_V2.md)。


### 2026-10-30 · 满铺内壁与矿物晶习研究
- 原创程序代码与 GLB：作者提出密度纠正，Codex 辅助实现 `tools/build-grape-drusy-v3.mjs`、`tools/build-mineral-habits-v2.mjs` 及共用网格工具。既有中性配对外壳保留；没有下载第三方模型、使用图转三维服务、将照片投影为模型或将概念图冒称实际效果。
- AI 图片：内置 imagegen 生成 `09-grape-drusy-direction-v03.png` 与 `mineral-habits-direction-v01.png`，仅为二维方向图。完整最终提示词：`docs/GRAPE_DIRECTION_PROMPT_V03.txt`、`docs/MINERAL_HABITS_DIRECTION_PROMPT.txt`。
- 三张原样研究照片：`prototype/assets/research/botryoidal-real.jpg`（Quartz-46809）、`calcite-quartz-real.jpg`（Calcite-Quartz-118317）、`celestine-real.jpg`（Celestine-Calcite-Rhodochrosite-244357）。均为 **Rob Lavinsky / iRocks.com，CC BY-SA 3.0**，未修改，作为独立研究图片按原许可再分发；不使用仓库默认代码许可替代图片许可。原始文件页、直接来源与许可链接完整列于 [sources.json](prototype/assets/research/sources.json)，并在 [研究展示页](tests/mineral-research.html) 逐图可见署名。
- 形态依据：[Handbook of Mineralogy 石英](https://handbookofmineralogy.org/pdfs/quartz.pdf)、[方解石](https://handbookofmineralogy.org/pdfs/calcite.pdf)、[天青石](https://handbookofmineralogy.org/pdfs/celestine.pdf)。中文描述为概括，不是整篇复制。
- [Zone Minérale 实物细闪葡萄状晶洞](https://www.zoneminerale.com/product-page/stunning-sparkly-blue-lace-agate-geode-botryoidal-druzy-malawi) 为覆盖密度与细晶皮参考；该商业照片仅链接，未下载再分发。
- 实际截图均来自本地 Three.js 浏览器渲染。机器操作和自动检查不冒充第三方用户试用。详情及未达目标见 [修订记录](docs/MINERAL_DENSITY_REVISION.md)。

研究页截图 `docs/evidence/mineral-research.jpg` 同样按 [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) 提供，保留原照片署名；其余原创代码和截图遵循各自声明。
- 2026-11-01 试玩后科普：Codex 辅助整理双语说明与作者转述的反馈；基础资料为 [Quartz](https://handbookofmineralogy.org/pdfs/quartz.pdf)、[Calcite](https://handbookofmineralogy.org/pdfs/calcite.pdf)、[Celestine](https://handbookofmineralogy.org/pdfs/celestine.pdf)，均为 Handbook of Mineralogy。说明为简短概括，程序模型为观察辅助，不用于实物矿物鉴定。朋友反馈不含姓名或录音；未编造助手旁观记录。
