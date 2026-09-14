import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../backend/server.mjs';
import { createUnlock } from '../src/lib/unlock.mjs';
test('discovery requires sequence and code, resets on error and timeout',()=>{
 let now=0; const lock=createUnlock(()=>now);
 assert.equal(lock.submit('20260824'),false);lock.activate(1);assert.equal(lock.activate(2),false);
 lock.activate(0);assert.equal(lock.activate(1),true);assert.equal(lock.submit('wrong'),false);assert.equal(lock.submit('20260824'),false);
 lock.activate(0);lock.activate(1);now=16000;assert.equal(lock.submit('20260824'),false);
 lock.activate(0);lock.activate(1);assert.equal(lock.submit('20260824'),true);
 lock.activate(0);lock.activate(-1);assert.equal(lock.activate(1),false);
 lock.activate(0);lock.activate(0);assert.equal(lock.activate(1),false);
 lock.activate(0);lock.reset();assert.equal(lock.activate(1),false);
});
test('accounts, ownership, threads, reactions, public stories, expiry and logout',async()=>{
 const origin='http://localhost:4321';const {server,db}=createApp({database:':memory:',origin});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 const request=async(path,method='GET',body,cookie)=>{const r=await fetch(base+path,{method,headers:{Origin:origin,...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 try{
 assert.equal((await request('/stories')).status,200);
 for(const name of ['alice','bob'])assert.equal((await request('/auth/register','POST',{name,email:name+'@example.com',password:'a-long-test-password'})).status,201);
 const a=await request('/auth/login','POST',{email:'alice@example.com',password:'a-long-test-password'}),b=await request('/auth/login','POST',{email:'bob@example.com',password:'a-long-test-password'});
 assert.equal(a.status,200);assert.equal((await request('/stories','GET',null,a.cookie)).status,200);
 assert.equal((await request('/comments','POST',{post:'/blog/a/',body:'anonymous'})).status,401);
 const c=await request('/comments','POST',{post:'/blog/a/',body:'hello'},a.cookie);
 assert.equal((await request('/comments/'+c.data.id,'PATCH',{body:'stolen'},b.cookie)).status,403);
 assert.equal((await request('/comments/'+c.data.id,'DELETE',{},b.cookie)).status,403);
 assert.equal((await request('/comments/'+c.data.id,'PATCH',{body:'edited'},a.cookie)).status,200);
 assert.equal((await request('/comments','POST',{post:'/blog/b/',parent:c.data.id,body:'wrong post'},b.cookie)).status,400);
 const reply=await request('/comments','POST',{post:'/blog/a/',parent:c.data.id,body:'reply'},b.cookie);assert.equal(reply.status,201);
 assert.equal((await request('/comments/'+c.data.id,'DELETE',{},a.cookie)).status,200);
 const comments=await request('/comments?post=/blog/a/');assert.equal(comments.data.length,2);assert.equal(comments.data[0].deleted,1);
 await request('/reactions','POST',{post:'/blog/a/',value:1},a.cookie);const reaction=await request('/reactions','POST',{post:'/blog/a/',value:-1},a.cookie);assert.equal(reaction.data.likes,0);assert.equal(reaction.data.dislikes,1);
 const story={title:'Our memory',date:'2026-08-24T09:00:00.000Z',description:'Public',photos:[]};
 const saved=await request('/stories','POST',story);assert.equal(saved.status,201);
 assert.equal((await request('/stories/'+saved.data.id,'PATCH',{...story,title:'Updated'})).status,200);
 assert.equal((await request('/stories')).data[0].title,'Updated');
 assert.equal((await request('/stories','POST',story,b.cookie)).status,201);
 assert.equal((await request('/stories/'+saved.data.id,'PATCH',story,b.cookie)).status,200);
 assert.equal((await request('/stories','POST',{...story,photos:['data:image/svg+xml;base64,AAAA']},a.cookie)).status,400);
 const hostile=await fetch(base+'/auth/logout',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json',Cookie:a.cookie},body:'{}'});assert.equal(hostile.status,403);
 db.prepare('UPDATE sessions SET expires=0 WHERE user_id=?').run(a.data.id);
 assert.equal((await request('/stories','GET',null,a.cookie)).status,200);assert.equal((await request('/stories','POST',story,a.cookie)).status,201);
 assert.equal((await request('/comments','POST',{post:'/blog/a/',body:'expired'},a.cookie)).status,401);
 await request('/auth/logout','POST',{},b.cookie);assert.equal((await request('/auth/me','GET',null,b.cookie)).status,401);
 }finally{await new Promise(r=>server.close(r));db.close();}
});
