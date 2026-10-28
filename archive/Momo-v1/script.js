'use strict';
const svg=document.querySelector('#character');
const $=id=>document.getElementById(id);
const state={left:0,right:0,targetLeft:0,targetRight:0,active:null,pointer:null,last:0};
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let presetTimer;
function point(event){const matrix=svg.getScreenCTM();return new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());}
function release(){state.active=null;state.pointer=null;state.targetLeft=0;state.targetRight=0;}
for(const side of ['left','right']){
 const handle=$(side+'Handle');
 handle.addEventListener('pointerdown',event=>{if(state.active!==null)return;event.preventDefault();clearTimeout(presetTimer);state.active=side;state.pointer=event.pointerId;handle.setPointerCapture(event.pointerId);state['target'+(side==='left'?'Left':'Right')]=clamp(point(event).y-370,-32,34);});
 handle.addEventListener('pointermove',event=>{if(state.active!==side||event.pointerId!==state.pointer)return;state['target'+(side==='left'?'Left':'Right')]=clamp(point(event).y-370,-32,34);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])handle.addEventListener(name,event=>{if(state.pointer===event.pointerId)release();});
 handle.addEventListener('keydown',event=>{if(!['ArrowUp','ArrowDown','Home','Escape'].includes(event.key))return;event.preventDefault();clearTimeout(presetTimer);const key='target'+(side==='left'?'Left':'Right');state[key]=['Home','Escape'].includes(event.key)?0:clamp(state[key]+(event.key==='ArrowUp'?-7:7),-32,34);});
 handle.addEventListener('blur',()=>{if(state.active===null)release();});
}
window.addEventListener('blur',release);
document.addEventListener('visibilitychange',()=>{if(document.hidden)release();});
for(const button of document.querySelectorAll('[data-mood]'))button.addEventListener('click',()=>{clearTimeout(presetTimer);state.targetLeft=state.targetRight=button.dataset.mood==='happy'?-28:30;presetTimer=setTimeout(release,1800);});
$('reset').addEventListener('click',()=>{clearTimeout(presetTimer);release();});
function render(time){
 const dt=Math.min((time-state.last)/1000||.016,.05);state.last=time;
 const blend=1-Math.exp(-(state.active?35:8)*dt);
 state.left+=(state.targetLeft-state.left)*blend;state.right+=(state.targetRight-state.right)*blend;
 const l=state.left,r=state.right,avg=(l+r)/2;
 const smile=clamp(-avg/25,0,1),sad=clamp(avg/27,0,1),tension=clamp(Math.max(Math.abs(l),Math.abs(r))/32,0,1);
 const leftY=370+l,rightY=370+r,control=380-avg*.24;
 const path=`M270 ${leftY} Q300 ${control} 330 ${rightY}`;
 $('mouth').setAttribute('d',path);$('mouthShade').setAttribute('d',path);
 for(const side of ['left','right']){const y=side==='left'?leftY:rightY;$(side+'Handle').setAttribute('cy',y);$(side+'Dot').setAttribute('cy',y);$(side+'Handle').setAttribute('aria-valuenow',(-(y-370)/34).toFixed(2));}
 const eyeScale=1-smile*.29+sad*.16;
 $('eyeL').setAttribute('transform',`translate(240 306) scale(1 ${eyeScale}) translate(-240 -306)`);
 $('eyeR').setAttribute('transform',`translate(360 306) scale(1 ${eyeScale}) translate(-360 -306)`);
 $('browL').setAttribute('d',`M214 ${264+sad*5-smile*3} Q239 ${251-sad*13-smile*2} 263 ${262-sad*16}`);
 $('browR').setAttribute('d',`M338 ${262-sad*16} Q362 ${251-sad*13-smile*2} 387 ${264+sad*5-smile*3}`);
 $('cheeks').style.opacity=.55+smile*.45+sad*.18;
 $('sweat').setAttribute('opacity',Math.max(0,(tension-.55)*2.2));
 const shake=!reduced.matches&&tension>.85?Math.sin(time*.045)*(tension-.85)*10:0;
 $('girl').style.transform=`translate(${shake}px, ${reduced.matches?0:Math.sin(time*.0017)*1.3}px) rotate(${(r-l)*.025}deg)`;
 const label=avg< -8?'糟糕，开心要藏不住了！':avg>8?'呜……真的有一点委屈':Math.abs(r-l)>12?'嘴角好像有自己的想法':'努力保持平静中';
 if($('feelingText').textContent!==label)$('feelingText').textContent=label;
 requestAnimationFrame(render);
}
requestAnimationFrame(render);
