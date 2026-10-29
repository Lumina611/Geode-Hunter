import C from './config.js';
import Legacy from './legacy-v02-config.js';
// No randomness in transitions: outcomes, shells and clues are fixed at create().
export class GameError extends Error {constructor(code){super(code);this.code=code}}
const fail=code=>{throw new GameError(code)};
export const typeOf=id=>C.types.find(t=>t.id===id);
export function rng(seed){let x=seed>>>0;return()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296}}
export function layoutFor(seed){const r=rng((seed^0x9e3779b9)>>>0);return Array.from({length:C.batchSize},(_,i)=>Object.freeze({x:(i%5-2)*3.2+(r()-.5)*.50,z:(Math.floor(i/5)-2)*2.25+(r()-.5)*.35,scale:.52+r()*.10,rotation:r()*Math.PI*2,lean:(r()-.5)*.22}));}
export function create(seed,batch=1,generation=3){
 const random=rng(seed),region=C.regions[(seed>>>0)%C.regions.length].id,legacy=generation===2;
 const pool=legacy?Legacy.types:C.types.filter(t=>!t.fantasy&&!t.future&&t.regions.includes(region));
 const weight=pool.reduce((n,t)=>n+t.weight,0),layouts=layoutFor(seed),hidden=rng((seed^0xa341316c)>>>0);
 const hiddenSlot=!legacy&&hidden()<C.hiddenBatchChance?Math.floor(hidden()*C.batchSize):-1;
 const hiddenType=C.types.filter(t=>t.fantasy)[Math.floor(hidden()*2)];
 const stones=Array.from({length:C.batchSize},(_,slot)=>{
  let value=random()*weight,type=pool.at(-1);for(const candidate of pool){value-=candidate.weight;if(value<0){type=candidate;break}}
  const shell=C.shells[Math.floor(random()*C.shells.length)],clues=[shell.clues[Math.floor(random()*shell.clues.length)]];
  if(random()<.7){const next=shell.clues.find(id=>id!==clues[0]);if(next)clues.push(next)}
  const specimen=Object.freeze({seed:Math.floor(random()*4294967296),type:slot===hiddenSlot?hiddenType.id:type.id,shell:shell.id,clues:Object.freeze(clues),layout:layouts[slot]});
  return {id:String(slot+1).padStart(2,'0'),slot,specimen,guess:null,phase:'intact',hits:0,reward:null};
 });
 return {version:C.version,generation:legacy?2:3,seed:seed>>>0,batch,region,coins:C.initialCoins,stones,first:[],opened:0,correct:0,status:'active',events:[]};
}
export function stoneOf(game,id){return game.stones.find(s=>s.id===id)||fail('missingStone')}
export const pending=game=>game.stones.find(s=>s.phase==='cracking'||s.phase==='revealed');
function apply(game,event){
 const s=stoneOf(game,event.id);if(game.status!=='active')fail('roundEnded');
 if(event.action==='guess'){
  if(s.phase!=='intact'||s.guess!==null)fail('guessFixed');
  if(!C.categories.some(c=>c.id===event.value))fail('chooseGuess');s.guess=event.value;
 }else if(event.action==='pay'){
  if(s.phase!=='intact'||pending(game))fail('pendingStone');if(!s.guess)fail('chooseGuess');if(game.coins<C.cost)fail('insufficient');
  game.coins-=C.cost;s.phase='cracking';
 }else if(event.action==='hit'){
  if(s.phase!=='cracking'||s.hits>=C.hits)fail('cannotStrike');s.hits++;
  if(s.hits===C.hits){s.phase='revealed';const correct=s.guess===typeOf(s.specimen.type).category,fresh=!game.first.includes(s.specimen.type);s.reward={base:C.baseReward,correct:correct?C.correctReward:0,fresh:fresh?C.newReward:0,total:C.baseReward+(correct?C.correctReward:0)+(fresh?C.newReward:0)};}
 }else if(event.action==='collect'){
  if(s.phase!=='revealed')fail('alreadyCollected');s.phase='opened';game.coins+=s.reward.total;game.opened++;if(s.reward.correct)game.correct++;if(!game.first.includes(s.specimen.type))game.first.push(s.specimen.type);
  game.status=game.opened===C.batchSize?'complete':game.coins<C.cost?'gameover':'active';
 }else fail('invalidEvent');
 return s;
}
export function act(game,action,id,value){const event={action,id,...(value===undefined?{}:{value})};const result=apply(game,event);game.events.push(Object.freeze(event));return result}
// Save a seed + valid event journal; replay also checks payment and reward integrity.
export function serialize(game){return JSON.stringify({version:C.version,generation:game.generation,seed:game.seed,batch:game.batch,events:game.events})}
export function restore(raw){const record=JSON.parse(raw);if(![2,C.version].includes(record?.version)||!Number.isInteger(record.seed)||record.seed<0||record.seed>4294967295||!Number.isInteger(record.batch)||record.batch<1||!Array.isArray(record.events)||record.events.length>C.batchSize*(C.hits+3))fail('badSave');if(record.version===3&&![2,3].includes(record.generation))fail('badSave');const game=create(record.seed,record.batch,record.version===2?2:record.generation);for(const event of record.events){if(!event||typeof event.id!=='string')fail('badSave');act(game,event.action,event.id,event.value)}return game}
export function summary(game){const opened=game.stones.filter(s=>s.phase==='opened'),rarest=opened.reduce((best,s)=>!best||typeOf(s.specimen.type).rarity>typeOf(best.specimen.type).rarity?s:best,null);return {opened:game.opened,correct:game.correct,rate:game.opened?Math.round(game.correct/game.opened*100):0,kinds:game.first.length,rarest:rarest?typeOf(rarest.specimen.type):null};}
