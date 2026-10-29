# V0.3 正式美术待提供清单

当前下列正式文件均未提供。配置中的 paths 是预留地址，不会自动请求；只有给 art.imageUrl / art.modelUrl / art.detailImage 填入已有文件后才启用。当前图片由各自程序 3D 模型渲染，不能称为真实摄影。

| 编号 / 品种 | 占位形态 | 预留图片 | 预留配对模型 |
| --- | --- | --- | --- |
| 01 白水晶细闪 | 细密短晶簇 | `prototype/assets/catalog/white-druse.webp` | `prototype/assets/models/white-druse.glb` |
| 02 透明长柱石英 | 六方长柱与尖端 | `prototype/assets/catalog/clear-prism.webp` | `prototype/assets/models/clear-prism.glb` |
| 03 烟晶 | 烟色短柱晶簇 | `prototype/assets/catalog/smoky-quartz.webp` | `prototype/assets/models/smoky-quartz.glb` |
| 04 浅紫水晶 | 浅紫短柱晶簇 | `prototype/assets/catalog/pale-amethyst.webp` | `prototype/assets/models/pale-amethyst.glb` |
| 05 深紫水晶 | 深紫粗短晶簇 | `prototype/assets/catalog/deep-amethyst.webp` | `prototype/assets/models/deep-amethyst.glb` |
| 06 玛瑙条带晶洞 | 同心矿带与细晶内缘 | `prototype/assets/catalog/banded-agate.webp` | `prototype/assets/models/banded-agate.glb` |
| 07 蜜黄色方解石晶洞 | 菱面体块状晶簇 | `prototype/assets/catalog/honey-calcite.webp` | `prototype/assets/models/honey-calcite.glb` |
| 08 白色方解石晶洞 | 犬牙状尖晶簇 | `prototype/assets/catalog/white-calcite.webp` | `prototype/assets/models/white-calcite.glb` |
| 09 葡萄状玉髓空腔 | 葡萄状圆润集合体 | `prototype/assets/catalog/botryoidal-chalcedony.webp` | `prototype/assets/models/botryoidal-chalcedony.glb` |
| 10 黑色矿物共生晶洞 | 薄片 / 针状与浅色晶体共生 | `prototype/assets/catalog/black-association.webp` | `prototype/assets/models/black-association.glb` |
| 11 天青石晶洞 | 淡蓝板状晶簇 | `prototype/assets/catalog/celestite.webp` | `prototype/assets/models/celestite.glb` |
| 12 石英与方解石共生晶洞 | 长柱与菱面体共生 | `prototype/assets/catalog/quartz-calcite.webp` | `prototype/assets/models/quartz-calcite.glb` |
| 13 星空晶洞 | 深色空腔与细小星点晶面 | `prototype/assets/catalog/starfield.webp` | `prototype/assets/models/starfield.glb` |
| 14 极光晶洞 | 多色薄片与长晶簇 | `prototype/assets/catalog/aurora.webp` | `prototype/assets/models/aurora.glb` |

## 请准备的素材

- 每类独立的高清矿物照片或透明 WebP/PNG；建议统一暗色工作室侧光、构图和尺度。幻想两类另标虚构，不能冒充真实标本。
- 可旋转的 GLB/glTF：同一个文件中配对 Closed、Open_Left、Open_Right；完整外壳、厚度、矿带和晶体形态对应。正式模型不要把水晶一律做成相同宝石尖锥。
- 与模型匹配的颜色、法线、粗糙度等 PBR 贴图，正式模型建议自带材质；模型 Y 向上、原点居中、高约 3 单位，共享干净父级变换。
- 每类微距图可填独立 detailImage，弹窗标明二维图片；不代替模型旋转。
- 灰白多孔、裂纹粗壳、深色矿斑、浅色矿脉、圆润风化等外壳家族的正式纹理/形状及线索对应表。可以先做好一套完整配对，再逐批增加，不必先做 25 个高精度模型。
- 记录作者、授权、出处、真实/幻想、比例、贴图分辨率、产地依据。

## 共用资源解析

assets.js 同时服务工作台与观察页：全局 assets → 品种非空 art → pairings[壳ID:品种ID] → pairings[壳ID:品种ID:造型种子]。工作台只取相同 GLB 的 Closed 节点，观察取同文件双半壳，避免换了图却不配壳。异步过期加载不会覆盖后来选的石头；缺文件时保留程序替代。

正式 GLB、照片、PBR 未做真实资产专项测试；资源接口已实现，不等于正式美术已验收。正式资源接入后还需检查性能、内存、比例、裂纹对齐和外壳/线索一致性。当前图鉴在缺照片时使用程序渲染预览；正式 GLB 的高质量图鉴缩略图建议同时提供匹配照片/渲染图。
