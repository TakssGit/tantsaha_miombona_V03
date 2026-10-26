'use strict';
function setup(db){
 db.exec("CREATE TABLE IF NOT EXISTS site_settings(key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at TEXT NOT NULL)");
 const columns=db.prepare('PRAGMA table_info(managed_products)').all().map(c=>c.name);
 if(!columns.includes('published'))db.exec('ALTER TABLE managed_products ADD COLUMN published INTEGER NOT NULL DEFAULT 0');
 const defaults={site_name:'Tantsaha Miombona',contact_email:'contact@tantsaha-miombona.mg',contact_phone:'',contact_address:'',facebook:'',whatsapp:'',instagram:'',youtube:'',linkedin:'',public_message:'Découvrez les produits de notre filière tomate.'};
 const ins=db.prepare('INSERT OR IGNORE INTO site_settings(key,value,updated_at) VALUES(?,?,?)');
 for(const [k,v] of Object.entries(defaults))ins.run(k,v,new Date().toISOString());
 const allowed=Object.keys(defaults);
 const select=()=>Object.fromEntries(db.prepare('SELECT key,value FROM site_settings').all().map(x=>[x.key,x.value]));
 function handle(req,res,p,respond,readBody,user,audit){
  if(p==='/api/public-catalogue'&&req.method==='GET'){
   const products=db.prepare('SELECT id,kind,name,category,description,origin,unit,price,currency,image,ingredients,weight,storage,shelf_life,allergens,availability,updated_at FROM managed_products WHERE published=1 ORDER BY name LIMIT 500').all();
   respond(res,200,{products,source:'sqlite',notice:'Disponibilités et prix à confirmer auprès de l’établissement'});return true;
  }
  if(p==='/api/public-settings'&&req.method==='GET'){
   respond(res,200,{settings:select()});return true;
  }
  if(!p.startsWith('/api/admin/site-settings')&&!p.startsWith('/api/admin/publishing'))return false;
  if(!user||user.role!=='ADMIN'){respond(res,user?403:401,{error:'Administrateur requis'});return true;}
  if(p==='/api/admin/site-settings'&&req.method==='GET'){respond(res,200,{settings:select()});return true;}
  if(p==='/api/admin/site-settings'&&req.method==='PUT'){
   return (async()=>{try{const body=await readBody(req),input=body.settings;
    if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Paramètres invalides');
    const updates=Object.entries(input);if(!updates.length||updates.length>allowed.length)throw Error('Nombre de champs invalide');
    for(const [k,v] of updates){if(!allowed.includes(k)||typeof v!=='string'||v.length>1000)throw Error('Champ non autorisé: '+k);}
    const stmt=db.prepare('UPDATE site_settings SET value=?,updated_at=? WHERE key=?');
    db.exec('BEGIN');try{for(const [k,v] of updates)stmt.run(v.trim(),new Date().toISOString(),k);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}
    audit(user.id,'site_settings.update');respond(res,200,{settings:select()});
   }catch(e){respond(res,400,{error:e.message||'Modification impossible'})}return true})();
  }
  const match=/^\/api\/admin\/publishing\/([A-Za-z0-9_-]{2,48})$/.exec(p);
  if(match&&req.method==='PUT'){
   return (async()=>{try{const body=await readBody(req);if(typeof body.published!=='boolean')throw Error('published booléen requis');
    const result=db.prepare('UPDATE managed_products SET published=?,updated_at=? WHERE id=?').run(body.published?1:0,new Date().toISOString(),match[1]);
    if(!result.changes){respond(res,404,{error:'Produit absent'});return true;}
    audit(user.id,'product.publish:'+match[1]+':'+body.published);respond(res,200,{success:true,id:match[1],published:body.published});
   }catch(e){respond(res,400,{error:e.message||'Échec publication'})}return true})();
  }
  if(p==='/api/admin/publishing'&&req.method==='GET'){
   const products=db.prepare('SELECT id,name,kind,price,currency,published,updated_at FROM managed_products ORDER BY name LIMIT 500').all();respond(res,200,{products});return true;
  }
  respond(res,405,{error:'Méthode non autorisée'});return true;
 }
 return {handle};
}
module.exports={setup};
