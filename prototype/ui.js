import './app.js';
import {t,getLanguage,setLanguage,translatePage} from './i18n.js';
import {StoneSound} from './sound.js';
// All input paths share this guarded four-strike loop.
const $=s=>document.querySelector(s),view=window.GeodeView,total=GH_CONFIG.hits,sound=new StoneSound();
let hits=0,locked=false,light=false,timer,feedback='ready',audioWarning=null;
function render(){
 translatePage();
 document.querySelectorAll('.hit-progress i').forEach((dot,i)=>dot.classList.toggle('done',i<hits));
 $('#strike').disabled=!view||locked||hits>=total;
 $('#strike').textContent=hits>=total?t('done'):t('hit'+hits)+'  '+(hits+1)+' / '+total+' ↗';
 $('#stepHint').textContent=hits===0?t('idle'):hits<total?t('progress',{n:hits}):t('finished');
 $('#phase').textContent=hits>=total?'02 / REVEAL':'01 / OBSERVE';
 $('#stageLabel').textContent=t(hits>=total?'revealed':'closed');
 $('#title').textContent=t(hits>=total?'openTitle':'title');
 $('#subtitle').textContent=t(hits>=total?'openSubtitle':'subtitle');
 $('#feedback').textContent=t(audioWarning||feedback);
 $('#soundButton').textContent=t(sound.enabled?'soundOn':'soundOff');$('#soundButton').setAttribute('aria-pressed',String(sound.enabled));
 $('#languageButton').textContent=getLanguage()==='zh'?'EN / 中文':'中文 / EN';$('#languageButton').setAttribute('aria-label',t('switchLanguage'));
 $('#lightButton').setAttribute('aria-pressed',String(light));
 $('#assetStatus').textContent=t($('#assetStatus').dataset.message||'asset');
}
function strike(){
 if(locked||hits>=total||!view)return;
 hits++;locked=true;audioWarning=null;
 if(hits<total){view.strike(hits);feedback=hits===1?'first':'cracking'}else{view.reveal();feedback='placeholder'}
 sound.strike(hits).then(status=>{if(status==='unavailable'||status==='blocked'){audioWarning=status==='blocked'?'audioBlocked':'audioUnavailable';render()}$('#soundButton').dataset.audioStatus=status;});
 render();clearTimeout(timer);timer=setTimeout(()=>{locked=false;render()},hits===total?1100:220);
}
$('#strike').onclick=strike;$('#stage').addEventListener('stone-tap',strike);
$('#stage').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)strike()}});
$('#reset').onclick=()=>{clearTimeout(timer);hits=0;locked=false;light=false;audioWarning=null;view?.reset();feedback='resetFeedback';render()};
$('#languageButton').onclick=()=>setLanguage(getLanguage()==='zh'?'en':'zh');document.addEventListener('languagechange',render);
$('#soundButton').onclick=async()=>{sound.setEnabled(!sound.enabled);audioWarning=null;if(sound.enabled){const status=await sound.unlock();if(status==='unavailable'||status==='blocked')audioWarning=status==='blocked'?'audioBlocked':'audioUnavailable';$('#soundButton').dataset.audioStatus=status;}else $('#soundButton').dataset.audioStatus='muted';render()};
$('#lightButton').onclick=()=>{light=!light;view?.setLight(light);render()};
$('#rotateLeft').onclick=()=>view?.rotate(-Math.PI/8);$('#rotateRight').onclick=()=>view?.rotate(Math.PI/8);$('#zoomIn').onclick=()=>view?.zoom(-.7);$('#zoomOut').onclick=()=>view?.zoom(.7);$('#viewReset').onclick=()=>{view?.resetView();if(hits>0&&hits<total)view?.strike(hits)};
$('#clueButton').onclick=()=>{$('#clueText').hidden=!$('#clueText').hidden;$('#clueButton').setAttribute('aria-expanded',String(!$('#clueText').hidden));};
if(view)view.load({seed:GH_CONFIG.seed,type:'white-druse',phase:'intact'},true);else{feedback='failed';document.querySelectorAll('.tool').forEach(b=>b.disabled=true)}
render();
// An optional detail photo is explicitly separate from real 3D observation.
if(GH_CONFIG.assets.detailImage){const dialog=document.createElement('dialog'),label=document.createElement('p'),image=document.createElement('img'),close=document.createElement('button'),open=document.createElement('button');let failed=false;image.style.width='100%';image.src=GH_CONFIG.assets.detailImage;function translate(){label.textContent=t(failed?'photoError':'photo');image.alt=t('photoAlt');close.textContent=t('close');open.textContent=t('photoOpen')}image.onerror=()=>{failed=true;translate()};close.className='secondary';close.onclick=()=>dialog.close();dialog.append(label,image,close);open.className='text-button';open.onclick=()=>dialog.showModal();document.body.append(dialog);document.querySelector('.story').append(open);document.addEventListener('languagechange',translate);translate();}
