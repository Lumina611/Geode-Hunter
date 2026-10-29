// V0.2 data: gameplay values, shells, clues, interiors and paired assets.
const GH_CONFIG={version:2,initialCoins:100,cost:20,baseReward:8,correctReward:12,newReward:10,batchSize:25,hits:4,
storage:'geode-hunter.session.v2',catalogStorage:'geode-hunter.catalog.v2',
types:[
{id:'white-druse',name:'白水晶细闪',en:'White druzy quartz',category:'white',color:'#ddd9d0',hue:.10,saturation:.025,lightness:.72,rarity:1,weight:30},
{id:'clear-prism',name:'透明长柱石英',en:'Clear prismatic quartz',category:'white',color:'#e1dfe5',hue:.10,saturation:.025,lightness:.76,rarity:2,weight:23},
{id:'smoky-quartz',name:'烟晶',en:'Smoky quartz',category:'smoky',color:'#89766d',hue:.075,saturation:.17,lightness:.34,rarity:2,weight:20},
{id:'pale-amethyst',name:'浅紫水晶',en:'Pale amethyst',category:'purple',color:'#bba3d4',hue:.745,saturation:.24,lightness:.57,rarity:2,weight:18},
{id:'deep-amethyst',name:'深紫水晶',en:'Deep amethyst',category:'purple',color:'#765195',hue:.75,saturation:.39,lightness:.32,rarity:3,weight:9}
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
// A paired asset overrides defaults by shellId:typeId. Exterior/interior must match.
pairings:{}
};
export default GH_CONFIG;
