// Distinct mineral crystal geometry; shared by the generator and topology checks.
import {T,geo,TAU} from './mineral-mesh-lib.mjs';
function rhomb(){let g=new T.BoxGeometry(1,1,1).toNonIndexed();const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,x+y*.47+z*.16,y+.5,z+y*.22);}g.computeVertexNormals();return g;}
function dogtooth(){const p=[],uv=[],a=[];for(let i=0;i<6;i++){const th=i/6*TAU;a.push([Math.cos(th),i%2?.20:.36,Math.sin(th)]);}a.push([.10,1,-.04],[0,-.18,0]);for(let i=0;i<6;i++)for(const ids of [[i,(i+1)%6,6],[(i+1)%6,i,7]])for(const j of ids){p.push(...a[j]);uv.push(a[j][0]*.5+.5,a[j][1]);}return geo(p,uv);}
function tabular(){const loop=[[-.72,-.40],[.72,-.40],[1,-.24],[1,.24],[.72,.40],[-.72,.40],[-1,.24],[-1,-.24]],p=[],uv=[],v=[];for(const y of [0,1])for(const [x,z]of loop)v.push([x,y,z]);function tri(a,b,c){for(const i of [a,b,c]){p.push(...v[i]);uv.push(v[i][0]*.5+.5,v[i][1]);}}for(let i=0;i<8;i++){const j=(i+1)%8;tri(i,i+8,j);tri(j,i+8,j+8);}for(let i=1;i<7;i++){tri(8,9+i,8+i);tri(0,i,i+1);}return geo(p,uv);}

export {rhomb,dogtooth,tabular};
