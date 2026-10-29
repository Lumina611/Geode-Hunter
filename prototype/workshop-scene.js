import * as T from 'three';
// Original code-built foreground. The photographic-style room is a separate, labeled 2D backdrop.
export function buildWorkshop(scene,renderer){
 let seed=41829;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const woodCanvas=document.createElement('canvas');woodCanvas.width=2048;woodCanvas.height=1024;const c=woodCanvas.getContext('2d');c.fillStyle='#51301c';c.fillRect(0,0,2048,1024);
 for(let y=0;y<1024;y++){c.strokeStyle=`rgba(${random()>.44?'184,123,68':'22,11,6'},${.05+random()*.20})`;c.lineWidth=.5+random()*1.4;c.beginPath();const phase=random()*7;for(let x=0;x<=2048;x+=12){const py=y+Math.sin(x*.004+phase)*2+Math.sin(x*.023+y*.05)*.55;if(x===0)c.moveTo(x,py);else c.lineTo(x,py);}c.stroke();}
 for(let i=0;i<1800;i++){const x=random()*2048,y=random()*1024;c.fillStyle=`rgba(211,161,95,${random()*.15})`;c.fillRect(x,y,3+random()*35,.5+random());}
 for(let y=130;y<1024;y+=170+random()*60){c.fillStyle='#150c0866';c.fillRect(0,y,2048,3);c.fillStyle='#d29b5e22';c.fillRect(0,y+3,2048,1);}
 const wood=new T.CanvasTexture(woodCanvas);wood.colorSpace=T.SRGBColorSpace;wood.anisotropy=renderer.capabilities.getMaxAnisotropy();wood.wrapS=wood.wrapT=T.RepeatWrapping;
 const walnut=new T.MeshStandardMaterial({map:wood,bumpMap:wood,bumpScale:.035,color:'#b39b80',roughness:.68}),darkWood=walnut.clone();darkWood.color.set('#70543e');
 new T.TextureLoader().load('assets/workshop/walnut-albedo-v1.png',texture=>{texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(1.3,1);texture.anisotropy=wood.anisotropy;for(const material of [walnut,darkWood]){material.map=texture;material.bumpMap=texture;material.bumpScale=.018;material.needsUpdate=true;}},undefined,()=>console.warn('Workshop wood texture unavailable; keeping the procedural wood.'));
 const brass=new T.MeshStandardMaterial({color:'#9c7443',metalness:.78,roughness:.32}),blackMetal=new T.MeshStandardMaterial({color:'#201e1b',metalness:.8,roughness:.38}),steel=new T.MeshStandardMaterial({color:'#747772',metalness:.88,roughness:.32});
 const root=new T.Group();root.name='Workshop_foreground';scene.add(root);
 const add=(geometry,material,x,y,z,group=root)=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);return mesh;};
 const box=(w,h,d,material,x,y,z,group=root)=>add(new T.BoxGeometry(w,h,d),material,x,y,z,group);
 function rounded(w,d,h,r=.12){const shape=new T.Shape(),x=-w/2,y=-d/2;shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+d-r);shape.quadraticCurveTo(x+w,y+d,x+w-r,y+d);shape.lineTo(x+r,y+d);shape.quadraticCurveTo(x,y+d,x,y+d-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);const geo=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025,curveSegments:6});geo.rotateX(-Math.PI/2);return geo;}
 function rod(a,b,r,material,group=root,segments=12){const from=new T.Vector3(...a),to=new T.Vector3(...b),m=add(new T.CylinderGeometry(r,r,from.distanceTo(to),segments),material,0,0,0,group);m.position.copy(from).add(to).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),to.sub(from).normalize());return m;}
 const board=box(34,.85,20,walnut,0,-.50,.7);board.name='Continuous_walnut_workbench';
 box(34,.16,.16,darkWood,0,-.88,10.7);box(34,.10,.10,brass,0,-.78,10.76);
 const fabricCanvas=document.createElement('canvas');fabricCanvas.width=fabricCanvas.height=512;const fc=fabricCanvas.getContext('2d'),pixels=fc.createImageData(512,512);for(let i=0;i<pixels.data.length;i+=4){const n=27+random()*22;pixels.data[i]=n*1.12;pixels.data[i+1]=n;pixels.data[i+2]=n*.84;pixels.data[i+3]=255;}fc.putImageData(pixels,0,0);fc.globalAlpha=.12;for(let i=0;i<512;i+=3){fc.fillStyle=i%2?'#76614b':'#0b0806';fc.fillRect(i,0,1,512);fc.fillRect(0,i,512,1);}
 const fabric=new T.CanvasTexture(fabricCanvas);fabric.wrapS=fabric.wrapT=T.RepeatWrapping;fabric.repeat.set(3,2);fabric.colorSpace=T.SRGBColorSpace;fabric.anisotropy=wood.anisotropy;
 const matGeometry=rounded(18.8,13.6,.08,.16),matUv=matGeometry.attributes.uv,matPosition=matGeometry.attributes.position;for(let i=0;i<matUv.count;i++)matUv.setXY(i,matPosition.getX(i)/18.8+.5,matPosition.getZ(i)/13.6+.5);matUv.needsUpdate=true;
 const mat=add(matGeometry,new T.MeshStandardMaterial({map:fabric,bumpMap:fabric,bumpScale:.023,roughness:1,color:'#b0a18d'}),0,.015,0);mat.name='Single_charcoal_felt_mat';
 // A physical desk lamp, including its warm bulb and one local spotlight.
 const lamp=new T.Group();lamp.name='Brass_task_lamp';lamp.position.set(-12,0,-5.2);root.add(lamp);
 add(new T.CylinderGeometry(1.6,1.8,.17,48),brass,0,.08,0,lamp);add(new T.CylinderGeometry(1.25,1.5,.22,48),blackMetal,0,.25,0,lamp);add(new T.CylinderGeometry(.8,1.1,.16,40),brass,0,.43,0,lamp);
 rod([0,.4,0],[-.65,3.4,-.45],.10,brass,lamp);rod([-.65,3.4,-.45],[5.5,6,-1.25],.085,blackMetal,lamp);rod([-.85,3.4,-.45],[5.3,6,-1.25],.052,brass,lamp);
 for(const p of [[-.65,3.4,-.45],[5.5,6,-1.25]])add(new T.SphereGeometry(.20,12,8),brass,...p,lamp);
 const shade=new T.Group();shade.position.set(5.7,5.9,-.8);shade.rotation.set(-.95,0,-.13);lamp.add(shade);
 const profile=[new T.Vector2(.15,.9),new T.Vector2(.45,.85),new T.Vector2(.9,.58),new T.Vector2(1.3,.12),new T.Vector2(1.45,-.4),new T.Vector2(1.48,-.65)];
 const shell=add(new T.LatheGeometry(profile,48),new T.MeshStandardMaterial({color:'#151512',metalness:.85,roughness:.28,side:T.DoubleSide}),0,0,0,shade);shell.name='Lamp_shade';
 const glow=add(new T.CircleGeometry(1.37,48),new T.MeshBasicMaterial({color:'#ffe7b5',side:T.DoubleSide}),0,-.62,0,shade);glow.rotation.x=Math.PI/2;
 const light=new T.SpotLight('#ffd0a0',185,40,.85,.65,2);light.position.set(-6.3,5.5,-6);light.target.position.set(-1,0,0);root.add(light,light.target);
 // Leather field notebook and pencil.
 const notebook=new T.Group();notebook.position.set(-12.2,.02,2.7);notebook.rotation.y=-.13;root.add(notebook);notebook.name='Field_notebook';
 add(rounded(3.6,5.1,.14,.22),new T.MeshStandardMaterial({color:'#332016',roughness:.88,map:wood}),0,.03,0,notebook);
 const pages=new T.MeshStandardMaterial({color:'#b8a787',roughness:1});box(3.35,.32,4.9,pages,0,.29,0,notebook);add(rounded(3.6,5.1,.10,.22),new T.MeshStandardMaterial({color:'#3e281c',roughness:.86,bumpMap:wood,bumpScale:.01}),0,.45,0,notebook);
 for(let i=0;i<5;i++)box(3.35,.008,4.91,new T.MeshStandardMaterial({color:'#6e5940',roughness:1}),0,.15+i*.06,0,notebook);
 rod([-12.9,.66,.6],[-11.6,.66,4.4],.075,new T.MeshStandardMaterial({color:'#9b5e2f',roughness:.65}));rod([-12.9,.66,.6],[-13.02,.66,.25],.025,brass);
 // Magnifying glass: continuous ring, transparent lens and a long wooden handle.
 const lensGroup=new T.Group();lensGroup.name='Magnifying_glass';lensGroup.position.set(-10.8,.3,5.4);root.add(lensGroup);
 const ring=add(new T.TorusGeometry(.96,.095,12,56),brass,0,0,0,lensGroup);ring.rotation.x=Math.PI/2;
 const innerRing=add(new T.TorusGeometry(.86,.045,10,48),blackMetal,0,.005,0,lensGroup);innerRing.rotation.x=Math.PI/2;
 const glass=add(new T.CircleGeometry(.86,48),new T.MeshPhysicalMaterial({color:'#bcc2b1',transparent:true,opacity:.30,roughness:.06,metalness:.1,clearcoat:1,side:T.DoubleSide,depthWrite:false}),0,.01,0,lensGroup);glass.rotation.x=-Math.PI/2;
 rod([-.25,0,.90],[-1.7,-.08,3.75],.20,darkWood,lensGroup);rod([-.25,0,.90],[-.42,-.01,1.25],.23,brass,lensGroup);rod([-1.55,-.07,3.45],[-1.7,-.08,3.75],.225,blackMetal,lensGroup);
 // Hammer and soft mineral brush lie clear of all stone picking positions.
 rod([11.6,.52,1.7],[13.2,.25,7.4],.23,darkWood);rod([11.6,.52,1.7],[11.85,.48,2.6],.265,blackMetal);const head=box(3.15,.67,.82,steel,11.6,.65,1.7);head.rotation.y=-.28;
 for(const x of [10.05,13.15]){const cap=add(new T.CylinderGeometry(.43,.43,.38,6),steel,x,.65,1.7);cap.rotation.z=Math.PI/2;}
 const brush=new T.Group();brush.position.set(14,.1,3.3);brush.rotation.y=-.48;root.add(brush);brush.name='Mineral_brush';
 rod([0,.2,1.1],[0,.15,4.4],.16,walnut,brush);box(.80,.25,.60,brass,0,.2,.9,brush);
 const bristle=new T.MeshStandardMaterial({color:'#b4976a',roughness:1});for(let i=0;i<48;i++){const x=(random()-.5)*.72,z=-.8-random()*.45;rod([x*.5,.28,.65],[x,.13,z],.016+random()*.015,bristle,brush,4);}
 const tray=new T.Group();tray.name='Empty_specimen_tray';tray.position.set(12,.02,-5.8);tray.rotation.y=-.10;root.add(tray);const trayMat=new T.MeshStandardMaterial({color:'#211b16',roughness:.68,metalness:.25});box(5.7,.12,3.6,trayMat,0,.08,0,tray);for(const x of [-2.8,2.8])box(.13,.75,3.6,trayMat,x,.45,0,tray);for(const z of [-1.75,1.75])box(5.7,.75,.13,trayMat,0,.45,z,tray);
 // Soft rectangular lights for restrained metal reflections, with no visible magical glow.
 const studio=new T.Scene();studio.background=new T.Color('#30271e');for(const [x,y,z,w,h,color]of [[-6,10,5,8,7,'#ffddba'],[8,6,-2,4,7,'#8b8d88'],[0,12,-4,9,4,'#d3c1aa']]){const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);}const generator=new T.PMREMGenerator(renderer),environment=generator.fromScene(studio,.03);scene.environment=environment.texture;generator.dispose();
 return{board,mat,root,stoneBaseY:.13};
}
