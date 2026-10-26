import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getV03SessionToken } from './compte08';
import './produits08j.css';
type Product={id:string;kind:'LOCAL'|'TRANSFORME';name:string;category:string;description:string;origin:string;unit:string;price:number;currency:string;image:string;ingredients:string;weight:string;storage:string;shelf_life:string;allergens:string;lot:string;availability:string;updated_at?:string};
const empty:Product={id:'',kind:'LOCAL',name:'',category:'',description:'',origin:'Madagascar',unit:'kg',price:0,currency:'Ar',image:'',ingredients:'',weight:'',storage:'',shelf_life:'',allergens:'',lot:'',availability:'sur demande'};
const labels:Record<string,string>={id:'Référence',kind:'Famille',name:'Nom du produit',category:'Catégorie',description:'Description',origin:'Origine',unit:'Unité',price:'Prix indicatif (Ar)',currency:'Devise',image:'Nom de l’image',ingredients:'Ingrédients',weight:'Poids / volume',storage:'Conservation',shelf_life:'Durée de conservation',allergens:'Allergènes',lot:'Numéro de lot',availability:'Disponibilité'};
const fields=(Object.keys(labels) as Array<keyof Product>);
export function ProduitsSqliteAdminV03(){
 const [items,setItems]=useState<Product[]>([]);const [form,setForm]=useState<Product|null>(null);const [detail,setDetail]=useState<Product|null>(null);const [error,setError]=useState('');const [busy,setBusy]=useState(false);const [role,setRole]=useState('');
 const token=getV03SessionToken();
 async function api(path:string,method='GET',body?:unknown){
  const r=await fetch('http://127.0.0.1:4304'+path,{method,headers:{...(token?{'Authorization':'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const data=await r.json();if(!r.ok)throw Error(data.error||'Erreur API');return data;
 }
 async function refresh(){try{const d=await api('/api/managed-products');setItems(d.products);if(token){const me=await api('/api/me');setRole(me.user.role)}}catch(e){setError((e as Error).message)}}
 useEffect(()=>{void refresh()},[]);
 async function save(e:FormEvent){e.preventDefault();if(!form)return;setBusy(true);setError('');try{const exists=items.some(x=>x.id===form.id);await api('/api/managed-products'+(exists?'/'+encodeURIComponent(form.id):''),exists?'PUT':'POST',form);setForm(null);await refresh()}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 async function remove(p:Product){if(!window.confirm('Supprimer '+p.name+' ?'))return;setBusy(true);try{await api('/api/managed-products/'+encodeURIComponent(p.id),'DELETE');await refresh()}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 return <section className="j08"><div className="j08wrap"><div className="j08head"><div><p>CATALOGUE — ADMINISTRATION</p><h1>Produits locaux et transformés</h1><span>Gestion réelle dans SQLite · Les données modifiées sont privées tant que le catalogue public n'est pas raccordé.</span></div><Link to="/mon-espace">Retour à mon espace</Link></div>
 {!token?<p className="j08warning">Connexion requise. <Link to="/connexion">Se connecter</Link></p>:role!=='ADMIN'?<p className="j08warning">Accès réservé au rôle administrateur. Le compte doit être autorisé localement par le responsable.</p>:<button type="button" onClick={()=>setForm({...empty})}>+ Nouveau produit</button>}
 {error&&<p role="alert" className="j08warning">{error}</p>}
 <div className="j08grid">{items.map(p=><article key={p.id}><small>{p.kind==='LOCAL'?'PRODUIT LOCAL':'PRODUIT TRANSFORMÉ'} · {p.id}</small><h2>{p.name}</h2><p>{p.description||'Description à compléter'}</p><b>{p.price.toLocaleString('fr-FR')} {p.currency}</b><span>{p.unit} · {p.availability}</span><div><button onClick={()=>setDetail(p)}>Fiche technique</button>{role==='ADMIN'&&<><button onClick={()=>setForm({...p})}>Modifier</button><button disabled={busy} onClick={()=>void remove(p)}>Supprimer</button></>}</div></article>)}</div>
 {detail&&<div className="j08overlay" onMouseDown={e=>e.target===e.currentTarget&&setDetail(null)}><div className="j08dialog" role="dialog" aria-modal="true" aria-label="Fiche technique"><button onClick={()=>setDetail(null)}>Fermer ×</button><h2>{detail.name}</h2>{fields.map(k=><p key={k}><strong>{labels[k]} :</strong> {String(detail[k]??'—')}</p>)}</div></div>}
 {form&&<div className="j08overlay"><div className="j08dialog" role="dialog" aria-modal="true" aria-label="Formulaire produit"><button type="button" onClick={()=>setForm(null)}>Fermer ×</button><h2>{items.some(x=>x.id===form.id)?'Modifier':'Ajouter'} un produit</h2><form onSubmit={save} className="j08form">{fields.map(k=><label key={k}>{labels[k]}{k==='kind'?<select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value as Product['kind']})}><option value="LOCAL">Produit local</option><option value="TRANSFORME">Produit transformé</option></select>:<input required={['id','name'].includes(k)} disabled={k==='id'&&items.some(x=>x.id===form.id)} type={k==='price'?'number':'text'} min={k==='price'?0:undefined} value={String(form[k]??'')} onChange={e=>setForm({...form,[k]:k==='price'?Number(e.target.value):e.target.value})}/>}</label>)}<button type="submit" disabled={busy}>{busy?'Enregistrement…':'Enregistrer dans SQLite'}</button></form></div></div>}
 </div></section>;
}
