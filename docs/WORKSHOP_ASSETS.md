# 工作室工作台 · 素材、实现与提示词

2026-10-29，作者提供一张工作台界面参考，要求按其构图调整当前项目。参考只决定风格和布局，没有将整张截图作为可点击的游戏画面。原输入留在工作区备份中；以下是本轮实际制作的组成。

## 真实实现与二维层

| 内容 | 实际实现 |
| --- | --- |
| 25 原石、木桌、垫布、台灯、笔记本、放大镜、锤子、刷子、空托盘 | 同一个 Three.js Scene 内的网格；统一透视、运行时光照和阴影，石头以射线拾取 |
| 石头编号与底部操作栏 | 实际 HTML 按钮，编号投影跟随三维位置，支持键盘焦点；不是图片中的假按钮 |
| 房间、书架、挂画和植物后景 | AI 生成的二维背景图片，不是可自由探索的三维房间 |
| 岩石、旧木桌的颜色细节 | AI 生成颜色贴图，应用到三维网格；非实物扫描，不是从参考图片准确恢复的 PBR 材质 |
| 岩石法线/粗糙度、布面纹理 | 沿用程序贴图与材质参数；颜色纹理和高度细节不完全对应，仍有改进空间 |

桌面的所有石头保持原先的开局种子、位置与内容。外壳显示使用同一套按 shell ID 的灰白、灰黑、灰绿、暖褐色处理，并按原石种子偏移 UV；处理同时用于观察模型与三维缩略图，不在揭晓时另抽石头。给原程序外壳补上 UV，避免颜色贴图只显示单一像素。正式外壳仍需更不规则的轮廓与更准确的材质配对；本轮没有修改存档、品种权重和奖励公式。

选石方式按参考改为 **点击原石/编号 → 金色选择圈与底栏 →「拿起观察」→ 镜头靠近 → 观察**。返回仍是原桌面，选中编号保留。已开空位可选并「回看晶洞」，不能再次付费。「换一批」复用现有重新开始确认框，明确会重置当前批次和矿币，保留永久图鉴。

前景代码：[workshop-scene.js](../prototype/workshop-scene.js)；同场景/拾取：[table.js](../prototype/table.js)；统一外壳处理：[workshop-finish.js](../prototype/workshop-finish.js)；布局：[workshop.css](../prototype/workshop.css)。历史代码在 Git 和工作区 `work/before-workshop` 中保留，没有删除旧阶段。

## 保存的生成素材

使用 **OpenAI 内置 image_gen（imagegen 技能）**，未使用 CLI/API key、图转三维服务或照片下载。素材均已复制进仓库，运行时不依赖 `.codex` 目录或外网。

| 文件 | 实际像素 | 用途 |
| --- | --- | --- |
| [studio-backdrop-v1.png](../prototype/assets/workshop/studio-backdrop-v1.png) | 2172×724 | 二维工作室后景 |
| [weathered-shell-albedo-v1.png](../prototype/assets/workshop/weathered-shell-albedo-v1.png) | 1254×1254 | 岩石颜色细节 |
| [walnut-albedo-v1.png](../prototype/assets/workshop/walnut-albedo-v1.png) | 1254×1254 | 旧木桌颜色细节 |

原生成文件保留在工具的 generated_images 目录；项目引用以上仓库内文件。后景只在主工作台显示；材质载入失败会保留程序材质，不会重抽结果。GLB 内嵌的原程序 PBR 仍保留，本轮颜色贴图是运行时外观增补，不能声称 GLB 已变成扫描级资产。

## 最终使用的完整提示词

### 工作室后景（参考图作为风格输入）

```text
Use case: photorealistic-natural. Create a single production background image, not a UI mockup. The attached image is ONLY a mood/composition reference for a geological collector's workshop. Generate a wide panoramic photoreal photographic BACK WALL / ROOM backdrop for a browser game. Antique dark walnut shelves on the RIGHT holding aged books, small labeled storage boxes with NO readable text, one unlit dark mineral specimen; charcoal plaster central wall with a couple of vintage framed mineral etchings, quiet plant foliage at far LEFT. Calm warm tungsten ambient light from offscreen left, subtle amber accents, heavy natural shadow, restrained deep brown and charcoal. Eye-level view into the back of a collector's workshop; softly shallow depth of field. IMPORTANT: NO foreground table, NO table lamp, NO hammer, NO notebook, NO loose stones arranged in a grid, NO characters, NO text, NO icons, NO buttons, NO game UI. Those foreground objects will be REAL 3D geometry in the game. Back wall and shelves only; lower edge dark, unobtrusive. Make this a continuous room background, not a collage. Panoramic 3:1 composition, high photographic texture quality. Source reference is a screenshot, do not copy its UI or stone grid.
```

