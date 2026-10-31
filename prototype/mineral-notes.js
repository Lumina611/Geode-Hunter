// Short sourced learning notes; game appearance records are not mineral identification.
const source=(name,file)=>({name,url:'https://handbookofmineralogy.org/pdfs/'+file+'.pdf'});
const quartz=source('Handbook of Mineralogy · Quartz','quartz');
const calcite=source('Handbook of Mineralogy · Calcite','calcite');
const celestine=source('Handbook of Mineralogy · Celestine','celestine');
const families={
 quartz:{zh:'石英的主要成分是二氧化硅（SiO₂），莫氏硬度为 7。细晶簇、长晶柱和玉髓等外观都可以属于石英家族。',en:'Quartz is silicon dioxide (SiO₂), with Mohs hardness 7. Druse, long prisms and microcrystalline chalcedony are different quartz appearances.',sources:[quartz]},
 calcite:{zh:'方解石的主要成分是碳酸钙（CaCO₃），莫氏硬度为 3。它能形成多种晶形，常见宽平的斜切晶面，不能只凭颜色把它认成石英。',en:'Calcite is calcium carbonate (CaCO₃), with Mohs hardness 3. Its varied crystal habits include broad, oblique faces; color alone does not make it quartz.',sources:[calcite]},
 celestine:{zh:'天青石的主要成分是硫酸锶（SrSO₄），莫氏硬度为 3–3.5。它属于斜方晶系，可以呈板状或柱状，浅蓝色只是它的颜色之一。',en:'Celestine is strontium sulfate (SrSO₄), with Mohs hardness 3–3.5. Its orthorhombic crystals may be tabular or prismatic; pale blue is one possible color.',sources:[celestine]},
 mixed:{zh:'共生标本可以包含多种矿物：这里把石英晶柱与方解石的宽平斜面并置，供你比较形态，而不是把它们当成一种晶体。',en:'An association can contain different minerals. Compare the quartz prisms with the broader oblique calcite faces in this specimen.',sources:[quartz,calcite]}
};
const observations={
 'white-druse':['找一找：细小晶面形成的连续晶床，与局部较大的短晶簇。','Look for a fine crystal bed and a few larger short clusters.'],
 'clear-prism':['转到侧面，比较晶柱的长度、六方外形和尖端。','Rotate sideways to compare prism lengths, hexagonal outlines and terminations.'],
 'smoky-quartz':['比较较粗短的晶柱和较细长的晶柱，而不只看烟灰色。','Compare stout and slender prisms rather than looking only at the smoky color.'],
 'pale-amethyst':['比较浅色晶根和淡紫晶端；本游戏将它与深紫外观分开收藏。','Compare pale roots and purple tips; this game collects pale and deep appearances separately.'],
 'deep-amethyst':['比较晶头的大小和密度，再与浅紫外观对照。','Compare crystal-head size and density with the pale appearance.'],
 'banded-agate':['沿着空腔轮廓看弯曲条带，再找内侧细晶区。','Follow the curved bands around the cavity and find the inner druse.'],
 'honey-calcite':['比较宽平斜面和较尖长的犬牙状近似形态。','Compare broad oblique faces with the longer dogtooth-like forms.'],
 'white-calcite':['留意斜切块体的互生关系，与六方石英柱作比较。','Look at intergrown oblique blocks and compare them with quartz prisms.'],
 'botryoidal-chalcedony':['“葡萄状”描述的是外形：看连生圆丘和表面的细晶皮，不是新的化学成分名称。','Botryoidal describes shape: look for joined rounded lobes and their fine crystal coating, rather than a new chemical formula.'],
 'black-association':['比较浅色晶床与深色柱体。这里的“黑色矿物”是游戏外观标签，没有据此指定实物矿物种。','Compare the pale bed and dark prisms. “Black mineral” is a game appearance label, not a specific mineral identification.'],
 'celestite':['比较板柱的宽面、厚度与截面；此品种目前只作为未来产区资料。','Compare broad faces, thickness and cross-sections; this is currently a future-region entry.'],
 'quartz-calcite':['找出同一空腔中的两类晶形，比较大小及晶面方向。','Find the two crystal habits in one cavity and compare their size and face directions.']
};
export function mineralNotes(type,language='zh'){
 const en=language==='en',title=en?'Mineral field notes':'矿物小知识';
 if(type.fantasy)return{title,body:en?'An invented variety for this game, not a real mineral species.':'这是为游戏创作的幻想外观，不是真实矿物种。',observe:en?'Enjoy the imagined colors and shapes.':'可以欣赏想象中的颜色与形态。',sources:[],observeTitle:en?'Look closer':'看一看',sourceTitle:en?'References':'资料来源'};
 const id=type.id,family=id==='celestite'?'celestine':id==='quartz-calcite'?'mixed':['honey-calcite','white-calcite'].includes(id)?'calcite':'quartz',data=families[family];
 return{title,body:data[en?'en':'zh'],observe:observations[id]?.[en?1:0]||'',sources:data.sources,observeTitle:en?'Look closer':'看一看',sourceTitle:en?'References':'资料来源'};
}
