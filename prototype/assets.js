import C from './config.js';
const active=record=>Object.fromEntries(Object.entries(record||{}).filter(([,value])=>value!==null));
// One pairing supplies the table exterior and inspector halves. Never pick new art on reveal.
export function resolveAssets(specimen){const type=C.types.find(t=>t.id===specimen.type);return {...C.assets,...active(type?.art),...C.pairings[specimen.shell+':'+specimen.type],...C.pairings[specimen.shell+':'+specimen.type+':'+specimen.seed]};}
