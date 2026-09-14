import type { UserInfo } from '@waline/client';

export const WALINE_USER_KEY = 'WALINE_USER';
export type WalineSession = UserInfo & { remember?: boolean };

export function readWalineSession(): WalineSession | null {
 for(const storage of [sessionStorage,localStorage]) {
  try {
   const user=JSON.parse(storage.getItem(WALINE_USER_KEY)||'null');
   if(user && typeof user.token==='string' && user.token && user.objectId)return user;
  }catch{}
 }
 return null;
}

// Waline 3 uses a shared VueUse storage ref. Notify it even in the same tab,
// including session-only logins, without persisting those across browser sessions.
export function syncWalineSession() {
 const user=readWalineSession();
 window.dispatchEvent(new StorageEvent('storage',{
  key:WALINE_USER_KEY,newValue:JSON.stringify(user||{}),storageArea:localStorage,
 }));
}
export function saveWalineSession(user:WalineSession) {
 localStorage.removeItem(WALINE_USER_KEY);
 sessionStorage.removeItem(WALINE_USER_KEY);
 (user.remember?localStorage:sessionStorage).setItem(WALINE_USER_KEY,JSON.stringify(user));
 syncWalineSession();
}
export function clearWalineSession() {
 localStorage.removeItem(WALINE_USER_KEY);
 sessionStorage.removeItem(WALINE_USER_KEY);
 syncWalineSession();
}
export async function validateWalineSession(serverURL:string,token:string,signal?:AbortSignal):Promise<UserInfo> {
 const response=await fetch(`${serverURL}/api/token`,{headers:{Authorization:`Bearer ${token}`},signal:signal?AbortSignal.any([signal,AbortSignal.timeout(15000)]):AbortSignal.timeout(15000),cache:'no-store'});
 if(response.status>=500)throw new Error('Waline is temporarily unavailable.');
 const result=await response.json();
 if(!response.ok || result.errno || !result.data?.objectId)throw Object.assign(new Error('Your session has expired. Please log in again.'),{expired:true});
 return {...result.data,token};
}
