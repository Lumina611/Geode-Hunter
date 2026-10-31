import {mineralNotes} from './mineral-notes.js?v=1';
import C from './config.js';
import {resolveAssets} from './assets.js';
import './vocabulary.js';
import './v03-vocabulary.js?v=mineral-density-4';
import {StoneTable} from './table.js?v=workshop-4';
import './app.js?v=mineral-density-4';
import './workshop-vocabulary.js';
import {create,act,restore,serialize,stoneOf,typeOf,pending,summary} from './game.mjs';
import {t,getLanguage,setLanguage,translatePage} from './i18n.js';
import {StoneSound} from './sound.js';
const $=selector=>document.querySelector(selector),view=window.GeodeView,sound=new StoneSound();
const nameOf=item=>getLanguage()==='en'?item.en:item.name;
const freshSeed=()=>{const n=new Uint32Array(1);crypto.getRandomValues(n);return n[0]};
let game,selectedId=null,catalogType=null,screen='galleryScreen',light=false,locked=false,timer,feedback=null,storageWarning=null,notice=null;
let tableSelectedId=null,tableRoundKey=null,tableTransition=false;
let catalog=new Set(),draftGuess=null,selectionEpoch=0,previewBusy=false;const previews=new Map();let table=null;
for(const key of [C.legacyCatalogStorage,C.catalogStorage])try{const raw=localStorage.getItem(key);if(raw){const parsed=JSON.parse(raw);if(!Array.isArray(parsed)||parsed.some(id=>!typeOf(id)))throw Error('Invalid catalog');for(const id of parsed)catalog.add(id)}}catch(e){storageWarning=e instanceof SyntaxError||e.message==='Invalid catalog'?'catalogDamaged':'storageUnavailable'}
try{const raw=localStorage.getItem(C.storage)||localStorage.getItem(C.legacyStorage);game=raw?restore(raw):create(freshSeed());if(raw&&JSON.parse(raw).version===2)notice='saveMigrated';}catch{game=create(freshSeed());storageWarning='badSave'}
try{if(view)table=new StoneTable($('#tableStage'),data=>view.exterior(data),id=>chooseOnTable(id));}catch(e){notice='tableUnavailable';console.error(e)}
// A revealed stone already unlocks the permanent entry, even before reward collection.
for(const stone of game.stones)if(stone.phase==='revealed'||stone.phase==='opened')catalog.add(stone.specimen.type);
function persist(){try{localStorage.setItem(C.storage,serialize(game));localStorage.setItem(C.catalogStorage,JSON.stringify([...catalog]));}catch{storageWarning='storageUnavailable'}}
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function current(){return selectedId?stoneOf(game,selectedId):null;}
function specimenFor(stone){return {...stone.specimen,phase:stone.phase==='revealed'||stone.phase==='opened'?'opened':'intact'};}
function show(next){selectionEpoch++;screen=next;notice=null;render();}
async function select(id){if(screen==='galleryScreen'&&table?.move?.resolve)return;const epoch=++selectionEpoch;if(screen==='galleryScreen'&&table){const completed=await table.focus(id);if(!completed||epoch!==selectionEpoch||screen!=='galleryScreen')return;}selectedId=id;catalogType=null;draftGuess=null;light=false;feedback=null;clearTimeout(timer);locked=false;screen='experience';render();const stone=current();await view?.load(specimenFor(stone),true);if(epoch!==selectionEpoch||selectedId!==id||screen!=='experience')return;if(stone.phase==='cracking')view?.strike(stone.hits);$('#backButton').focus();}
function preview(typeId){selectedId=null;catalogType=typeId;light=false;feedback=null;screen='experience';render();view?.load({seed:1487+Number(typeOf(typeId).number)*13,type:typeId,shell:'chalk',phase:'opened'},true);$('#backButton').focus();}
function transition(action,value){try{const stone=act(game,action,selectedId,value);if(stone.phase==='revealed')catalog.add(stone.specimen.type);persist();return stone;}catch(e){feedback=e.code||'invalidEvent';render();return null}}
function strike(){const stone=current();if(!stone||locked||stone.phase!=='cracking'){if(stone?.phase==='intact'){feedback=stone.guess?'pay':'chooseGuess';render()}return;}
 if(!transition('hit'))return;locked=true;feedback=stone.phase==='revealed'?'placeholder':'cracking';
 if(stone.phase==='revealed')view?.reveal();else view?.strike(stone.hits);
 sound.strike(stone.hits).then(status=>{if(status==='blocked'||status==='unavailable')feedback=status==='blocked'?'audioBlocked':'audioUnavailable';$('#soundButton').dataset.audioStatus=status;render()});
 render();clearTimeout(timer);timer=setTimeout(()=>{locked=false;render()},stone.phase==='revealed'?1000:240);
}
function chooseOnTable(id){if(tableTransition||table?.move)return;tableSelectedId=id;table?.choose(id);renderTableSelection();}
function renderTableSelection(){const stone=game.stones.find(item=>item.id===tableSelectedId);$('#selectionNumber').textContent=stone?.id||'—';$('#selectionChips').replaceChildren();$('#selectionLabel').textContent=t(stone?'selectedStone':'selectPrompt');if(stone){const shell=C.shells.find(item=>item.id===stone.specimen.shell);$('#selectionChips').append(element('span','selection-chip',nameOf(shell)));const clue=stone.specimen.clues.find(id=>t('clueTag_'+id)!==nameOf(shell));if(clue)$('#selectionChips').append(element('span','selection-chip',t('clueTag_'+clue)));}$('#inspectSelection').disabled=!stone||tableTransition;$('#inspectSelection').textContent=t(stone&&(stone.phase==='opened'||stone.phase==='revealed')?'viewOpened':'pickUp');}
function renderGallery(){
 const region=C.regions.find(r=>r.id===game.region);$('#batchLabel').textContent=t('batch',{n:game.batch})+' · '+(region?nameOf(region):'');$('#roundCounter').textContent=t('roundCounter',{n:game.opened});
 $('#pendingNotice').hidden=!pending(game);$('#resultsButton').hidden=game.status==='active';const roundKey=game.generation+':'+game.seed;if(tableRoundKey!==roundKey){tableRoundKey=roundKey;tableSelectedId=null;}table?.sync(game.stones,roundKey);table?.choose(tableSelectedId);renderTableSelection();
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
 const shellId=catalogOnly?'chalk':stone.specimen.shell;const assets=resolveAssets({shell:shellId,type:type.id,seed:catalogOnly?1487+Number(type.number)*13:stone.specimen.seed});$('#detailButton').hidden=!assets.detailImage;$('#detailButton').dataset.src=assets.detailImage||'';
 $('#catalogFacts').hidden=!revealed;if(revealed){$('#specimenKind').textContent=t(type.fantasy?'fantasy':type.future?'futureEntry':'realReference');const facts=$('#mineralFacts');facts.replaceChildren();for(const [key,value] of [['mineral',type.mineral[getLanguage()]],['habit',type.habit[getLanguage()]],['guessCategory',nameOf(C.categories.find(c=>c.id===type.category))],['rarity',t('rarity'+type.rarity)]])facts.append(element('dt','',t(key)),element('dd','',value));$('#specimenDescription').textContent=type.description[getLanguage()];const notes=mineralNotes(type,getLanguage()),panel=$('#mineralNotes');panel.replaceChildren(element('h2','',notes.title),element('p','',notes.body),element('h3','',notes.observeTitle),element('p','',notes.observe));if(notes.sources.length){const links=element('p','fine-print',notes.sourceTitle+': ');for(const item of notes.sources){const a=element('a','',item.name);a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';links.append(a,document.createTextNode(' '));}panel.append(links);}}
 $('#lightButton').setAttribute('aria-pressed',String(light));
 $('#assetStatus').textContent=t($('#assetStatus').dataset.message||'asset');
}
function catalogCard(type,unlocked,stone){
 const card=element('article','catalog-card'+(unlocked?'':' is-locked')),key=stone?'stone:'+game.seed+':'+stone.id:'type:'+type.id;
 const image=element('img','catalog-photo'),badge=element('p','render-label',t(type.art.imageUrl?'formalImage':type.art.modelStatus==='reference-study'?'referenceModelBadge':'placeholderLabel'));
 image.alt=unlocked?nameOf(type):t('locked');image.loading='lazy';image.width=480;image.height=320;
 const source=type.art.imageUrl||previews.get(key);if(source)image.src=source;else card.classList.add('is-loading');
 image.onerror=()=>{const fallback=previews.get(key);if(fallback&&image.src!==fallback){image.src=fallback;badge.textContent=t('placeholderLabel')}};
 card.append(image,badge,element('p','eyebrow',unlocked?t('rarity'+type.rarity):type.future?t('futureEntry'):t('locked')),element('h3','',unlocked||type.future?nameOf(type):'— — —'));
 if(unlocked||type.future){const button=element('button','text-button',t(type.future&&!unlocked?'futureInfo':'preview'));if(stone)button.dataset.stone=stone.id;else button.dataset.catalog=type.id;card.append(button)}return card;
}
function renderCollection(){const round=$('#roundCollection');round.replaceChildren();const found=game.stones.filter(s=>s.phase==='revealed'||s.phase==='opened');if(!found.length)round.append(element('p','intro',t('roundEmpty')));else for(const stone of found)round.append(catalogCard(typeOf(stone.specimen.type),true,stone));const permanent=$('#permanentCollection');permanent.replaceChildren();for(const type of C.types)permanent.append(catalogCard(type,catalog.has(type.id)));ensurePreviews();}
async function ensurePreviews(){if(!view||previewBusy)return;previewBusy=true;try{
 const items=[...C.types.map(type=>({key:'type:'+type.id,type:type.id,seed:1487+Number(type.number)*13,shell:'chalk'})),...game.stones.filter(s=>s.phase==='revealed'||s.phase==='opened').map(s=>({key:'stone:'+game.seed+':'+s.id,type:s.specimen.type,seed:s.specimen.seed,shell:s.specimen.shell}))];
 for(const item of items){if(screen!=='collectionScreen')break;if(previews.has(item.key))continue;previews.set(item.key,await view.assetThumbnail(item.type,item.seed,item.shell));renderCollection();await new Promise(resolve=>requestAnimationFrame(resolve));}
 }finally{previewBusy=false}}
function renderSummary(){const s=summary(game);$('#summaryBatch').textContent=t('batch',{n:game.batch});$('#summaryTitle').textContent=t(game.status==='complete'?'complete':'gameover');$('#summaryKinds').textContent=game.first.length?game.first.map(id=>nameOf(typeOf(id))).join(' · '):t('none');const stats=$('#summaryStats');stats.replaceChildren();for(const [label,value] of [['statOpened',s.opened+'/25'],['statAccuracy',s.rate+'% ('+s.correct+'/'+s.opened+')'],['statKinds',s.kinds+'/'+C.types.length],['statRarest',s.rarest?nameOf(s.rarest):t('none')]]){const box=element('div');box.append(element('span','fine-print',t(label)),element('strong','',value));stats.append(box)}}
function render(){
 document.body.classList.toggle('at-workbench',screen==='galleryScreen');translatePage();for(const id of ['galleryScreen','experience','collectionScreen','summaryScreen'])$('#'+id).hidden=id!==screen;
 table?.setActive(screen==='galleryScreen');
 $('#balance').textContent=game.coins;$('#balance').dataset.coins=game.coins;
 $('#galleryNav').setAttribute('aria-current',screen==='galleryScreen'?'page':'false');$('#collectionNav').setAttribute('aria-current',screen==='collectionScreen'?'page':'false');
 $('#soundButton').setAttribute('aria-label',t(sound.enabled?'soundOn':'soundOff'));$('#soundButton').classList.toggle('is-muted',!sound.enabled);$('#soundButton').setAttribute('aria-pressed',String(sound.enabled));$('#languageButton').textContent=getLanguage()==='zh'?'EN / 中文':'中文 / EN';$('#languageButton').setAttribute('aria-label',t('switchLanguage'));
 $('#storageNotice').hidden=!storageWarning;$('#storageNotice').textContent=storageWarning?t(storageWarning):'';$('#notice').hidden=!notice;$('#notice').textContent=notice?t(notice):'';
 if(screen==='galleryScreen')renderGallery();if(screen==='experience')renderInspection();if(screen==='collectionScreen')renderCollection();if(screen==='summaryScreen')renderSummary();
}
function requestRestart(){ $('#restartDialog').showModal(); }
$('#home').onclick=e=>{e.preventDefault();show('galleryScreen')};$('#galleryNav').onclick=()=>show('galleryScreen');$('#collectionNav').onclick=()=>show('collectionScreen');
for(const id of ['roundCollection','permanentCollection'])$('#'+id).onclick=e=>{const card=e.target.closest('[data-stone],[data-catalog]');if(card?.dataset.stone)select(card.dataset.stone);else if(card?.dataset.catalog)preview(card.dataset.catalog)};
$('#backButton').onclick=()=>show(catalogType?'collectionScreen':'galleryScreen');$('#resumeButton').onclick=()=>{const stone=pending(game);if(stone)select(stone.id)};
$('#guessOptions').onchange=e=>{draftGuess=e.target.value;feedback=null;render();$('#guessOptions input[value="'+draftGuess+'"]').focus()};$('#confirmGuess').onclick=()=>{if(transition('guess',draftGuess)){feedback=null;render()}};
$('#payButton').onclick=()=>{if(transition('pay')){feedback='paid';render()}};$('#strike').onclick=strike;$('#stage').addEventListener('stone-tap',strike);$('#stage').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();strike()}});
$('#collectButton').onclick=()=>{if(locked)return;if(transition('collect')){feedback='collected';if(game.status!=='active')show('summaryScreen');else render()}};
$('#continueButton').onclick=()=>show(catalogType?'collectionScreen':game.status==='active'?'galleryScreen':'summaryScreen');$('#resultsButton').onclick=()=>show('summaryScreen');$('#summaryCollection').onclick=()=>show('collectionScreen');$('#summaryTable').onclick=()=>show('galleryScreen');
for(const button of document.querySelectorAll('.restart-trigger'))button.onclick=requestRestart;$('#cancelRestart').onclick=()=>$('#restartDialog').close();$('#confirmRestart').onclick=()=>{clearTimeout(timer);locked=false;game=create(freshSeed(),game.batch+1);selectedId=null;catalogType=null;draftGuess=null;feedback=null;previews.clear();persist();$('#restartDialog').close();show('galleryScreen')};
$('#rulesButton').onclick=()=>$('#rulesDialog').showModal();$('#closeRules').onclick=()=>$('#rulesDialog').close();
$('#languageButton').onclick=()=>setLanguage(getLanguage()==='zh'?'en':'zh');document.addEventListener('languagechange',render);
$('#soundButton').onclick=async()=>{sound.setEnabled(!sound.enabled);feedback=null;const status=sound.enabled?await sound.unlock():'muted';$('#soundButton').dataset.audioStatus=status;if(status==='blocked'||status==='unavailable'){feedback='audioUnavailable';notice='audioUnavailable'}render()};
$('#lightButton').onclick=()=>{light=!light;view?.setLight(light);render()};$('#rotateLeft').onclick=()=>view?.rotate(-Math.PI/8);$('#rotateRight').onclick=()=>view?.rotate(Math.PI/8);$('#zoomIn').onclick=()=>view?.zoom(-.7);$('#zoomOut').onclick=()=>view?.zoom(.7);$('#viewReset').onclick=()=>{view?.resetView();const stone=current();if(stone?.phase==='cracking')view?.strike(stone.hits)};
$('#detailButton').onclick=()=>{$('#detailImage').src=$('#detailButton').dataset.src;$('#detailImage').alt=t('photoAlt');$('#detailPhotoLabel').textContent=t('photo');$('#detailDialog').showModal()};$('#detailImage').onerror=()=>$('#detailPhotoLabel').textContent=t('photoError');$('#closeDetail').onclick=()=>$('#detailDialog').close();
if(!view){notice='failed';document.querySelectorAll('.tool').forEach(button=>button.disabled=true)}
persist();render();

$('#inspectSelection').onclick=async()=>{if(!tableSelectedId||tableTransition)return;tableTransition=true;renderTableSelection();try{await select(tableSelectedId)}finally{tableTransition=false;renderTableSelection();}};
