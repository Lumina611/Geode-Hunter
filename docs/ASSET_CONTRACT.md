> 2026-10-30 当前状态：12 类天然外观已接入独立 GLB；葡萄 V3 满铺内壁，白晶保留 V2，其他十类已按晶习调整。仍非摄影级。以下保留历史阶段原文；当前文件与验证见 [最新修订](MINERAL_DENSITY_REVISION.md)。

> 2026-10-29 最新增补：四类参考图程序 GLB 与配套 PBR 已制作并接入，其他类别仍待替换。下文旧阶段记录保留；当前文件清单、节点约定、运行与验证见 [参考模型说明](REFERENCE_MODELS.md)。

> V0.3 新增：桌面与观察共用 assets.js 配对资源；14 类与逐类预留路径见 V03_ASSETS.md。下文保留原节点、比例约定及阶段历史。

# V0.2 配对素材接口

本轮在单石渲染器上实现完整玩法，正式美术仍待作者提供。config.js 将外壳、内部类型、线索与稀有度分开；开局选定的 shell/type/seed/clues 不会在交互时改变。

`pairings` 以 `外壳ID:内部ID` 为键，覆盖全局 assets 默认值，例如：

```js
pairings: {
  'chalk:white-druse': {
    modelUrl: 'assets/chalk-white.glb',
    closedNode: 'Closed', leftNode: 'Open_Left', rightNode: 'Open_Right',
    modelScale: 1,
    detailImage: 'assets/chalk-white-detail.webp'
  }
}
```

不能给相同外壳随便拼接不同轮廓的内部。GLB 中闭合和双半壳必须属于同一个配对模型。没有配置则用固定种子的程序模型；异步载入过期结果不会覆盖后来选中的原石。对程序壳的 shellColorMap / shellNormalMap / shellRoughnessMap 也可通过相同配对覆盖。正式 GLB 建议自带 PBR。

每个 types 条目可补充 `imageUrl`，作为图鉴正式图片；未提供时显示明确的占位色标。`detailImage` 在单独标明“二维图片”的弹窗打开，不替代 3D 旋转。当前表格缩略图仍由程序外壳生成；正式 GLB 上线时还需准备与之对应的正式缩略图，不能把占位缩略图宣称为正式资产。

当前只验证程序模型。正式 GLB、贴图和图片未交付，成功载入、坏文件回退、内存表现与视觉匹配仍需之后专项验收。

---

以下保留 V0.1 的节点/比例约定，固定单颗 1487 为当时状态；V0.2 已改为每批 25 个固定种子。

# Phase 1 素材替换契约

依据：用户提供的 GDD V1.0、Art Direction & Asset Specification，以及最新“只做一颗白晶技术验证”范围。

## 当前与目标

当前为真实程序 3D 占位；目标是摄影级原石、天然裂纹、细颗粒、白晶与自然晶面。照片级透明度、微距和天然生长方向目前都未达标。参考图 01/03 仅是静态目标，未作为模型贴片。后续正式素材由作者另行准备。

## 同一个模型的全部角度

一颗 STONE_001 用同一个模型旋转呈现前后左右上下，不分别拼贴六张不同石头照片。闭合和开石状态共享同一配对 ID。当前固定种子 1487，不在敲击时抽取或更换壳体。

## GLB / glTF 契约

把文件放在 prototype/assets/，在 config.js 的 assets.modelUrl 填相对路径（如 assets/stone_001.glb）。同一 GLB 中包含三个可单独显隐的节点或组：

- Closed：完整原石。
- Open_Left：左半壳，包含厚度、矿带、内壁与晶体。
- Open_Right：右半壳，与左半配对。

使用 Y 向上、原点位于原石中心，整体高度建议约 3 个单位；三个组共享坐标与比例，闭合时两半按原石轮廓配对。开口在观赏姿态朝正 Z，动画向 ±X 分开；组应使用一致、干净的父级变换。可通过 modelScale 整体调节尺寸，通过配置改节点名。不要带灯光、相机或不相关场景。避免需要 Draco / Meshopt 等额外解码器的压缩扩展，当前未随包提供。

当前加载器能读取文件与指定节点；缺文件/节点会显示回退提示，不阻断占位测试。加载失败分支及用户正式 GLB 仍待专项测试。正式模型的裂纹最好包含分阶段组或贴图；当前程序裂纹按约 3 单位占位石壳设计，正式轮廓变化大时需要调整裂纹接口，不承诺零改动。

## 贴图与图片

shellColorMap、shellNormalMap、shellRoughnessMap：占位外壳可通过这些路径换图。颜色图使用 sRGB；normal/roughness 作为数据贴图。正式 GLB 建议直接嵌入自己的 PBR 材质，配置贴图接口只作用于程序占位壳。

detailImage：可选高清微距图片；以单独明确标注的二维细节视图打开，不能代替模型旋转。

推荐文件名：stone_001_closed、stone_001_open、stone_001_crack_01/02/03、stone_001_detail。当前程序模型不产生这些独立美术文件；以同一标本对象维护状态。正式素材应记录作者、来源、许可、尺寸/比例和测试结果。

## 代码边界

ui.js 只调用 view.strike(hits)、view.reveal()、view.reset()、view.zoom()、view.rotate() 等接口。渲染与素材替换在 app.js，不修改四次输入规则。无须为换模型重写页面和整个交互状态。
