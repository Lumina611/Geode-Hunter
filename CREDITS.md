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
