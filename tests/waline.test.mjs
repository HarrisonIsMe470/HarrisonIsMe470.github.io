import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';

test('Waline mounts once per article and releases the old discussion on navigation',()=>{
 const source=readFileSync(new URL('../src/components/Comments.astro',import.meta.url),'utf8');
 const script=source.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*;$/gm,'');
 const listeners=new Map(),calls=[];let destroyed=0;
 let container={dataset:{server:'https://waline-for-astro.vercel.app',path:'/blog/first/'},addEventListener(){}};
 const status={},share={};
 const document={
  querySelector(selector){return selector==='[data-waline]'?container:selector==='[data-waline-status]'?status:share;},
  addEventListener(event,handler){listeners.set(event,handler);},
 };
 runInNewContext(stripTypeScriptTypes(script),{document,syncWalineSession(){},init(options){calls.push(options);return {el:options.el,destroy(){destroyed++;}};},encodeURIComponent});
 assert.equal(calls.length,1);assert.equal(calls[0].path,'/blog/first/');
 assert.equal(calls[0].login,'force');assert.equal(calls[0].dark,'html:not(.light-mode)');
 listeners.get('astro:page-load')();assert.equal(calls.length,1);
 listeners.get('astro:before-swap')();assert.equal(destroyed,1);
 container={dataset:{server:'https://waline-for-astro.vercel.app',path:'/blog/second/'},addEventListener(){}};
 listeners.get('astro:page-load')();assert.equal(calls.length,2);assert.equal(calls[1].path,'/blog/second/');
 listeners.get('astro:before-swap')();container=null;listeners.get('astro:page-load')();
 assert.equal(destroyed,2);assert.equal(calls.length,2);
});
