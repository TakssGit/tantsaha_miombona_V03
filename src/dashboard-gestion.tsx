import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Package, Sprout, ShoppingCart, Truck, Users, Search, Settings, CheckCircle2, Wallet, ArrowRight } from 'lucide-react';
import './dashboard-gestion.css';

type Module = { title: string; desc: string; group: 'Agricole' | 'Commercial' | 'Administration'; route: string; icon: React.ReactNode };
const modules: Module[] = [
  { title:'Producteurs et points focaux', desc:'Précommandes agricoles, lots, triage et étapes de validation.', group:'Agricole',route:'/espace-producteur',icon:<Sprout size={24}/> },
  { title:'Collecte et approvisionnement', desc:'Préparation des volumes, lieux de collecte et bordereaux.', group:'Agricole',route:'/espace-producteur',icon:<Truck size={24}/> },
  { title:'Commandes des acheteurs', desc:'Demandes commerciales, préparation et livraison.', group:'Commercial',route:'/espace-acheteur',icon:<ShoppingCart size={24}/> },
  { title:'Catalogue et produits', desc:'Présentation des gammes et informations produit.', group:'Commercial',route:'/catalogue',icon:<Package size={24}/> },
  { title:'Suivi et historique', desc:'Exemples de dossiers, statuts et références.', group:'Administration',route:'/espaces',icon:<ClipboardList size={24}/> },
  { title:'Comptes et adhésion', desc:'Parcours d’inscription, rôles et demandes membres.', group:'Administration',route:'/inscription',icon:<Users size={24}/> },
  { title:'Situations financières', desc:'Présentation des paiements et soldes en attente d’intégration.', group:'Administration',route:'/espaces',icon:<Wallet size={24}/> },
  { title:'Paramètres de contact', desc:'Coordonnées et réseaux sociaux à connecter aux paramètres.', group:'Administration',route:'/?contact=1',icon:<Settings size={24}/> },
];
const groups = ['Tous','Agricole','Commercial','Administration'] as const;
export function ManagementDashboardPage(){
 const [group,setGroup]=useState<(typeof groups)[number]>('Tous');
 const [query,setQuery]=useState('');
 const shown=useMemo(()=>modules.filter(m=>(group==='Tous'||m.group===group)&&`${m.title} ${m.desc}`.toLowerCase().includes(query.trim().toLowerCase())),[group,query]);
 return <section className="tm6-dashboard"><div className="tm6-container">
  <div className="tm6-hero"><div><span>ESPACE DE GESTION — PRÉVISUALISATION</span><h1>Organisez votre activité depuis un tableau de bord clair.</h1><p>Accédez aux portails métier, aux commandes et aux fonctionnalités prévues pour chaque profil. Les données et autorisations seront reliées au serveur après validation du frontend.</p><div className="tm6-links"><Link to="/espaces">Choisir un portail <ArrowRight size={17}/></Link><Link to="/">Retour à l’accueil</Link></div></div><CheckCircle2 size={65}/></div>
  <div className="tm6-summary"><article><strong>—</strong><span>Précommandes actives</span></article><article><strong>—</strong><span>Commandes à traiter</span></article><article><strong>—</strong><span>Lots validés</span></article><article><strong>—</strong><span>Paiements confirmés</span></article></div>
  <div className="tm6-tools"><div className="tm6-filters" aria-label="Filtrer les modules">{groups.map(v=><button type="button" aria-pressed={v===group} className={v===group?'active':''} key={v} onClick={()=>setGroup(v)}>{v}</button>)}</div><label className="tm6-search"><Search size={17}/><input aria-label="Rechercher un module" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un module..."/></label></div>
  <div className="tm6-grid">{shown.map(m=><Link to={m.route} key={m.title} className="tm6-card"><span className="tm6-icon">{m.icon}</span><small>{m.group}</small><h2>{m.title}</h2><p>{m.desc}</p><b>Ouvrir <ArrowRight size={16}/></b></Link>)}</div>{shown.length===0&&<p className="tm6-empty">Aucun module ne correspond à votre recherche.</p>}
  <p className="tm6-notice">Les chiffres restent volontairement vides : il n’y a pas encore de serveur connecté. Aucun compte ni paiement réel n’est créé ici.</p>
 </div></section>;
}
