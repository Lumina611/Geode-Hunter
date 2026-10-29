/** Dense mineral linings with family-specific geometry. Original procedural studies, not scans. */
import {T,GLB,base,TAU,clamp,noise,random,geo,originalGeometry,shellMaps,drusyMaps,bowl,cavity,rimGeometry,crystal,merge,indexed,outerRadius} from './mineral-mesh-lib.mjs';
import {writeFileSync} from 'node:fs';
import {rhomb,dogtooth,tabular} from './mineral-habit-shapes.mjs';
const variants=[
 {id:'clear-prism',form:'quartz',color:'#d5d4cd',w:.057,h:.52,n:650},
 {id:'smoky-quartz',form:'quartz',color:'#8a7c6c',w:.073,h:.24,n:750},
 {id:'pale-amethyst',form:'quartz',color:'#b6a0c1',w:.054,h:.17,n:1030},
 {id:'deep-amethyst',form:'quartz',color:'#684375',w:.079,h:.22,n:830},
 {id:'banded-agate',form:'agate',color:'#c1c7c4',w:.026,h:.065,n:600},
 {id:'honey-calcite',form:'calcite',color:'#c4a363',w:.088,h:.18,n:620},
 {id:'white-calcite',form:'calcite',color:'#d1cdc0',w:.090,h:.16,n:650},
 {id:'black-association',form:'mixed-black',color:'#c1bcb0',w:.042,h:.11,n:1160},
 {id:'celestite',form:'tabular',color:'#789aaa',w:.115,h:.28,n:360},
 {id:'quartz-calcite',form:'mixed-calcite',color:'#d6d0c1',w:.042,h:.13,n:1080}
];
function surface(x,y,edge=1){return bowl(x/edge,y/edge)+.014*(noise(x*8+2,y*8+8)-.5);}
function mineralBed(v,side){
 const g=cavity(side);if(v.form==='agate'){const p=g.attributes.position;for(let i=0;i<p.count;i++){p.setX(i,p.getX(i)*.61);p.setY(i,p.getY(i)*.61);}g.computeVertexNormals();}
 // A continuous faceted lining covers all gaps between larger crystals. Flat normals create moving facet reflections.
 const raw=g.toNonIndexed(),p=raw.attributes.position,colors=[];for(let i=0;i<p.count;i++){const c=new T.Color(v.color).lerp(new T.Color('#dcd9d0'),.28+.15*noise(p.getX(i)*4+2,p.getY(i)*4+3)).multiplyScalar(.68+.28*Math.min(1,Math.hypot(p.getX(i)/1.22,p.getY(i)/1.32)));colors.push(c.r,c.g,c.b);}raw.setAttribute('color',new T.Float32BufferAttribute(colors,3));raw.computeVertexNormals();return indexed(raw);
}
function band(v){if(v.form!=='agate')return rimGeometry();const p=[],uv=[],c=[],ix=[],N=220,M=120,palette=['#ced0ca','#9aa8ad','#e0ddd2','#718590','#bcc4c1','#aeb5b3'];
 for(let j=0;j<=M;j++)for(let i=0;i<=N;i++){const a=i/N*TAU,f=j/M,dir=new T.Vector3(Math.cos(a),Math.sin(a),0),inner=.76*(1+.055*Math.sin(a*3)+.025*Math.cos(a*5)),outer=outerRadius(dir),r=inner+(outer-inner)*f;p.push(dir.x*r,dir.y*r*1.06,-.007*Math.sin(f*Math.PI));uv.push(i/N,f);const phase=f*12+f*f*4+.13*Math.sin(a*3)+.07*Math.sin(a*7),k=Math.floor(phase),t=phase-k,col=new T.Color(palette[k%palette.length]);if(t>.76)col.lerp(new T.Color(palette[(k+1)%palette.length]),(t-.76)/.24);c.push(col.r,col.g,col.b);}
 for(let j=0;j<M;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+N+1;ix.push(a,b,a+1,b,b+1,a+1);}const g=geo(p,uv,ix);g.setAttribute('color',new T.Float32BufferAttribute(c,3));return g;}
