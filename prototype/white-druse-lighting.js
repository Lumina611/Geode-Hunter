// White-druse interior only. Other specimens and closed shells retain the original rig.
import * as T from './vendor/three.module.js';
export function setInteriorLights(scene,white=false,extraFill=false){
 const profile=white?[1.55,2.5,1.1,.95]:[.8,3.1,1.5,0];
 scene.children.filter(o=>o.isLight).forEach((light,i)=>{light.intensity=(profile[i]??light.intensity)+(i===3&&extraFill?2.1:0);});
}
export function whiteInteriorEnvironment(renderer){
 const studio=new T.Scene();studio.background=new T.Color('#181817');
 for(const [x,y,z,w,h,color,power]of [[-3,3,4,.65,2.8,0xf9f5eb,3],[4,1,2,3,5,0xe7ecec,.9],[0,5,-1,5,2,0xffffff,1]]){
  const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide}));panel.material.color.multiplyScalar(power);panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);
 }
 const pmrem=new T.PMREMGenerator(renderer),target=pmrem.fromScene(studio,.02);pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});return target;
}
