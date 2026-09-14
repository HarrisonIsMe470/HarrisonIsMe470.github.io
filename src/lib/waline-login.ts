import type { UserInfo } from '@waline/client';

// Waline admin reads the URL token before its remembered TOKEN. A non-JWT
// marker deliberately yields an anonymous /api/token response, showing the
// credential form. This is a compatibility adapter, not a Waline logout API.
// Verified against the deployed @waline/vercel 1.41.6 and current admin UI.
export const FRESH_LOGIN_TOKEN = 'waline-login-required';

export function walineAuthURL(serverURL:string, page:'login'|'register'|'forgot'='login') {
 const url=new URL(`${serverURL.replace(/\/$/,'')}/ui/${page}`);
 url.searchParams.set('lng','en');
 url.searchParams.set('token',FRESH_LOGIN_TOKEN);
 return url;
}

export function startWalineLogin(serverURL:string, page:'login'|'register'|'forgot'='login') {
 const url=walineAuthURL(serverURL,page);
 const popup=window.open(url.href,'_blank','popup,width=1024,height=650,scrollbars=yes,resizable=yes');
 let cancel:()=>void=()=>{};
 const result=new Promise<UserInfo & {remember:boolean}>((resolve,reject)=>{
  if(!popup){reject(new Error('Allow pop-ups for this site, then try logging in again.'));return;}
  let done=false;
  const finish=(error?:Error,user?:UserInfo & {remember:boolean})=>{
   if(done)return;done=true;window.removeEventListener('message',receive);clearInterval(poll);clearTimeout(timeout);
   popup.close();window.focus();if(error)reject(error);else resolve(user!);
  };
  const receive=(event:MessageEvent)=>{
   if(event.origin!==url.origin || event.source!==popup)return;
   const data=event.data?.data;
   if(event.data?.type!=='userInfo' || typeof data?.token!=='string' || !data.token || !data.objectId)return;
   finish(undefined,data);
  };
  const poll=setInterval(()=>{if(popup.closed)finish(new Error('Account window closed. You’re back on the website.'));},500);
  const timeout=setTimeout(()=>finish(new Error('Account window timed out. Please try again.')),page==='login'?120000:900000);
  window.addEventListener('message',receive);
  cancel=()=>finish(new Error('Login cancelled.'));
 });
 return {result,cancel};
}
