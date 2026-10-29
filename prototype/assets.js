import C from './config.js';
const active=record=>Object.fromEntries(Object.entries(record||{}).filter(([,value])=>value!==null));
// One pairing supplies the table exterior and inspector halves. Never pick new art on reveal.
export function resolveAssets(specimen){const type=C.types.find(t=>t.id===specimen.type);return {...C.assets,...active(type?.art),...C.pairings[specimen.shell+':'+specimen.type],...C.pairings[specimen.shell+':'+specimen.type+':'+specimen.seed]};}

// Mild deterministic shape variation only for our reference studies; formal imports keep their scale.
export function referenceScale(specimen,assets){
 const scale=assets.modelScale||1;if(assets.modelStatus!=='reference-study')return [scale,scale,scale];
 let seed=specimen.seed>>>0;const next=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 return [scale*(.92+.16*next()),scale*(.90+.20*next()),scale*(.90+.20*next())];
}
