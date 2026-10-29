import C from './config.js';
import './vocabulary.js';
import './app.js';
import {create,act,restore,serialize,stoneOf,typeOf,pending,summary} from './game.mjs';
import {t,getLanguage,setLanguage,translatePage} from './i18n.js';
import {StoneSound} from './sound.js';
const $=selector=>document.querySelector(selector),view=window.GeodeView,sound=new StoneSound();
const nameOf=item=>getLanguage()==='en'?item.en:item.name;
const freshSeed=()=>{const n=new Uint32Array(1);crypto.getRandomValues(n);return n[0]};
let game,selectedId=null,catalogType=null,screen='galleryScreen',light=false,locked=false,timer,feedback=null,storageWarning=null,notice=null;
let catalog=new Set(),draftGuess=null;const thumbs=new Map();
try{const raw=localStorage.getItem(C.catalogStorage);if(raw){const parsed=JSON.parse(raw);if(!Array.isArray(parsed)||parsed.some(id=>!typeOf(id)))throw Error('Invalid catalog');catalog=new Set(parsed)}}catch(e){storageWarning=e instanceof SyntaxError||e.message==='Invalid catalog'?'catalogDamaged':'storageUnavailable'}
try{const raw=localStorage.getItem(C.storage);game=raw?restore(raw):create(freshSeed());}catch{game=create(freshSeed());storageWarning='badSave'}
// A revealed stone already unlocks the permanent entry, even before reward collection.
for(const stone of game.stones)if(stone.phase==='revealed'||stone.phase==='opened')catalog.add(stone.specimen.type);
function persist(){try{localStorage.setItem(C.storage,serialize(game));localStorage.setItem(C.catalogStorage,JSON.stringify([...catalog]));}catch{storageWarning='storageUnavailable'}}
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function current(){return selectedId?stoneOf(game,selectedId):null;}
function specimenFor(stone){return {...stone.specimen,phase:stone.phase==='revealed'||stone.phase==='opened'?'opened':'intact'};}
function show(next){screen=next;notice=null;render();}
function select(id){selectedId=id;catalogType=null;draftGuess=null;light=false;feedback=null;clearTimeout(timer);locked=false;screen='experience';render();const stone=current();view?.load(specimenFor(stone),true);if(stone.phase==='cracking')view?.strike(stone.hits);$('#backButton').focus();}
function preview(typeId){selectedId=null;catalogType=typeId;light=false;feedback=null;screen='experience';render();view?.load({seed:1487,type:typeId,shell:'chalk',phase:'opened'},true);$('#backButton').focus();}
function transition(action,value){try{const stone=act(game,action,selectedId,value);if(stone.phase==='revealed')catalog.add(stone.specimen.type);persist();return stone;}catch(e){feedback=e.code||'invalidEvent';render();return null}}
function strike(){const stone=current();if(!stone||locked||stone.phase!=='cracking'){if(stone?.phase==='intact'){feedback=stone.guess?'pay':'chooseGuess';render()}return;}
 if(!transition('hit'))return;locked=true;feedback=stone.phase==='revealed'?'placeholder':'cracking';
 if(stone.phase==='revealed')view?.reveal();else view?.strike(stone.hits);
 sound.strike(stone.hits).then(status=>{if(status==='blocked'||status==='unavailable')feedback=status==='blocked'?'audioBlocked':'audioUnavailable';$('#soundButton').dataset.audioStatus=status;render()});
 render();clearTimeout(timer);timer=setTimeout(()=>{locked=false;render()},stone.phase==='revealed'?1000:240);
}
function renderGallery(){
 $('#batchLabel').textContent=t('batch',{n:game.batch});$('#roundCounter').textContent=t('roundCounter',{n:game.opened});
 $('#pendingNotice').hidden=!pending(game);$('#resultsButton').hidden=game.status==='active';
 const grid=$('#galleryGrid');grid.replaceChildren();for(const stone of game.stones){
  const button=element('button','stone-card');button.dataset.stone=stone.id;button.dataset.phase=stone.phase;
  button.setAttribute('aria-label',t('selectedHint',{id:stone.id})+' · '+t(stone.phase==='intact'?'unopened':stone.phase==='cracking'?'pendingLabel':stone.phase==='revealed'?'claimLabel':'opened'));
  const number=element('span','stone-number',stone.id),image=element('img','stone-thumb');image.alt='';image.draggable=false;
  const thumbnail=thumbs.get(stone.id);if(thumbnail)image.src=thumbnail;
  const shell=C.shells.find(s=>s.id===stone.specimen.shell);button.append(number,image,element('span','stone-name',stone.phase==='opened'?nameOf(typeOf(stone.specimen.type)):nameOf(shell)));
  if(stone.phase!=='intact')button.append(element('span','stone-state',t(stone.phase==='cracking'?'pendingLabel':stone.phase==='revealed'?'claimLabel':'opened')+(stone.phase==='cracking'?' '+stone.hits+'/4':'')));
  grid.append(button);
 }
}
function renderInspection(){
 const stone=current(),catalogOnly=!!catalogType,type=catalogOnly?typeOf(catalogType):stone?typeOf(stone.specimen.type):null;if(!type)return;
 const revealed=catalogOnly||stone.phase==='revealed'||stone.phase==='opened';
 $('#backButton').textContent=t(catalogOnly?'backCollection':'back');$('#specimenLabel').textContent=catalogOnly?'CATALOG / PROCEDURAL':`STONE_${stone.id} / ${game.seed}`;
 $('#phase').textContent=t(catalogOnly||revealed?'phaseReveal':stone.phase==='cracking'?'phaseCrack':'phaseInspect');$('#stageLabel').textContent=revealed?nameOf(type):t('unopened');
 $('#title').textContent=revealed?nameOf(type):t('selectedHint',{id:stone.id});$('#detailStep').textContent=t(catalogOnly?'catalogOnly':revealed?'reveal':'inspect');
 $('#subtitle').textContent=t(revealed?'revealHint':'guessHint');
 const list=$('#clueList');list.replaceChildren();if(!catalogOnly)for(const id of stone.specimen.clues)list.append(element('li','',C.clues[id][getLanguage()]));
 $('#clueDisclaimer').hidden=catalogOnly;
 $('#guessPanel').hidden=catalogOnly||stone.phase!=='intact';$('#strikePanel').hidden=catalogOnly||stone.phase!=='cracking';$('#revealPanel').hidden=!revealed;
 if(!catalogOnly){
  const options=$('#guessOptions');options.replaceChildren();const legend=element('legend','sr-only',t('guessTitle'));options.append(legend);
  for(const category of C.categories){const label=element('label','guess-choice'),radio=element('input');radio.type='radio';radio.name='guess';radio.value=category.id;radio.checked=(stone.guess||draftGuess)===category.id;radio.disabled=!!stone.guess||game.status!=='active';label.append(radio,element('span','',nameOf(category)));options.append(label);}
  $('#guessLocked').hidden=!stone.guess;$('#guessLocked').textContent=stone.guess?t('guessConfirmed',{name:nameOf(C.categories.find(c=>c.id===stone.guess))}):'';
  $('#confirmGuess').hidden=!!stone.guess;$('#confirmGuess').disabled=!draftGuess||game.status!=='active';
  $('#payButton').hidden=!stone.guess;$('#payButton').disabled=!view||game.status!=='active'||!!pending(game)||game.coins<C.cost;
  $('#stepHint').textContent=t('paid')+' · '+stone.hits+'/4';$('#strike').textContent=t('strikeAction',{n:Math.min(stone.hits+1,C.hits)});$('#strike').disabled=locked||!view;
  document.querySelectorAll('.hit-progress i').forEach((dot,i)=>dot.classList.toggle('done',i<stone.hits));
 }
 if(revealed){
  $('#rarityLabel').textContent=t('rarity')+' · '+t('rarity'+type.rarity);
  $('#guessResult').textContent=catalogOnly?'':t(stone.reward.correct?'correct':'incorrect');
  $('#rewardBreakdown').hidden=catalogOnly;$('#rewardBreakdown').replaceChildren();
  if(!catalogOnly)for(const [key,value] of [['rewardBase',stone.reward.base],['rewardCorrect',stone.reward.correct],['rewardNew',stone.reward.fresh],['rewardTotal',stone.reward.total]])$('#rewardBreakdown').append(element('dt','',t(key)),element('dd','',`+${value}`));
  $('#collectButton').hidden=catalogOnly||stone.phase==='opened';$('#collectButton').disabled=locked;$('#collectButton').textContent=catalogOnly?'':t('collectReward',{n:stone.reward.total});
  $('#collectedLabel').hidden=catalogOnly||stone.phase!=='opened';$('#continueButton').hidden=!catalogOnly&&stone.phase==='revealed';$('#continueButton').textContent=t(catalogOnly?'backCollection':game.status==='active'?'continue':'settlement');
 }
 $('#feedback').textContent=feedback?t(feedback):!catalogOnly&&pending(game)&&pending(game)!==stone?t('pendingNotice'):!catalogOnly&&game.status!=='active'?t('roundEnded'):t('modelOnly');
 const shellId=catalogOnly?'chalk':stone.specimen.shell;const assets={...C.assets,...C.pairings[shellId+':'+type.id]};$('#detailButton').hidden=!assets.detailImage;$('#detailButton').dataset.src=assets.detailImage||'';
 $('#lightButton').setAttribute('aria-pressed',String(light));
 $('#assetStatus').textContent=t($('#assetStatus').dataset.message||'asset');
}
function catalogCard(type,unlocked,stone){
 const card=element('article','catalog-card'+(unlocked?'':' is-locked'));const swatch=element('div','mineral-sample',unlocked?'':'?');swatch.style.setProperty('--mineral',unlocked?type.color:'#3c362f');
 if(unlocked&&type.imageUrl){const image=element('img','catalog-photo');image.src=type.imageUrl;image.alt=nameOf(type);image.onerror=()=>image.replaceWith(swatch);card.append(image)}else card.append(swatch);
 card.append(element('p','eyebrow',unlocked?t('rarity'+type.rarity):t('locked')),element('h3','',unlocked?nameOf(type):'— — —'));
 if(unlocked){const button=element('button','text-button',t('preview'));if(stone)button.dataset.stone=stone.id;else button.dataset.catalog=type.id;card.append(button)}return card;
}
function renderCollection(){const round=$('#roundCollection');round.replaceChildren();const found=game.stones.filter(s=>s.phase==='revealed'||s.phase==='opened');if(!found.length)round.append(element('p','intro',t('roundEmpty')));else for(const stone of found)round.append(catalogCard(typeOf(stone.specimen.type),true,stone));const permanent=$('#permanentCollection');permanent.replaceChildren();for(const type of C.types)permanent.append(catalogCard(type,catalog.has(type.id)));}
function renderSummary(){const s=summary(game);$('#summaryBatch').textContent=t('batch',{n:game.batch});$('#summaryTitle').textContent=t(game.status==='complete'?'complete':'gameover');$('#summaryKinds').textContent=game.first.length?game.first.map(id=>nameOf(typeOf(id))).join(' · '):t('none');const stats=$('#summaryStats');stats.replaceChildren();for(const [label,value] of [['statOpened',s.opened+'/25'],['statAccuracy',s.rate+'% ('+s.correct+'/'+s.opened+')'],['statKinds',s.kinds+'/5'],['statRarest',s.rarest?nameOf(s.rarest):t('none')]]){const box=element('div');box.append(element('span','fine-print',t(label)),element('strong','',value));stats.append(box)}}
function render(){
 translatePage();for(const id of ['galleryScreen','experience','collectionScreen','summaryScreen'])$('#'+id).hidden=id!==screen;
 $('#balance').textContent=game.coins;$('#balance').dataset.coins=game.coins;
 $('#galleryNav').setAttribute('aria-current',screen==='galleryScreen'?'page':'false');$('#collectionNav').setAttribute('aria-current',screen==='collectionScreen'?'page':'false');
 $('#soundButton').textContent=t(sound.enabled?'soundOn':'soundOff');$('#soundButton').setAttribute('aria-pressed',String(sound.enabled));$('#languageButton').textContent=getLanguage()==='zh'?'EN / 中文':'中文 / EN';$('#languageButton').setAttribute('aria-label',t('switchLanguage'));
 $('#storageNotice').hidden=!storageWarning;$('#storageNotice').textContent=storageWarning?t(storageWarning):'';$('#notice').hidden=!notice;$('#notice').textContent=notice?t(notice):'';
 if(screen==='galleryScreen')renderGallery();if(screen==='experience')renderInspection();if(screen==='collectionScreen')renderCollection();if(screen==='summaryScreen')renderSummary();
}
function requestRestart(){ $('#restartDialog').showModal(); }
$('#home').onclick=e=>{e.preventDefault();show('galleryScreen')};$('#galleryNav').onclick=()=>show('galleryScreen');$('#collectionNav').onclick=()=>show('collectionScreen');
for(const id of ['galleryGrid','roundCollection','permanentCollection'])$('#'+id).onclick=e=>{const card=e.target.closest('[data-stone],[data-catalog]');if(card?.dataset.stone)select(card.dataset.stone);else if(card?.dataset.catalog)preview(card.dataset.catalog)};
$('#backButton').onclick=()=>show(catalogType?'collectionScreen':'galleryScreen');$('#resumeButton').onclick=()=>{const stone=pending(game);if(stone)select(stone.id)};
$('#guessOptions').onchange=e=>{draftGuess=e.target.value;feedback=null;render();$('#guessOptions input[value="'+draftGuess+'"]').focus()};$('#confirmGuess').onclick=()=>{if(transition('guess',draftGuess)){feedback=null;render()}};
$('#payButton').onclick=()=>{if(transition('pay')){feedback='paid';render()}};$('#strike').onclick=strike;$('#stage').addEventListener('stone-tap',strike);$('#stage').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();strike()}});
$('#collectButton').onclick=()=>{if(locked)return;if(transition('collect')){feedback='collected';if(game.status!=='active')show('summaryScreen');else render()}};
$('#continueButton').onclick=()=>show(catalogType?'collectionScreen':game.status==='active'?'galleryScreen':'summaryScreen');$('#resultsButton').onclick=()=>show('summaryScreen');$('#summaryCollection').onclick=()=>show('collectionScreen');$('#summaryTable').onclick=()=>show('galleryScreen');
for(const button of document.querySelectorAll('.restart-trigger'))button.onclick=requestRestart;$('#cancelRestart').onclick=()=>$('#restartDialog').close();$('#confirmRestart').onclick=()=>{clearTimeout(timer);locked=false;game=create(freshSeed(),game.batch+1);selectedId=null;catalogType=null;draftGuess=null;feedback=null;thumbs.clear();persist();$('#restartDialog').close();show('galleryScreen');buildThumbnails()};
$('#rulesButton').onclick=()=>$('#rulesDialog').showModal();$('#closeRules').onclick=()=>$('#rulesDialog').close();
$('#languageButton').onclick=()=>setLanguage(getLanguage()==='zh'?'en':'zh');document.addEventListener('languagechange',render);
$('#soundButton').onclick=async()=>{sound.setEnabled(!sound.enabled);feedback=null;const status=sound.enabled?await sound.unlock():'muted';$('#soundButton').dataset.audioStatus=status;if(status==='blocked'||status==='unavailable'){feedback='audioUnavailable';notice='audioUnavailable'}render()};
$('#lightButton').onclick=()=>{light=!light;view?.setLight(light);render()};$('#rotateLeft').onclick=()=>view?.rotate(-Math.PI/8);$('#rotateRight').onclick=()=>view?.rotate(Math.PI/8);$('#zoomIn').onclick=()=>view?.zoom(-.7);$('#zoomOut').onclick=()=>view?.zoom(.7);$('#viewReset').onclick=()=>{view?.resetView();const stone=current();if(stone?.phase==='cracking')view?.strike(stone.hits)};
async function buildThumbnails(){if(!view)return;const batch=game.seed;$('#galleryGrid').setAttribute('aria-busy','true');for(const stone of game.stones){if(game.seed!==batch)break;thumbs.set(stone.id,view.thumbnail(stone.specimen));if(stone.slot%5===4)await new Promise(resolve=>requestAnimationFrame(resolve));}if(game.seed===batch){$('#galleryGrid').removeAttribute('aria-busy');render();if(screen==='experience'&&current()){view.load(specimenFor(current()),true);if(current().phase==='cracking')view.strike(current().hits)}}}
$('#detailButton').onclick=()=>{$('#detailImage').src=$('#detailButton').dataset.src;$('#detailImage').alt=t('photoAlt');$('#detailPhotoLabel').textContent=t('photo');$('#detailDialog').showModal()};$('#detailImage').onerror=()=>$('#detailPhotoLabel').textContent=t('photoError');$('#closeDetail').onclick=()=>$('#detailDialog').close();
if(!view){notice='failed';document.querySelectorAll('.tool').forEach(button=>button.disabled=true)}
persist();render();buildThumbnails();
