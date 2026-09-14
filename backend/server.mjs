import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
const derive = promisify(scrypt);
const hash = value => createHash('sha256').update(value).digest('hex');
export function createApp({ database = process.env.DATABASE_PATH || 'backend/journal.sqlite', origin = process.env.SITE_ORIGIN || 'http://localhost:4321', sessionMs = 15 * 60 * 1000, secure = process.env.NODE_ENV === 'production' } = {}) {
 const db = new DatabaseSync(database);
 db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE,name TEXT,salt TEXT,password TEXT);
 CREATE TABLE IF NOT EXISTS members(user_id TEXT PRIMARY KEY REFERENCES users(id));
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),expires INTEGER);
 CREATE TABLE IF NOT EXISTS comments(id TEXT PRIMARY KEY,post TEXT,user_id TEXT REFERENCES users(id),parent TEXT REFERENCES comments(id),body TEXT,created TEXT,deleted INTEGER DEFAULT 0);
 CREATE TABLE IF NOT EXISTS reactions(post TEXT,user_id TEXT REFERENCES users(id),value INTEGER,PRIMARY KEY(post,user_id));
 CREATE TABLE IF NOT EXISTS stories(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),title TEXT,date TEXT,description TEXT,photos TEXT);`);
 const run = (sql,...args) => db.prepare(sql).run(...args);
 const get = (sql,...args) => db.prepare(sql).get(...args);
 const all = (sql,...args) => db.prepare(sql).all(...args);
 const fail = (status,message) => { throw Object.assign(new Error(message),{status}); };
 const str = (v,max,required=true) => { if(typeof v !== 'string' || v.length>max || (required && !v.trim())) fail(400,'Please check the required fields.'); return v.trim(); };
 const attempts = new Map();
 const server = createServer(async (req,res) => {
  res.setHeader('Cache-Control','no-store'); res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Vary','Origin');
  if(req.headers.origin === origin) { res.setHeader('Access-Control-Allow-Origin',origin); res.setHeader('Access-Control-Allow-Credentials','true'); }
  const send = (status,data) => { res.writeHead(status,{'Content-Type':'application/json'}); res.end(JSON.stringify(data)); };
  try {
   if(req.headers.origin && req.headers.origin !== origin) fail(403,'Origin not allowed.');
   if(req.method==='OPTIONS') { res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE'); res.setHeader('Access-Control-Allow-Headers','Content-Type'); return send(204,null); }
   const url = new URL(req.url,'http://api.local'), path=url.pathname, method=req.method;
   let body={};
   if(['POST','PATCH','DELETE'].includes(method)) {
    if(req.headers.origin !== origin || !req.headers['content-type']?.startsWith('application/json')) fail(403,'Invalid request origin or content type.');
    let raw=''; for await (const chunk of req) {raw+=chunk; if(Buffer.byteLength(raw)>9_000_000) fail(413,'Photos exceed the upload limit.');} 
    try {body=JSON.parse(raw || '{}');} catch {fail(400,'Invalid JSON.');}
   }
   const token=req.headers.cookie?.match(/(?:^|; )journal_session=([a-f0-9]+)/)?.[1];
   const session=token && get('SELECT users.id,users.name, sessions.expires FROM sessions JOIN users ON users.id=sessions.user_id WHERE token=?',hash(token));
   const user=session && session.expires>Date.now() ? session : null;
   const auth=()=>{if(!user) fail(401,token?'Session expired. Please log in again.':'Please log in to continue.'); return user;};
   if(path==='/auth/register' || path==='/auth/login') {
    if(method!=='POST') fail(405,'Method not allowed.');
    const key=req.socket.remoteAddress; const now=Date.now();
    for(const [k,v] of attempts) if(v.until<now) attempts.delete(k);
    const rate=attempts.get(key)||{count:0,until:now+600000}; attempts.set(key,rate); if(++rate.count>20) fail(429,'Too many attempts. Try again in ten minutes.');
    const email=str(body.email,254).toLowerCase(), password=str(body.password,128);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length<12) fail(400,'Use a valid email and a password of at least 12 characters.');
    if(path.endsWith('register')) {
     const salt=randomBytes(16).toString('hex'), digest=(await derive(password,salt,64)).toString('hex');
     try {run('INSERT INTO users VALUES(?,?,?,?,?)',randomUUID(),email,str(body.name,80),salt,digest);} catch(e) {if(e.code?.includes('SQLITE')) fail(409,'Unable to register with this email.'); throw e;}
     return send(201,{message:'Account created. Please log in.'});
    }
    const row=get('SELECT * FROM users WHERE email=?',email);
    const digest=await derive(password,row?.salt||'missing-user-salt',64);
    if(!row || !timingSafeEqual(Buffer.from(row.password,'hex'),digest)) fail(401,'Email or password is incorrect.');
    const fresh=randomBytes(32).toString('hex'); run('DELETE FROM sessions WHERE expires<?',Date.now());
    if(token) run('DELETE FROM sessions WHERE token=?',hash(token));
    run('INSERT INTO sessions VALUES(?,?,?)',hash(fresh),row.id,Date.now()+sessionMs);
    res.setHeader('Set-Cookie',`journal_session=${fresh}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(sessionMs/1000)}${secure?'; Secure':''}`);
    return send(200,{id:row.id,name:row.name,expires:Date.now()+sessionMs});
   }
   if(path==='/auth/logout' && method==='POST') {if(token) run('DELETE FROM sessions WHERE token=?',hash(token)); res.setHeader('Set-Cookie',`journal_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure?'; Secure':''}`); return send(200,{});}
   if(path==='/auth/me' && method==='GET') return send(200,auth());
   if(path==='/comments' && method==='GET') return send(200,all('SELECT c.*,u.name FROM comments c JOIN users u ON u.id=c.user_id WHERE post=? ORDER BY created,id',str(url.searchParams.get('post'),500)));
   if(path==='/comments' && method==='POST') {
    auth(); const post=str(body.post,500), parent=body.parent || null;
    if(parent && !get('SELECT id FROM comments WHERE id=? AND post=?',str(parent,100),post)) fail(400,'Reply must belong to this post.');
    const id=randomUUID(); run('INSERT INTO comments(id,post,user_id,parent,body,created) VALUES(?,?,?,?,?,?)',id,post,user.id,parent,str(body.body,5000),new Date().toISOString()); return send(201,{id});
   }
   if(path.startsWith('/comments/') && ['PATCH','DELETE'].includes(method)) {
    auth(); const id=path.split('/')[2], row=get('SELECT * FROM comments WHERE id=?',id);
    if(!row) fail(404,'Comment not found.'); if(row.user_id!==user.id) fail(403,'You can only change your own comments.');
    if(method==='DELETE') run("UPDATE comments SET body='',deleted=1 WHERE id=?",id);
    else {if(row.deleted) fail(410,'Comment was deleted.');run('UPDATE comments SET body=? WHERE id=?',str(body.body,5000),id);} return send(200,{});
   }
   if(path==='/reactions') {
    const post=str(method==='GET'?url.searchParams.get('post'):body.post,500);
    if(method==='POST') {auth(); if(![-1,0,1].includes(body.value)) fail(400,'Invalid reaction.');run('INSERT INTO reactions VALUES(?,?,?) ON CONFLICT(post,user_id) DO UPDATE SET value=excluded.value',post,user.id,body.value);}
    else if(method!=='GET') fail(405,'Method not allowed.');
    return send(200,{likes:get('SELECT COUNT(*) n FROM reactions WHERE post=? AND value=1',post).n,dislikes:get('SELECT COUNT(*) n FROM reactions WHERE post=? AND value=-1',post).n,mine:user?get('SELECT value FROM reactions WHERE post=? AND user_id=?',post,user.id)?.value||0:0});
   }
   if(path==='/stories' || path.startsWith('/stories/')) {
    if(method==='GET' && path==='/stories') return send(200,all('SELECT id,title,date,description,photos FROM stories ORDER BY date,id').map(s=>({...s,photos:JSON.parse(s.photos)})));
    if(['POST','PATCH'].includes(method)) {
     const title=str(body.title,160), date=str(body.date,40), description=str(body.description||'',10000,false), photos=body.photos||[];
     if(!/^\d{4}-\d\d-\d\dT.*Z$/.test(date)||!Number.isFinite(Date.parse(date))) fail(400,'A valid date and time are required.');
     if(!Array.isArray(photos)||photos.length>4||photos.some(p=>typeof p!=='string'||p.length>2_000_000||!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(p))) fail(400,'Choose up to four JPEG, PNG or WebP photos, each under 1.5 MB.');
     if(method==='POST' && path==='/stories') {const id=randomUUID();run('INSERT INTO stories VALUES(?,?,?,?,?,?)',id,null,title,new Date(date).toISOString(),description,JSON.stringify(photos));return send(201,{id});}
     if(method==='PATCH') {const result=run('UPDATE stories SET title=?,date=?,description=?,photos=? WHERE id=?',title,new Date(date).toISOString(),description,JSON.stringify(photos),path.split('/')[2]);if(!result.changes) fail(404,'Story not found.');return send(200,{});}
    }
    fail(405,'Method not allowed.');
   }
   fail(404,'Not found.');
  } catch(e) {send(e.status||500,{message:e.status?e.message:'Something went wrong. Please try again.'});}
 });
 return {server,db};
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
 const {server}=createApp(); server.listen(Number(process.env.PORT||8787),'127.0.0.1',()=>console.log('Journal API listening on http://127.0.0.1:'+ (process.env.PORT||8787)));
}
