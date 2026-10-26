'use strict';
// Node >=24, zero npm dependencies. Access control and API starter for V03.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');
const HOST='127.0.0.1';
const PORT=Number(process.env.TM_API_PORT||4304);
const ROOT=__dirname;
const DATA=path.join(ROOT,'data');fs.mkdirSync(DATA,{recursive:true});
const db=new DatabaseSync(path.join(DATA,'tantsaha_v03.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,role TEXT NOT NULL,pass_hash TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL,expires_at INTEGER NOT NULL,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS inquiries(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL,message TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'nouveau',created_at TEXT NOT NULL,FOREIGN KEY(user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,user_id INTEGER,action TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_sessions_exp ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_user ON inquiries(user_id);`);
const ROLES=['PRODUCTEUR','POINT_FOCAL','DISTRIBUTEUR','CONSOMMATEUR'];
const PRODUCTS=[
 {id:'PRD-001',name:'Sauce tomate artisanale',unit:'Bouteille 50 cl',status:'sur demande'},
 {id:'PRD-002',name:'Purée de tomates',unit:'Bocal 350 g',status:'sur demande'},
 {id:'PRD-003',name:'Coulis au basilic',unit:'Bouteille 50 cl',status:'sur demande'},
 {id:'PRD-004',name:'Double concentré',unit:'Boîte 210 g',status:'sur demande'},
 {id:'PRD-005',name:'Ketchup épicé',unit:'Bouteille 45 cl',status:'sur demande'},
 {id:'PRD-006',name:'Tomates séchées',unit:'Sachet 200 g',status:'sur demande'},
 {id:'PRD-007',name:'Confiture de tomates',unit:'Bocal 250 g',status:'sur demande'},
 {id:'PRD-008',name:'Chutney de tomates',unit:'Bocal 250 g',status:'sur demande'},
];
const baseHeaders={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'"};
function respond(res,code,obj){res.writeHead(code,baseHeaders);res.end(JSON.stringify(obj));}
function readBody(req){return new Promise((resolve,reject)=>{let b='';req.on('data',c=>{b+=c;if(b.length>20000){reject(Error('Payload trop volumineux'));req.destroy();}});req.on('end',()=>{try{resolve(b?JSON.parse(b):{});}catch{reject(Error('JSON invalide'));}});req.on('error',reject);});}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){const hash=crypto.scryptSync(password,salt,64).toString('hex');return salt+':'+hash;}
function passOK(input,stored){const [salt,expected]=stored.split(':');if(!salt||!expected)return false;const actual=Buffer.from(hashPassword(input,salt).split(':')[1],'hex'),target=Buffer.from(expected,'hex');return actual.length===target.length&&crypto.timingSafeEqual(actual,target);}
function sessionFor(req){const h=req.headers.authorization||'';const match=/^Bearer ([a-f0-9]{64})$/.exec(h);if(!match)return null;const digest=crypto.createHash('sha256').update(match[1]).digest('hex');const user=db.prepare('SELECT u.id,u.email,u.name,u.role,s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?').get(digest);if(!user||user.expires_at<Date.now())return null;return user;}
function audit(uid,action){db.prepare('INSERT INTO audit(user_id,action,created_at) VALUES (?,?,?)').run(uid,action,new Date().toISOString());}
function rateLimited(ip){const now=Date.now();const old=attempts.get(ip)||[];const active=old.filter(n=>now-n<60000);active.push(now);attempts.set(ip,active);return active.length>20;}
const attempts=new Map();
const products08j=require('./product-routes.cjs').setup(db);
const publicConfig08k=require('./public-config.cjs').setup(db);
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://'+HOST+':'+PORT),p=url.pathname,method=req.method;
  /* V03 CORS 08C */
  const origin=req.headers.origin;
  const allowedOrigins=['http://127.0.0.1:4304','http://localhost:4304','http://127.0.0.1:5174','http://localhost:5174','http://127.0.0.1:4174','http://localhost:4174'];
  if(origin&&allowedOrigins.includes(origin)){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');}
  if(method==='OPTIONS'){if(!origin||!allowedOrigins.includes(origin)){return respond(res,403,{error:'Origine non autorisée'});}res.writeHead(204);res.end();return;}
  // V03_CORS_08K_SAFE
  const origins08k=["http://127.0.0.1:5174","http://127.0.0.1:4174","http://localhost:5174","http://localhost:4174","http://127.0.0.1:4304","http://localhost:4304"];
  if(req.headers.origin && !origins08k.includes(req.headers.origin))return respond(res,403,{error:'Origine non autorisée'});
  if(req.headers.origin){res.setHeader('Access-Control-Allow-Origin',req.headers.origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');}
  if(method==='OPTIONS'){res.writeHead(204);return res.end();}
  if((p==='/api/register'||p==='/api/login')&&rateLimited(req.socket.remoteAddress||'local'))return respond(res,429,{error:'Trop de tentatives; réessayez dans une minute.'});
  if(p==='/api/health'&&method==='GET')return respond(res,200,{status:'ok',service:'Tantsaha Miombona V03 API',version:'08A-08B',database:'sqlite'});
  if(p==='/api/products'&&method==='GET')return respond(res,200,{products:PRODUCTS,availability:'À confirmer auprès de l’établissement',prices:'Non contractuels'});
  if(p==='/'&&method==='GET'){const html=fs.readFileSync(path.join(ROOT,'portal.html'));res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'"});return res.end(html);}
  if(p==='/portal.js'&&method==='GET'){res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});return res.end(fs.readFileSync(path.join(ROOT,'portal.js')));}
  if(p==='/api/register'&&method==='POST'){
   const d=await readBody(req),email=String(d.email||'').trim().toLowerCase(),name=String(d.name||'').trim(),password=String(d.password||''),role=String(d.role||'');
   if(!/^\S+@\S+\.\S+$/.test(email)||name.length<2||name.length>120||password.length<12||password.length>128||!ROLES.includes(role))return respond(res,400,{error:'Saisie invalide: e-mail, nom, profil et mot de passe (12 caractères minimum).'});
   try{const result=db.prepare('INSERT INTO users(email,name,role,pass_hash,created_at) VALUES (?,?,?,?,?)').run(email,name,role,hashPassword(password),new Date().toISOString());audit(Number(result.lastInsertRowid),'register');return respond(res,201,{success:true,message:'Compte enregistré. Validation métier non activée.'});}
   catch(e){if(String(e).includes('UNIQUE'))return respond(res,409,{error:'Adresse e-mail déjà utilisée'});throw e;}
  }
  if(p==='/api/login'&&method==='POST'){
   const d=await readBody(req),email=String(d.email||'').trim().toLowerCase(),password=String(d.password||'');
   const user=db.prepare('SELECT * FROM users WHERE email=?').get(email);
   if(!user||!passOK(password,user.pass_hash))return respond(res,401,{error:'Identifiants invalides'});
   const token=crypto.randomBytes(32).toString('hex'),digest=crypto.createHash('sha256').update(token).digest('hex');
   db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES (?,?,?)').run(digest,user.id,Date.now()+8*60*60*1000);audit(user.id,'login');
   return respond(res,200,{token,expires_in:28800,user:{id:user.id,name:user.name,email:user.email,role:user.role}});
  }
  const user=sessionFor(req);
  if(await publicConfig08k.handle(req,res,p,respond,readBody,user,audit))return;
  if(await products08j.handle(req,res,p,respond,readBody,user,audit))return;
  if(p==='/api/me'&&method==='GET')return user?respond(res,200,{user}):respond(res,401,{error:'Connexion requise'});
  if(p==='/api/logout'&&method==='POST'){if(!user)return respond(res,401,{error:'Connexion requise'});const bearer=req.headers.authorization.slice(7);db.prepare('DELETE FROM sessions WHERE token_hash=?').run(crypto.createHash('sha256').update(bearer).digest('hex'));audit(user.id,'logout');return respond(res,200,{success:true});}
  if(p==='/api/inquiries'&&method==='GET'){
   if(!user)return respond(res,401,{error:'Connexion requise'});
   const rows=db.prepare('SELECT id,message,status,created_at FROM inquiries WHERE user_id=? ORDER BY id DESC LIMIT 100').all(user.id);
   return respond(res,200,{inquiries:rows});
  }
  if(p==='/api/inquiries'&&method==='POST'){
   if(!user)return respond(res,401,{error:'Connexion requise'});
   const d=await readBody(req),message=String(d.message||'').trim();
   if(message.length<10||message.length>2000)return respond(res,400,{error:'Message requis entre 10 et 2000 caractères'});
   const result=db.prepare('INSERT INTO inquiries(user_id,message,created_at) VALUES (?,?,?)').run(user.id,message,new Date().toISOString());audit(user.id,'inquiry.create');return respond(res,201,{success:true,id:Number(result.lastInsertRowid),status:'nouveau'});
  }
  respond(res,404,{error:'Route introuvable'});
 }catch(e){console.error('ERREUR SERVEUR:',e.message);if(!res.headersSent)respond(res,500,{error:'Erreur interne du service'});}
});
server.listen(PORT,HOST,()=>{console.log('API_READY=http://'+HOST+':'+PORT);});
