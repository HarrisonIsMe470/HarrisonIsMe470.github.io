import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};};
function setup(fetch){
 const localStorage=storage(),sessionStorage=storage(),events=[];
 const script=stripTypeScriptTypes(readFileSync(new URL('../src/lib/waline-session.ts',import.meta.url),'utf8')).replaceAll('export ','');
 const context={localStorage,sessionStorage,AbortSignal,fetch,window:{dispatchEvent:e=>events.push(e)},StorageEvent:class{constructor(type,init){Object.assign(this,{type},init);}}};
 runInNewContext(script,context);return {...context,events};
}
test('account and comments share remember/session-only state, and logout clears both',()=>{
 const s=setup(),user={objectId:1,token:'test-token',display_name:'Reader'};
 s.saveWalineSession({...user,remember:true});assert.ok(s.localStorage.getItem('WALINE_USER'));
 s.saveWalineSession({...user,remember:false});assert.equal(s.localStorage.getItem('WALINE_USER'),null);assert.ok(s.sessionStorage.getItem('WALINE_USER'));
 assert.equal(s.readWalineSession().display_name,'Reader');assert.equal(JSON.parse(s.events.at(-1).newValue).token,'test-token');
 s.clearWalineSession();assert.equal(s.readWalineSession(),null);assert.equal(s.events.at(-1).newValue,'{}');
 s.localStorage.setItem('WALINE_USER','broken');assert.equal(s.readWalineSession(),null);
});
test('Waline token is verified, expiry is distinct from a server outage',async()=>{
 const valid=setup(async(url,options)=>{assert.equal(url,'https://example.test/api/token');assert.equal(options.headers.Authorization,'Bearer test-token');return {ok:true,status:200,json:async()=>({errno:0,data:{objectId:1,display_name:'Reader'}})};});
 assert.equal((await valid.validateWalineSession('https://example.test','test-token')).display_name,'Reader');
 const expired=setup(async()=>({ok:true,status:200,json:async()=>({errno:0,data:{}})}));
 await assert.rejects(expired.validateWalineSession('https://example.test','old'),e=>e.expired===true);
 const outage=setup(async()=>({ok:false,status:503}));
 await assert.rejects(outage.validateWalineSession('https://example.test','test-token'),e=>!e.expired);
});