function growth(v,side){const rnd=random(83002+variants.indexOf(v)*177+side*911),groups=Array.from({length:5},()=>[]),q=crystal(),rh=rhomb(),dog=dogtooth(),tab=tabular(),dummy=new T.Object3D(),edge=v.form==='agate'?.61:1,counts={quartz:0,rhomb:0,dogtooth:0,tabular:0,dark:0};
 for(let i=0;i<v.n;i++){
  // Uniform area samples, random azimuth and independent growth tilt: no Fibonacci fan or repetitive rings.
  const r=Math.sqrt(rnd())*.97,a=rnd()*TAU,x=Math.cos(a)*1.22*r*edge,y=Math.sin(a)*1.32*r*edge,z=surface(x,y,edge),slope=-.83*1.28*Math.pow(Math.max(.025,1-r*r),-.36),inward=new T.Vector3(slope*x/(1.22*1.22*edge*edge),slope*y/(1.32*1.32*edge*edge),-1).normalize();
  const colony=noise(x*3+8,y*3+3),large=colony>.56,scale=.44+Math.pow(rnd(),1.4)*(large?1.8:1.05);let shape=q,w=v.w*scale,h=v.h*(.38+rnd())*(large?1.25:.65),depth=w*(.74+rnd()*.4),group=i%5;
  if(v.form==='calcite'){const long=rnd()<.22;shape=long?dog:rh;w=v.w*scale*(long?.70:1.65);h=v.h*(.5+rnd())*(long?1.5:.82);depth=w*(long?1:.85);counts[long?'dogtooth':'rhomb']++;}
  else if(v.form==='tabular'){shape=tab;depth=w*(.8+rnd()*.6);h=v.h*(.45+rnd());counts.tabular++;}
  else if(v.form==='mixed-calcite'&&i%7===0){shape=rh;w=.12*(.7+rnd());h=.18*(.6+rnd());depth=w*.9;group=4;counts.rhomb++;}
  else if(v.form==='mixed-black'&&i%5===0){w=.026*(.5+rnd());h=.30*(.4+rnd());group=4;counts.dark++;}
  else counts.quartz++;
  // Long clear quartz grows in local groups; outer-wall crystals stay short, avoiding a starburst.
  if(v.id==='clear-prism'){
   let strength=0,anchor=[0,0];for(const [cx,cy,spread] of [[-.52,-.58,.43],[.55,.16,.37],[-.38,.58,.32]]){const f=clamp(1-Math.hypot(x-cx,y-cy)/spread);if(f>strength){strength=f;anchor=[cx,cy];}}
   w=(.044+.058*strength)*(.7+rnd()*.6);h=(.12+.62*strength)*(.55+rnd()*.7);depth=w*(.8+rnd()*.3);
   if(strength>.15)inward.lerp(new T.Vector3(-anchor[0]*.3,.7,-.9).normalize(),.75).normalize();
  }else{h*=1-.45*Math.pow(r,3);}
  dummy.position.set(x,y,z+.006);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),inward);dummy.rotateY(rnd()*TAU);dummy.rotateX((rnd()-.5)*.65);dummy.rotateZ((rnd()-.5)*.58);dummy.scale.set(w,h,depth);dummy.updateMatrix();const g=shape.clone(),colors=[];
  for(let j=0;j<g.attributes.position.count;j++){const height=clamp(g.attributes.position.getY(j)),shade=.84+.16*rnd(),col=new T.Color(v.color).lerp(new T.Color('#e3ded2'),.34*(1-height));if(v.form==='mixed-black'&&group===4)col.set('#383533');if(v.form==='mixed-calcite'&&group===4)col.set('#c7b991');col.multiplyScalar(shade);colors.push(col.r,col.g,col.b);}g.setAttribute('color',new T.Float32BufferAttribute(colors,3));groups[group].push(g.applyMatrix4(dummy.matrix));
 }
 return{geometries:groups.map(a=>indexed(merge(a))),counts};
}
const maps=drusyMaps(),report=[];
for(const v of variants){const b=new GLB(),shell=b.material('Weathered_shell',[1,1,1],shellMaps),wall=b.material('Mineral_cavity',[1,1,1],maps,.35),rim=b.material('Cut_mineral_bands',[1,1,1],v.form==='agate'?maps:shellMaps,v.form==='agate'?.29:.8,{doubleSided:true});b.doc.materials[wall].normalTexture.scale=.15;b.doc.materials[rim].normalTexture.scale=v.form==='agate'?.03:.38;
 const mats=Array.from({length:5},(_,i)=>b.material('Natural_facets_'+i,[1,1,1],null,(v.id==='clear-prism'?.08:.14)+i*.018,{extensions:{KHR_materials_ior:{ior:v.form==='tabular'?1.62:1.54},KHR_materials_transmission:{transmissionFactor:v.form==='mixed-black'&&i===4?.03:v.id==='clear-prism'?.72:v.id==='smoky-quartz'?.40:.28},KHR_materials_volume:{thicknessFactor:.12,attenuationDistance:2},KHR_materials_clearcoat:{clearcoatFactor:.12,clearcoatRoughnessFactor:.15}}}));b.doc.extensionsUsed=['KHR_materials_ior','KHR_materials_transmission','KHR_materials_clearcoat','KHR_materials_volume'];
 const closed=b.node({name:'Closed',children:[b.mesh('Closed_front',originalGeometry('Closed_front'),shell),b.mesh('Closed_back',originalGeometry('Closed_back'),shell)]}),halves=[],stats=[];
 for(let side=0;side<2;side++){const grown=growth(v,side),parts=[b.mesh('Outer_shell_'+side,originalGeometry('Outer_shell_'+side),shell),b.mesh('Cavity_'+side,mineralBed(v,side),wall),b.mesh('Mineral_layers_'+side,band(v),rim)];grown.geometries.forEach((g,i)=>parts.push(b.mesh('Crystals_'+side+'_'+i,g,mats[i])));halves.push(b.node({name:side?'Open_Right':'Open_Left',children:parts,...(side?{rotation:[0,1,0,0]}:{})}));stats.push(grown.counts);}
 b.doc.scenes[0].nodes=[closed,...halves];b.doc.extras={status:'Original procedural reconstruction, not a scan',revision:'mineral-habits-v2',family:v.form,textureResolution:512,reference:'docs/MINERAL_DENSITY_REVISION.md',fullWallLining:true,stats};const bytes=b.save(base+`models/${v.id}-study-v2.glb`);report.push({id:v.id,form:v.form,bytes,stats});console.log(v.id,bytes);
}
writeFileSync(base+'models/mineral-habits-v2-manifest.json',JSON.stringify({generator:'tools/build-mineral-habits-v2.mjs',status:'Procedural mineral habit studies, not photoreal scans',variants:report},null,2)+'\n');
