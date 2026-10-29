import * as THREE from 'three';
import C from './config.js';
let shellTexturePromise,loadedShellTexture;
function shellTexture(){return shellTexturePromise??=new Promise(resolve=>{new THREE.TextureLoader().load(new URL('./assets/workshop/weathered-shell-albedo-v1.png',import.meta.url).href,texture=>{texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=8;loadedShellTexture=texture;resolve(texture);},undefined,()=>{console.warn('Workshop shell texture unavailable; keeping the prior material.');resolve(null);});});}
export const ensureStudyTexture=()=>shellTexture();
// Same exterior finish in the shared workbench, inspector, and actual specimen thumbnail.
// Interior colors are never consulted when choosing the outer finish.
export function finishStudyShell(root,specimen,clone=true){
 const shell=C.shells.find(item=>item.id===specimen.shell)||C.shells[0],tone=new THREE.Color(({chalk:'#d2cebf',cracked:'#a18a71',spotted:'#626667',veined:'#89918f',weathered:'#c4a57a'})[shell.id]||shell.color),copies=new Map(),ownedGeometries=[];
 const finish=material=>{if(!['Weathered_shell','Procedural_shell'].includes(material?.name))return material;if(!copies.has(material)){const owned=clone?material.clone():material;owned.color.copy(tone);owned.roughness=.94;owned.envMapIntensity=.35;owned.vertexColors=false;if(loadedShellTexture){owned.map=loadedShellTexture;owned.needsUpdate=true;}else shellTexture().then(texture=>{if(texture){owned.map=texture;owned.needsUpdate=true;}});copies.set(material,owned);}return copies.get(material);};
 root.traverse(object=>{if(!object.material)return;const outer=(Array.isArray(object.material)?object.material:[object.material]).some(m=>['Weathered_shell','Procedural_shell'].includes(m?.name));if(outer&&object.geometry?.attributes.uv&&!object.geometry.userData.workshopUV){if(clone&&object.material.name==='Weathered_shell'){object.geometry=object.geometry.clone();ownedGeometries.push(object.geometry);}const uv=object.geometry.attributes.uv,seed=specimen.seed>>>0,scale=1.1+(seed%41)/80,shiftU=(seed%97)/97,shiftV=((seed>>>8)%89)/89;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*scale+shiftU,uv.getY(i)*scale+shiftV);uv.needsUpdate=true;object.geometry.userData.workshopUV=true;}object.material=Array.isArray(object.material)?object.material.map(finish):finish(object.material);});
 if(clone){root.userData.studyFinishMaterials=[...copies.values()];root.userData.studyFinishGeometries=ownedGeometries;}
}
export function releaseStudyFinish(root){for(const material of root?.userData.studyFinishMaterials||[])material.dispose();for(const geometry of root?.userData.studyFinishGeometries||[])geometry.dispose();}
