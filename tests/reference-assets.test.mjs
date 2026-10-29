import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import C from '../prototype/config.js';
import {referenceScale} from '../prototype/assets.js';
const root=new URL('../prototype/',import.meta.url);
function readGLB(path){const bytes=readFileSync(new URL(path,root));assert.equal(bytes.readUInt32LE(),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);const length=bytes.readUInt32LE(12);assert.equal(bytes.readUInt32LE(16),0x4e4f534a);const doc=JSON.parse(bytes.subarray(20,20+length).toString());assert.equal(bytes.readUInt32LE(24+length),0x004e4942);return{doc,bin:bytes.subarray(28+length)};}
const configured=C.types.filter(t=>t.art.modelStatus==='reference-study');
test('four independent reference-based assets are local, paired, and candidly labeled',()=>{
 assert.deepEqual(referenceScale({seed:1},{modelScale:2}),[2,2,2]);assert.deepEqual(referenceScale({seed:1487},{modelStatus:'reference-study'}),referenceScale({seed:1487},{modelStatus:'reference-study'}));assert.notDeepEqual(referenceScale({seed:1487},{modelStatus:'reference-study'}),referenceScale({seed:1488},{modelStatus:'reference-study'}));
 assert.deepEqual(configured.map(t=>t.id),['white-druse','deep-amethyst','banded-agate','botryoidal-chalcedony']);
 for(const type of configured){assert.deepEqual(type.art.openRotationY,[-2.62,2.62]);assert.equal(type.art.imageUrl,null);assert.ok(readFileSync(new URL(type.art.detailImage,root)).length>1000);const {doc}=readGLB(type.art.modelUrl);for(const name of ['Closed','Open_Left','Open_Right'])assert.equal(doc.nodes.filter(n=>n.name===name).length,1);assert.equal(doc.extras.status,'Original procedural reconstruction, not a scan');assert.equal(doc.textures.length,6);assert.ok(doc.materials.every(m=>m.pbrMetallicRoughness.metallicFactor===0));}
});
test('GLB buffers, embedded PNG textures, attributes, and triangle indices are valid',()=>{
 for(const type of configured){const {doc,bin}=readGLB(type.art.modelUrl);assert.ok(bin.length>=doc.buffers[0].byteLength);for(const view of doc.bufferViews)assert.ok(view.byteOffset+view.byteLength<=bin.length);
  for(const image of doc.images){const v=doc.bufferViews[image.bufferView];assert.deepEqual([...bin.subarray(v.byteOffset,v.byteOffset+8)],[137,80,78,71,13,10,26,10]);}
  for(const a of doc.accessors){const view=doc.bufferViews[a.bufferView],size={SCALAR:1,VEC2:2,VEC3:3}[a.type];assert.equal(view.byteLength,a.count*size*4);if(a.componentType===5126)for(let i=0;i<a.count*size;i++)assert.ok(Number.isFinite(bin.readFloatLE(view.byteOffset+i*4)));}
  for(const mesh of doc.meshes)for(const p of mesh.primitives){const count=doc.accessors[p.attributes.POSITION].count;assert.equal(doc.accessors[p.attributes.NORMAL].count,count);assert.equal(doc.accessors[p.attributes.TEXCOORD_0].count,count);if(p.indices!==undefined){const a=doc.accessors[p.indices],v=doc.bufferViews[a.bufferView];assert.equal(a.count%3,0);for(let i=0;i<a.count;i++)assert.ok(bin.readUInt32LE(v.byteOffset+i*4)<count);}else assert.equal(count%3,0);}
 }
});
test('closed and opened shell are the same surface, with a neutral closed model across types',()=>{
 let first;
 for(const type of configured){const {doc,bin}=readGLB(type.art.modelUrl),geometry=name=>{const n=doc.nodes.find(n=>n.name===name),p=doc.meshes[n.mesh].primitives[0],a=doc.accessors[p.attributes.POSITION],v=doc.bufferViews[a.bufferView];return bin.subarray(v.byteOffset,v.byteOffset+v.byteLength);};
  const front=geometry('Closed_front');assert.deepEqual(front,geometry('Outer_shell_0'));assert.deepEqual(front,geometry('Outer_shell_1'));if(first)assert.deepEqual(front,first);else first=front;
  // Right half is exactly a half turn from the matching front shell at closure.
  assert.deepEqual(doc.nodes.find(n=>n.name==='Open_Right').rotation,[0,1,0,0]);
  const c=doc.nodes.find(n=>n.name==='Open_Left');assert.equal(c.children.filter(i=>doc.nodes[i].name.startsWith('Crystals_')).length,5);
 }
});