### 岩石颜色贴图

```text
Use case: photorealistic-natural. Asset type: a single seamless square PBR BASE COLOR texture for a true 3D rough geode shell, NOT a render of a stone. 1024 square. Fill the entire frame edge to edge with a close macro of weathered natural limestone/basalt matrix: muted charcoal gray, warm gray and gray-brown mineral grains, irregular fine pores, thin pale calcite veins, tiny ochre sediment flecks and geological cracks. Naturally varied granular craggy surface, tactile, realistic geological imperfections. Flat uniform diffuse illumination, no directional shadow or specular highlight, no vignette, no perspective, no object silhouette, no ground, no whole rock. Tileable across all edges. Avoid smooth bread-like bumps, cartoon shading, brush strokes, repeated geometric patterns, neon colors, large white patches, text, logos or UI. Used as albedo on an existing real 3D mesh with separate procedural roughness/normal maps; do not bake in studio lighting.
```

### 旧木桌颜色贴图

```text
Use case: photorealistic-natural. Asset type: seamless square PBR albedo texture of a vintage mineral collector's walnut WORKBENCH surface. The entire image is flat orthographic top-down brown wood, no other objects. 1024 square. Rich but restrained warm dark walnut brown, broad aged planks, long flowing irregular wood grain oriented HORIZONTALLY, worn rubbed areas, tiny dents and scratches, subtle black-brown pores, patches of old oil and matte scuffing. The wood is naturally used and beautifully aged, not glossy orange, not evenly striped, not a laminate repeating pattern. Uniform neutral diffuse lighting with NO cast shadows, NO lamp light baked in, no perspective, no edges of the table, no border, no rocks, no tools, no text. Seamless edges for tiling. Photographic realistic micro-detail. This flat map will be applied to actual 3D tabletop geometry with separate shader roughness and runtime lighting.
```

提示请求尺寸与最终输出尺寸不同，表格记录实际文件尺寸。生成结果仍含近似颜色和孔隙细节，不是测量数据，也没有对材质无缝性、科学矿物准确性作最终认证。

## 实际验收（助手操作，非他人试玩）

测试使用独立端口 8777 的本地游戏进度，不覆盖作者常用 8773 的存档。

- 25 个编号位置全部实际点击，底栏 01～25 一一匹配，余额保持 100；另从 25 换回 13 时点击 canvas 上的石头本体，射线拾取也选中 13。
- 选中 13，拿起观察、返回、再次拿起：可见编号/种子标签、线索文本、25 位置坐标相同，余额仍为 100。
- 选白色大类并支付：100→80；四击揭晓为玛瑙条带，猜错大类，显示 +8、+0、+10，共 +18；领取后 98。返回后 remainingCount=24、13 标为 opened，底栏变为「回看晶洞」。
- 点「换一批」再取消：余额 98、所有位置不变。随后确认换批次：新批次 100、0/25，本局收藏为空，永久玛瑙仍解锁。
- 375×812 视口：页面内容宽度与视口同为 375，无横向溢出，25 个投影目标均在画面内；实际选择 01、05、11、15、21、25 均匹配。中英文切换后仍保留 25 与 98 矿币。没有进行实体触屏或双指手势验收。
- 正常检查未捕获浏览器 warn/error。现有 Node **16 组回归通过**，覆盖固定结果、支付与奖励、防重复、Game Over/Complete、存档和 GLB 结构。此轮没有重新在浏览器连续开完 25 颗或实玩到 Game Over；这些逻辑保留，自动回归通过，旧实玩记录保留。

房间是二维后景，工具为简化网格；近看仍有圆润的岩石轮廓、纹理拉伸、近似阴影和简化金属细节，不能视为与参考图同等的摄影级成品。低端手机和长时间帧率尚未专项测量。仍需一次真实的其他人无讲解试用。

![实际三维工作台，测试批次完整 25 颗](evidence/geode-workshop-01-table.jpg)
![本轮实际玛瑙揭晓](evidence/geode-workshop-02-reveal.jpg)
![已开石头变为空位](evidence/geode-workshop-03-opened.jpg)
![英文窄屏实测](evidence/geode-workshop-04-narrow.jpg)
![新批次仍保留永久收藏](evidence/geode-workshop-05-catalog.jpg)

常用端口 8773 最终刷新仍为原第 3 批、98 矿币、2/25 已开；没有用测试局覆盖它。

![常用端口保留原进度](evidence/geode-workshop-06-user-progress.jpg)
