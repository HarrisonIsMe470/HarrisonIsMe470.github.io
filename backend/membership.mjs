import { DatabaseSync } from 'node:sqlite';
const [action,id]=process.argv.slice(2);
if(!['list','grant','revoke'].includes(action)||action!=='list'&&!id)throw new Error('Usage: node backend/membership.mjs list | grant USER_ID | revoke USER_ID');
const db=new DatabaseSync(process.env.DATABASE_PATH||'backend/journal.sqlite');
if(action==='list')console.table(db.prepare('SELECT users.id,email,name,members.user_id IS NOT NULL AS member FROM users LEFT JOIN members ON members.user_id=users.id').all());
if(action==='grant')db.prepare('INSERT OR IGNORE INTO members VALUES(?)').run(id);
if(action==='revoke')db.prepare('DELETE FROM members WHERE user_id=?').run(id);
db.close();
