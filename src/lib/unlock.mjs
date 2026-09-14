export function createUnlock(now = Date.now) {
 let step=0, deadline=0;
 const reset=()=>{step=0;deadline=0;};
 return {reset, activate(index){if(deadline && now()>deadline) reset();if(index!==step){reset();return false;} step++;deadline=now()+15000;return step===2;}, submit(code){const ok=step===2 && now()<=deadline && code==='20260824';reset();return ok;}};
}
