import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
function harness(blocked=false,page='login'){
 const listeners=new Map(),timers=new Map();let url;
 const popup={closed:false,close(){this.closed=true;}};
 const window={focus(){},open(value){url=new URL(value);return blocked?null:popup;},addEventListener(k,v){listeners.set(k,v);},removeEventListener(k){listeners.delete(k);}};
 const context={window,URL,setInterval:f=>{timers.set('poll',f);return 'poll';},setTimeout:f=>{timers.set('timeout',f);return 'timeout';},clearInterval:k=>timers.delete(k),clearTimeout:k=>timers.delete(k)};
 const code=stripTypeScriptTypes(readFileSync(new URL('../src/lib/waline-login.ts',import.meta.url),'utf8')).replaceAll('export ','');
 runInNewContext(code,context);
 const flow=context.startWalineLogin('https://waline-for-astro.vercel.app',page);
 return {flow,popup,listeners,timers,url,authURL:context.walineAuthURL};
}
test('fresh login overrides a remembered Waline token and validates message origin and window',async()=>{
 const h=harness();assert.equal(h.url.pathname,'/ui/login');assert.equal(h.url.searchParams.get('token'),'waline-login-required');
 // Waline admin selects the URL token ahead of sessionStorage/localStorage TOKEN.
 const rememberedToken='previous-account-token';const effectiveToken=h.url.searchParams.get('token')??rememberedToken;
 assert.notEqual(effectiveToken,rememberedToken);
 const receive=h.listeners.get('message'),data={type:'userInfo',data:{token:'new-account-token',objectId:2,remember:false}};
 receive({origin:'https://evil.example',source:h.popup,data});assert.equal(h.popup.closed,false);
 receive({origin:h.url.origin,source:{},data});assert.equal(h.popup.closed,false);
 receive({origin:h.url.origin,source:h.popup,data});assert.equal((await h.flow.result).objectId,2);
 assert.equal(h.listeners.size,0);assert.equal(h.timers.size,0);assert.equal(h.popup.closed,true);
});
test('blocked, closed, timed out and cancelled logins finish cleanly',async()=>{
 const blocked=harness(true);await assert.rejects(blocked.flow.result,/Allow pop-ups/);
 for(const mode of ['closed','timeout','cancel']){
  const h=harness();const rejected=assert.rejects(h.flow.result,/closed|timed out|cancelled/);
  if(mode==='closed'){h.popup.closed=true;h.timers.get('poll')();}
  else if(mode==='timeout')h.timers.get('timeout')();
  else h.flow.cancel();
  await rejected;assert.equal(h.listeners.size,0);assert.equal(h.timers.size,0);
 }
});

test('registration and recovery override remembered accounts just like login',async()=>{
 const h=harness();
 for(const page of ['register','forgot']){
  const url=h.authURL('https://waline-for-astro.vercel.app/',page);
  assert.equal(url.pathname,`/ui/${page}`);
  assert.equal(url.searchParams.get('token'),'waline-login-required');
 }
 const page=readFileSync(new URL('../src/pages/account.astro',import.meta.url),'utf8');
 assert.ok(page.includes("walineAuthURL(walineURL, 'register').href"));
 assert.ok(!page.includes('href={`${walineURL}/ui/register`}'));
 const rejected=assert.rejects(h.flow.result,/cancelled/);h.flow.cancel();await rejected;
});

test('registration and recovery preserve the website and accept login from the opened window',async()=>{
 for(const page of ['register','forgot']){
  const h=harness(false,page);assert.equal(h.url.pathname,`/ui/${page}`);
  h.listeners.get('message')({origin:h.url.origin,source:h.popup,data:{type:'userInfo',data:{token:'new-account-token',objectId:3,remember:false}}});
  assert.equal((await h.flow.result).objectId,3);assert.equal(h.popup.closed,true);
 }
 const page=readFileSync(new URL('../src/pages/account.astro',import.meta.url),'utf8');
 assert.ok(page.includes('data-account-register target="_blank"'));
 assert.ok(page.includes('data-account-forgot target="_blank"'));
 assert.ok(page.includes('data-account-return'));
});
