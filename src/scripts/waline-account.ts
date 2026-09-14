import { startWalineLogin } from '../lib/waline-login';
import { readWalineSession,saveWalineSession,clearWalineSession,validateWalineSession } from '../lib/waline-session';

function setup(){
 const root=document.querySelector<HTMLElement>('[data-waline-account]');
 if(!root || root.dataset.ready)return;
 root.dataset.ready='true';
 const serverURL=root.dataset.server!;
 const q=<T extends HTMLElement=HTMLElement>(s:string)=>root.querySelector<T>(s)!;
 const status=q('[data-account-status]'),button=q<HTMLButtonElement>('[data-account-login]');
 let generation=0,disposed=false;let cancelPending=()=>{};
 const controller=new AbortController();
 const render=()=>{
  const user=readWalineSession();
  q('[data-account-guest]').hidden=!!user;q('[data-account-member]').hidden=!user;
  if(user){
   const name=user.display_name||'Journal reader';
   q('[data-account-name]').textContent=name;
   q('[data-avatar-fallback]').textContent=name.slice(0,1).toUpperCase();
   const image=q<HTMLImageElement>('[data-account-avatar]');
   image.hidden=true;image.removeAttribute('src');
   if(user.avatar){try{const url=new URL(user.avatar,serverURL);if(url.protocol==='https:'){image.src=url.href;image.onload=()=>image.hidden=false;image.onerror=()=>image.hidden=true;}}catch{}}
  }
 };
 render();
 const restore=async()=>{
  const attempt=generation;
  const url=new URL(location.href),callbackToken=url.searchParams.get('token');
  if(callbackToken){url.searchParams.delete('token');history.replaceState(history.state,'',url.pathname+url.search+url.hash);}
  const user=readWalineSession(),token=callbackToken||user?.token;
  if(!token)return;
  try {
   status.textContent='Checking your session…';
   const verified=await validateWalineSession(serverURL,token,controller.signal);
   if(disposed||attempt!==generation)return;
   saveWalineSession({...verified,remember:callbackToken?false:user?.remember});render();status.textContent='You’re ready to join the conversation.';
  }catch(error:any){if(disposed||attempt!==generation)return;if(error.expired){clearWalineSession();render();}status.textContent=error.expired?error.message:'Could not check your session. Please try again.';}
 };
 void restore();
 const openAccount=async(page:'login'|'register'|'forgot')=>{
  cancelPending();const attempt=++generation;button.disabled=true;status.textContent=page==='register'?'Create your account in the new window, then log in there to return automatically.':page==='forgot'?'Reset your password in the new window. Log in there when you’re ready, or close it to return.':'Log in in the new window. You’ll return here automatically.';
  q('[data-account-window]').hidden=false;
  const pending=startWalineLogin(serverURL,page);cancelPending=pending.cancel;
  try {
   const result=await pending.result;
   if(disposed||attempt!==generation)return;
   const verified=await validateWalineSession(serverURL,result.token,controller.signal);
   if(disposed||attempt!==generation)return;
   saveWalineSession({...verified,remember:result.remember});render();status.textContent='Welcome back. You’re now logged in.';
  }catch(error:any){if(!disposed&&attempt===generation)status.textContent=error.message||'Login could not be completed. Please try again.';}
  finally{if(!disposed&&attempt===generation){cancelPending=()=>{};button.disabled=false;q('[data-account-window]').hidden=true;}}
 };
 button.onclick=()=>void openAccount('login');
 for(const page of ['register','forgot'] as const){
  q(`[data-account-${page}]`).onclick=event=>{event.preventDefault();void openAccount(page);};
 }
 q('[data-account-return]').onclick=()=>{generation++;cancelPending();cancelPending=()=>{};button.disabled=false;q('[data-account-window]').hidden=true;status.textContent='You’re back on the website.';button.focus();};
 q('[data-account-logout]').onclick=()=>{generation++;cancelPending();clearWalineSession();render();button.disabled=false;status.textContent='You’ve logged out. Your next login will ask for your credentials.';};
 const onStorage=(event:StorageEvent)=>{if(event.key==='WALINE_USER'||event.key===null)render();};
 window.addEventListener('storage',onStorage);
 document.addEventListener('astro:before-swap',()=>{disposed=true;generation++;cancelPending();controller.abort();window.removeEventListener('storage',onStorage);},{once:true});
}
setup();document.addEventListener('astro:page-load',setup);
