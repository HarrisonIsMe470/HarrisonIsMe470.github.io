import { isTimeMachineDiscovered } from '../lib/discovery-session';
const endpoint = import.meta.env.PUBLIC_API_URL?.replace(/\/$/, '');
async function api(path:string, method='GET', body?:unknown) {
 if(!endpoint) throw new Error(path.startsWith('/stories')?'Memories are not connected yet. Please check back soon.':'Accounts are not connected yet. Please check back soon.');
 const response=await fetch(endpoint+path,{method,credentials:'include',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
 const data=await response.json();if(!response.ok)throw Object.assign(new Error(data.message),{status:response.status});return data;
}
function element(tag:string,text='',className=''){const el=document.createElement(tag);el.textContent=text;el.className=className;return el;}
function setup(){
 document.querySelectorAll<HTMLElement>('[data-secret-link]').forEach(el=>{el.hidden=!isTimeMachineDiscovered();});
 const root=document.querySelector<HTMLElement>('[data-machine]');if(!root||root.dataset.ready)return;root.dataset.ready='true';
 const q=<T extends HTMLElement=HTMLElement>(s:string)=>root.querySelector<T>(s)!;
 const status=q('[data-status]');
 const report=(e:any)=>{status.textContent=e.message||String(e);};
 const task=(fn:()=>Promise<void>)=>fn().catch(report);
 if(root.matches('[data-machine]')){
  if(!isTimeMachineDiscovered()){root.hidden=true;location.replace('/about/');return;}
  let stories:any[]=[],editing:any=null;const form=q<HTMLFormElement>('[data-story]');
  const draw=()=>{const target=q('[data-timeline]');target.replaceChildren();const year=q<HTMLSelectElement>('[data-year]').value;let list=stories.filter(s=>!year||String(new Date(s.date).getFullYear())===year);if(q<HTMLSelectElement>('[data-order]').value==='newest')list=[...list].reverse();if(!list.length)target.append(element('p','No memories yet. Save a moment to begin.'));
   for(const story of list){const card=element('article','','memory-card'),details=document.createElement('details'),summary=document.createElement('summary');summary.append(element('time',new Date(story.date).toLocaleString()),element('h2',story.title));details.append(summary,element('p',story.description));for(const photo of story.photos){const img=document.createElement('img');img.src=photo;img.alt=`Photo from ${story.title}`;img.loading='lazy';details.append(img);}const edit=element('button','Edit memory');edit.onclick=()=>{editing=story;form.hidden=false;q('[data-editor-title]').textContent='Edit memory';q<HTMLInputElement>('[name=title]').value=story.title;const d=new Date(story.date);q<HTMLInputElement>('[name=date]').value=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);q<HTMLTextAreaElement>('[name=description]').value=story.description;form.scrollIntoView({behavior:'smooth'});};details.append(edit);card.append(details);target.append(card);}
  };
  const load=async()=>{stories=await api('/stories');q('[data-memories]').hidden=false;status.textContent='Welcome back. All dates are shown in your local time.';const select=q<HTMLSelectElement>('[data-year]'),previous=select.value;select.replaceChildren(new Option('All years',''));[...new Set(stories.map(s=>String(new Date(s.date).getFullYear())))].forEach(y=>select.add(new Option(y,y)));select.value=previous;draw();};
  task(load);
  document.addEventListener('astro:before-swap',()=>{stories=[];editing=null;q('[data-timeline]').replaceChildren();form.reset();},{once:true});
  q('[data-new]').onclick=()=>{editing=null;form.reset();form.hidden=false;q('[data-editor-title]').textContent='New memory';q('[name=title]').focus();};q('[data-cancel-story]').onclick=()=>{form.hidden=true;form.reset();editing=null;};q('[data-order]').onchange=draw;q('[data-year]').onchange=draw;
  form.onsubmit=e=>{e.preventDefault();task(async()=>{const button=form.querySelector('button')!;button.disabled=true;try{const fields=new FormData(form),files=(fields.getAll('photos') as File[]).filter(f=>f.size);if(files.length>4||files.some(f=>f.size>1500000))throw new Error('Choose up to four photos, each under 1.5 MB.');const photos=files.length?await Promise.all(files.map(f=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(f);}))) : fields.get('clearPhotos')?[]:editing?.photos||[];await api(editing?'/stories/'+editing.id:'/stories',editing?'PATCH':'POST',{title:fields.get('title'),date:new Date(String(fields.get('date'))).toISOString(),description:fields.get('description'),photos});form.hidden=true;form.reset();editing=null;await load();}finally{button.disabled=false;}});};
 }
}setup();document.addEventListener('astro:page-load',setup);
