// V0.3: 14 appearance categories; rarity/provenance labels are game design.
const GH_CONFIG={version:3,initialCoins:100,cost:20,baseReward:8,correctReward:12,newReward:10,batchSize:25,hits:4,hiddenBatchChance:.05,
storage:'geode-hunter.session.v3',catalogStorage:'geode-hunter.catalog.v3',legacyStorage:'geode-hunter.session.v2',legacyCatalogStorage:'geode-hunter.catalog.v2',
regions:[{id:'morocco',name:'摩洛哥主题批次',en:'Morocco-inspired batch'},{id:'mexico',name:'墨西哥主题批次',en:'Mexico-inspired batch'}],
types:[
 {
  "id": "white-druse",
  "number": "01",
  "name": "白水晶细闪",
  "en": "White druzy quartz",
  "category": "white",
  "color": "#ddd9d0",
  "rarity": 1,
  "weight": 22,
  "form": "druse",
  "count": 850,
  "width": 0.035,
  "length": 0.1,
  "mineral": {
   "zh": "石英",
   "en": "Quartz"
  },
  "habit": {
   "zh": "细密短晶簇",
   "en": "Fine short druse"
  },
  "description": {
   "zh": "细小石英晶体覆盖空腔内壁，表现细密的晶面反光。",
   "en": "Tiny quartz crystals line a cavity with fine facet reflections."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "pale",
   "grain"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/white-druse.webp",
    "model": "assets/models/white-druse.glb",
    "detail": "assets/details/white-druse.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "clear-prism",
  "number": "02",
  "name": "透明长柱石英",
  "en": "Clear prismatic quartz",
  "category": "white",
  "color": "#dedbd2",
  "rarity": 2,
  "weight": 17,
  "form": "prism",
  "count": 230,
  "width": 0.05,
  "length": 0.56,
  "mineral": {
   "zh": "石英",
   "en": "Quartz"
  },
  "habit": {
   "zh": "六方长柱与尖端",
   "en": "Long hexagonal prisms"
  },
  "description": {
   "zh": "以较长六方晶柱为外观参考；当前占位模型不模拟真实折射。",
   "en": "Long hexagonal prisms are the visual reference; real refraction is not simulated."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "pale",
   "grain"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/clear-prism.webp",
    "model": "assets/models/clear-prism.glb",
    "detail": "assets/details/clear-prism.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "smoky-quartz",
  "number": "03",
  "name": "烟晶",
  "en": "Smoky quartz",
  "category": "smoky",
  "color": "#79695e",
  "rarity": 2,
  "weight": 14,
  "form": "stout",
  "count": 260,
  "width": 0.055,
  "length": 0.43,
  "mineral": {
   "zh": "石英",
   "en": "Quartz"
  },
  "habit": {
   "zh": "烟色短柱晶簇",
   "en": "Smoky stout prisms"
  },
  "description": {
   "zh": "烟灰到灰棕色的石英外观分类，不凭外壳颜色判断内部。",
   "en": "A smoky gray to brown quartz appearance; shell color is not a certain clue."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "crack",
   "dark"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/smoky-quartz.webp",
    "model": "assets/models/smoky-quartz.glb",
    "detail": "assets/details/smoky-quartz.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "pale-amethyst",
  "number": "04",
  "name": "浅紫水晶",
  "en": "Pale amethyst",
  "category": "purple",
  "color": "#b8a3c7",
  "rarity": 2,
  "weight": 12,
  "form": "prism",
  "count": 520,
  "width": 0.045,
  "length": 0.2,
  "mineral": {
   "zh": "石英",
   "en": "Quartz"
  },
  "habit": {
   "zh": "浅紫短柱晶簇",
   "en": "Pale short prisms"
  },
  "description": {
   "zh": "浅紫色石英的视觉分类，和深紫分开收藏，并非独立矿物种。",
   "en": "A pale quartz color variety, collected separately from deep amethyst in this game."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "vein",
   "rough"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/pale-amethyst.webp",
    "model": "assets/models/pale-amethyst.glb",
    "detail": "assets/details/pale-amethyst.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "deep-amethyst",
  "number": "05",
  "name": "深紫水晶",
  "en": "Deep amethyst",
  "category": "purple",
  "color": "#735180",
  "rarity": 3,
  "weight": 7,
  "form": "stout",
  "count": 280,
  "width": 0.11,
  "length": 0.26,
  "mineral": {
   "zh": "石英",
   "en": "Quartz"
  },
  "habit": {
   "zh": "深紫粗短晶簇",
   "en": "Deep stout prisms"
  },
  "description": {
   "zh": "以深紫石英晶簇为参考，稀有度是游戏设定。",
   "en": "Deep purple quartz clusters are the reference; rarity is a game setting."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "vein",
   "rough"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/deep-amethyst.webp",
    "model": "assets/models/deep-amethyst.glb",
    "detail": "assets/details/deep-amethyst.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "banded-agate",
  "number": "06",
  "name": "玛瑙条带晶洞",
  "en": "Banded agate geode",
  "category": "other",
  "color": "#93989a",
  "rarity": 2,
  "weight": 9,
  "form": "agate",
  "count": 100,
  "width": 0.025,
  "length": 0.035,
  "mineral": {
   "zh": "玉髓 / 石英",
   "en": "Chalcedony / quartz"
  },
  "habit": {
   "zh": "同心矿带与细晶内缘",
   "en": "Concentric bands and fine inner druse"
  },
  "description": {
   "zh": "玛瑙是具有条带的玉髓外观；当前用有起伏的矿带几何表达。",
   "en": "Agate is a banded chalcedony appearance, represented here by layered geometry."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "vein",
   "rough"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/banded-agate.webp",
    "model": "assets/models/banded-agate.glb",
    "detail": "assets/details/banded-agate.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "honey-calcite",
  "number": "07",
  "name": "蜜黄色方解石晶洞",
  "en": "Honey calcite geode",
  "category": "other",
  "color": "#c29852",
  "rarity": 2,
  "weight": 7,
  "form": "rhomb",
  "count": 145,
  "width": 0.13,
  "length": 0.23,
  "mineral": {
   "zh": "方解石",
   "en": "Calcite"
  },
  "habit": {
   "zh": "菱面体块状晶簇",
   "en": "Rhombohedral clusters"
  },
  "description": {
   "zh": "蜜黄色是外观描述；方解石可有菱面体等多种晶形。",
   "en": "Honey describes its color; calcite can form rhombohedral and other crystal habits."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "vein",
   "rough"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/honey-calcite.webp",
    "model": "assets/models/honey-calcite.glb",
    "detail": "assets/details/honey-calcite.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "white-calcite",
  "number": "08",
  "name": "白色方解石晶洞",
  "en": "White calcite geode",
  "category": "white",
  "color": "#e3ded1",
  "rarity": 2,
  "weight": 7,
  "form": "dogtooth",
  "count": 260,
  "width": 0.09,
  "length": 0.36,
  "mineral": {
   "zh": "方解石",
   "en": "Calcite"
  },
  "habit": {
   "zh": "犬牙状尖晶簇",
   "en": "Dogtooth-like scalenohedra"
  },
  "description": {
   "zh": "以白色犬牙状方解石形态为参考，与六方石英晶柱作区别。",
   "en": "White dogtooth-like calcite is the reference, distinct from hexagonal quartz prisms."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "pale",
   "grain"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/white-calcite.webp",
    "model": "assets/models/white-calcite.glb",
    "detail": "assets/details/white-calcite.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "botryoidal-chalcedony",
  "number": "09",
  "name": "葡萄状玉髓空腔",
  "en": "Botryoidal chalcedony cavity",
  "category": "other",
  "color": "#9c96a4",
  "rarity": 3,
  "weight": 4,
  "form": "botryoidal",
  "count": 260,
  "width": 0.15,
  "length": 0.15,
  "mineral": {
   "zh": "玉髓",
   "en": "Chalcedony"
  },
  "habit": {
   "zh": "葡萄状圆润集合体",
   "en": "Rounded botryoidal aggregates"
  },
  "description": {
   "zh": "用连生圆润球状表面表现葡萄状集合体，不冒充尖柱水晶。",
   "en": "Rounded joined surfaces represent botryoidal aggregates rather than pointed quartz."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "vein",
   "rough"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/botryoidal-chalcedony.webp",
    "model": "assets/models/botryoidal-chalcedony.glb",
    "detail": "assets/details/botryoidal-chalcedony.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "black-association",
  "number": "10",
  "name": "黑色矿物共生晶洞",
  "en": "Dark mineral association geode",
  "category": "smoky",
  "color": "#514b48",
  "rarity": 3,
  "weight": 3,
  "form": "needles",
  "count": 340,
  "width": 0.035,
  "length": 0.52,
  "mineral": {
   "zh": "石英 + 未定深色共生相",
   "en": "Quartz + unspecified dark mineral phase"
  },
  "habit": {
   "zh": "薄片 / 针状与浅色晶体共生",
   "en": "Dark blades and pale crystals"
  },
  "description": {
   "zh": "这是视觉共生类别，黑色相尚未指定矿物；不能据程序颜色作鉴定。",
   "en": "A visual association category; the dark phase is unspecified and is not identified by color."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "crack",
   "dark"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/black-association.webp",
    "model": "assets/models/black-association.glb",
    "detail": "assets/details/black-association.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "celestite",
  "number": "11",
  "name": "天青石晶洞",
  "en": "Celestite geode",
  "category": "other",
  "color": "#9fb6c1",
  "rarity": 3,
  "weight": 0,
  "form": "tabular",
  "count": 170,
  "width": 0.14,
  "length": 0.26,
  "mineral": {
   "zh": "天青石",
   "en": "Celestite"
  },
  "habit": {
   "zh": "淡蓝板状晶簇",
   "en": "Pale blue tabular crystals"
  },
  "description": {
   "zh": "天青石可呈淡蓝板状晶体；本版仅为未来产区图鉴，初始批次不生成。",
   "en": "Celestite can form pale blue tabular crystals. Reserved for a future region, outside starter batches."
  },
  "fantasy": false,
  "future": true,
  "clueTypes": [
   "vein",
   "rough"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/celestite.webp",
    "model": "assets/models/celestite.glb",
    "detail": "assets/details/celestite.webp"
   }
  },
  "regions": []
 },
 {
  "id": "quartz-calcite",
  "number": "12",
  "name": "石英与方解石共生晶洞",
  "en": "Quartz and calcite geode",
  "category": "white",
  "color": "#cfc5b1",
  "rarity": 3,
  "weight": 5,
  "form": "mixed",
  "count": 300,
  "width": 0.07,
  "length": 0.34,
  "mineral": {
   "zh": "石英 + 方解石",
   "en": "Quartz + calcite"
  },
  "habit": {
   "zh": "长柱与菱面体共生",
   "en": "Prisms with rhombohedra"
  },
  "description": {
   "zh": "以两种晶形同时生长为视觉参考，不把共生外观当独立矿物种。",
   "en": "Two crystal habits share a cavity; this visual association is not a separate mineral species."
  },
  "fantasy": false,
  "future": false,
  "clueTypes": [
   "pale",
   "grain"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/quartz-calcite.webp",
    "model": "assets/models/quartz-calcite.glb",
    "detail": "assets/details/quartz-calcite.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "starfield",
  "number": "13",
  "name": "星空晶洞",
  "en": "Starfield geode",
  "category": "other",
  "color": "#3d4b6d",
  "rarity": 4,
  "weight": 0,
  "form": "stars",
  "count": 560,
  "width": 0.025,
  "length": 0.1,
  "mineral": {
   "zh": "虚构复合晶体",
   "en": "Fictional composite crystals"
  },
  "habit": {
   "zh": "深色空腔与细小星点晶面",
   "en": "Dark cavity with fine star-like facets"
  },
  "description": {
   "zh": "幻想隐藏款，灵感来自星空，没有对应的真实矿物种。",
   "en": "A fictional hidden variety inspired by a night sky, not a real mineral species."
  },
  "fantasy": true,
  "future": false,
  "clueTypes": [
   "vein",
   "rough"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/starfield.webp",
    "model": "assets/models/starfield.glb",
    "detail": "assets/details/starfield.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 },
 {
  "id": "aurora",
  "number": "14",
  "name": "极光晶洞",
  "en": "Aurora geode",
  "category": "other",
  "color": "#8aa99e",
  "rarity": 4,
  "weight": 0,
  "form": "aurora",
  "count": 190,
  "width": 0.1,
  "length": 0.52,
  "mineral": {
   "zh": "虚构复合晶体",
   "en": "Fictional composite crystals"
  },
  "habit": {
   "zh": "多色薄片与长晶簇",
   "en": "Muted multicolor blades"
  },
  "description": {
   "zh": "幻想隐藏款，用低饱和多色晶片表现极光意象，不作矿物知识。",
   "en": "A fictional hidden variety with muted multicolor blades, not mineral identification information."
  },
  "fantasy": true,
  "future": false,
  "clueTypes": [
   "vein",
   "rough"
  ],
  "art": {
   "imageUrl": null,
   "modelUrl": null,
   "detailImage": null,
   "paths": {
    "image": "assets/catalog/aurora.webp",
    "model": "assets/models/aurora.glb",
    "detail": "assets/details/aurora.webp"
   }
  },
  "regions": [
   "morocco",
   "mexico"
  ]
 }
],
categories:[{id:'white',name:'白色 / 透明',en:'White / clear'},{id:'smoky',name:'灰色 / 烟色',en:'Gray / smoky'},{id:'purple',name:'紫色',en:'Purple'},{id:'other',name:'其他 / 特殊',en:'Other / special'}],
shells:[
{id:'chalk',name:'灰白多孔',en:'Pale porous shell',color:'#9d978a',relief:.19,clues:['pores','pale','grain']},
{id:'cracked',name:'裂纹粗壳',en:'Cracked rough shell',color:'#8e806b',relief:.24,clues:['crack','rough','pale']},
{id:'spotted',name:'深色矿斑',en:'Dark mineral patches',color:'#7f786c',relief:.14,clues:['dark','rough','grain']},
{id:'veined',name:'浅色矿脉',en:'Pale mineral veins',color:'#a4977c',relief:.16,clues:['vein','pale','grain']},
{id:'weathered',name:'圆润风化',en:'Rounded weathered shell',color:'#948a78',relief:.09,clues:['worn','grain','dark']}
],
clues:{pores:{zh:'表面散布细小孔隙，边缘不规则。',en:'Small pores dot the uneven surface.'},pale:{zh:'局部可见灰白色矿物痕迹。',en:'Pale mineral traces appear in small areas.'},grain:{zh:'表皮颗粒粗细不一，没有明确的颜色答案。',en:'The surface grain varies; its color gives no certain answer.'},crack:{zh:'表层有几道细裂纹，但尚看不到内部。',en:'Fine surface cracks do not yet reveal the interior.'},rough:{zh:'外壳粗糙，有不规则凸起。',en:'The rough shell has irregular raised areas.'},dark:{zh:'底部有少量深色矿斑，未必对应内部颜色。',en:'A few dark patches underneath may not match the interior.'},vein:{zh:'边缘似乎延伸着一条浅色矿脉。',en:'A pale mineral vein seems to run along an edge.'},worn:{zh:'轮廓偏圆润，表面带有风化起伏。',en:'A rounded silhouette carries weathered surface relief.'}},
assets:{modelUrl:null,closedNode:'Closed',leftNode:'Open_Left',rightNode:'Open_Right',modelScale:1,shellColorMap:null,shellNormalMap:null,shellRoughnessMap:null,detailImage:null},
pairings:{}
};
// Four original GLB studies reconstructed from the supplied 2D AI references.
// One closed shell and its matching halves; the source image is a separate 2D detail.
for (const [id, file] of Object.entries({
 'white-druse':'01-white-druse', 'deep-amethyst':'05-deep-amethyst',
 'banded-agate':'06-banded-agate', 'botryoidal-chalcedony':'09-botryoidal-chalcedony'
})) {
 const art=GH_CONFIG.types.find(type=>type.id===id).art;
 Object.assign(art,{modelUrl:`assets/models/${id}-study-v1.glb`,
  detailImage:`assets/reference/${file}-candidate-v01.png`,
  modelStatus:'reference-study',openRotationY:[-2.62,2.62]});
}
GH_CONFIG.types.find(type=>type.id==='white-druse').art.modelUrl='assets/models/white-druse-study-v2.glb';
export default GH_CONFIG;
