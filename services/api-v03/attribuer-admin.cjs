'use strict';
// Action manuelle locale: node attribuer-admin.cjs adresse@exemple.mg
const path=require('node:path');const {DatabaseSync}=require('node:sqlite');
const email=String(process.argv[2]||'').toLowerCase().trim();
if(!/^\S+@\S+\.\S+$/.test(email)){console.error('Usage: node attribuer-admin.cjs email_compte_existant');process.exit(2)}
const db=new DatabaseSync(path.join(__dirname,'data','tantsaha_v03.sqlite'));
const user=db.prepare('SELECT id,email,name,role FROM users WHERE email=?').get(email);
if(!user){console.error('Compte non trouve. Inscrivez ce compte localement avant attribution.');process.exit(1)}
console.log('COMPTE='+user.email+' ANCIEN_ROLE='+user.role);
const result=db.prepare("UPDATE users SET role='ADMIN' WHERE id=?").run(user.id);
if(!result.changes)process.exit(1);
db.prepare('INSERT INTO audit(user_id,action,created_at) VALUES (?,?,?)').run(user.id,'admin.promoted.local-cli',new Date().toISOString());
console.log('ROLE_ADMIN=ATTRIBUE. Deconnectez/reconnectez le compte dans le frontend.');
db.close();
