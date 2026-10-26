'use strict';
const { URL } = require('node:url');
function setup(db){
 db.exec(`CREATE TABLE IF NOT EXISTS managed_products(
 id TEXT PRIMARY KEY,kind TEXT NOT NULL CHECK(kind IN ('LOCAL','TRANSFORME')),
 name TEXT NOT NULL,category TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '',
 origin TEXT NOT NULL DEFAULT '',unit TEXT NOT NULL DEFAULT '',price INTEGER NOT NULL DEFAULT 0,
 currency TEXT NOT NULL DEFAULT 'Ar',image TEXT NOT NULL DEFAULT '',ingredients TEXT NOT NULL DEFAULT '',
 weight TEXT NOT NULL DEFAULT '',storage TEXT NOT NULL DEFAULT '',shelf_life TEXT NOT NULL DEFAULT '',
 allergens TEXT NOT NULL DEFAULT '',lot TEXT NOT NULL DEFAULT '',availability TEXT NOT NULL DEFAULT 'sur demande',
 updated_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS idx_managed_products_kind ON managed_products(kind);`);
 const fields=['id','kind','name','category','description','origin','unit','price','currency','image','ingredients','weight','storage','shelf_life','allergens','lot','availability','updated_at'];
 const select='SELECT '+fields.join(',')+' FROM managed_products';
 function normalize(body){
  const d={};for(const f of fields){if(f==='updated_at')continue; d[f]=f==='price'?Number(body[f]):String(body[f]??'').trim();}
  if(!/^[A-Za-z0-9_-]{2,48}$/.test(d.id)||!['LOCAL','TRANSFORME'].includes(d.kind)||d.name.length<2||d.name.length>160||!Number.isSafeInteger(d.price)||d.price<0||d.price>2000000000)throw Error('Données invalides: identifiant, catégorie, nom ou prix');
  for(const f of fields){if(f==='price'||f==='updated_at')continue;if(d[f].length>2000)throw Error('Champ trop long: '+f);}
  d.updated_at=new Date().toISOString();return d;
 }
 async function handle(req,res,pathname,respond,readBody,user,audit){
  if(!pathname.startsWith('/api/managed-products'))return false;
  const isAdmin=user&&user.role==='ADMIN';
  if(!isAdmin){respond(res,user?403:401,{error:'Compte administrateur requis'});return true;}
  if(pathname==='/api/managed-products' && req.method==='GET'){
   return respond(res,200,{products:db.prepare(select+' ORDER BY name LIMIT 500').all(),source:'sqlite'}),true;
  }
  try{
   if(pathname==='/api/managed-products'&&req.method==='POST'){
    const d=normalize(await readBody(req));
    const stmt=db.prepare('INSERT INTO managed_products('+fields.join(',')+') VALUES ('+fields.map(()=>'?').join(',')+')');
    stmt.run(...fields.map(f=>d[f]));audit(user.id,'products.create:'+d.id);respond(res,201,{product:d});return true;
   }
   const id=decodeURIComponent(pathname.slice('/api/managed-products/'.length));
   if(!id||!/^[A-Za-z0-9_-]{2,48}$/.test(id)){respond(res,400,{error:'Identifiant invalide'});return true;}
   if(req.method==='PUT'){
    const d=normalize({...await readBody(req),id});
    const updatable=fields.filter(f=>f!=='id');
    const result=db.prepare('UPDATE managed_products SET '+updatable.map(f=>f+'=?').join(',')+' WHERE id=?').run(...updatable.map(f=>d[f]),id);
    if(!result.changes){respond(res,404,{error:'Produit introuvable'});return true;}
    audit(user.id,'products.update:'+id);respond(res,200,{product:d});return true;
   }
   if(req.method==='DELETE'){
    const result=db.prepare('DELETE FROM managed_products WHERE id=?').run(id);
    if(!result.changes){respond(res,404,{error:'Produit introuvable'});return true;}
    audit(user.id,'products.delete:'+id);respond(res,200,{success:true});return true;
   }
   respond(res,405,{error:'Méthode non prise en charge'});return true;
  }catch(e){
   const duplicate=/UNIQUE|PRIMARY KEY/.test(String(e));respond(res,duplicate?409:400,{error:duplicate?'Identifiant déjà utilisé':e.message||'Erreur de validation'});return true;
  }
 }
 return {handle};
}
module.exports={setup};
