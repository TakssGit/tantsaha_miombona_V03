import './i18n08i.css';
/** Tantsaha Miombona V03 — aide multilingue non destructive (lot 08I). */
type Lang = 'fr' | 'mg' | 'en';
const glossary: Record<string, {mg:string;en:string}> = {
  'Accueil':{mg:'Fandraisana',en:'Home'},
  'À propos':{mg:'Momba anay',en:'About us'},
  'Catalogue':{mg:'Katalaogy',en:'Catalog'},
  'Contact':{mg:'Fifandraisana',en:'Contact'},
  'Connexion':{mg:'Hiditra',en:'Sign in'},
  'Créer un compte':{mg:'Hamorona kaonty',en:'Create an account'},
  'Devenir membre':{mg:'Ho mpikambana',en:'Become a member'},
  'Voir le catalogue':{mg:'Hijery ny katalaogy',en:'View catalog'},
  'Découvrir le catalogue':{mg:'Hijery ny vokatra',en:'Explore products'},
  'Découvrir les produits':{mg:'Hijery ny vokatra',en:'Discover products'},
  'En savoir plus':{mg:'Hahafantatra bebe kokoa',en:'Learn more'},
  'Nous contacter':{mg:'Hifandray aminay',en:'Contact us'},
  'Contacter l’équipe':{mg:'Hifandray amin’ny ekipa',en:'Contact the team'},
  'Aller au contact':{mg:'Hankany amin’ny fifandraisana',en:'Go to contact'},
  'Se connecter':{mg:'Hiditra',en:'Sign in'},
  'Déconnexion':{mg:'Hivoaka',en:'Sign out'},
  'Produits':{mg:'Vokatra',en:'Products'},
  'Produits locaux':{mg:'Vokatra eto an-toerana',en:'Local products'},
  'Produits transformés':{mg:'Vokatra voahodina',en:'Processed products'},
  'Gestion des produits':{mg:'Fitantanana vokatra',en:'Product management'},
  'Prix':{mg:'Vidiny',en:'Price'},
  'Description':{mg:'Famaritana',en:'Description'},
  'Catégorie':{mg:'Sokajy',en:'Category'},
  'Quantité':{mg:'Habetsahana',en:'Quantity'},
  'Stock':{mg:'Tahiry',en:'Stock'},
  'Fiche technique':{mg:'Antsipiriany ara-teknika',en:'Technical sheet'},
  'Voir la fiche':{mg:'Hijery ny antsipiriany',en:'View details'},
  'Sauvegarder':{mg:'Hitahiry',en:'Save'},
  'Enregistrer':{mg:'Hitahiry',en:'Save'},
  'Ajouter':{mg:'Hanampy',en:'Add'},
  'Modifier':{mg:'Hanova',en:'Edit'},
  'Supprimer':{mg:'Hamafa',en:'Delete'},
  'Annuler':{mg:'Hanafoana',en:'Cancel'},
  'Rechercher':{mg:'Hitady',en:'Search'},
  'Tous':{mg:'Rehetra',en:'All'},
  'Tableau de bord':{mg:'Tabilao fitantanana',en:'Dashboard'},
  'Commandes':{mg:'Kaomandy',en:'Orders'},
  'Historique':{mg:'Tantaran’ny asa',en:'History'},
  'Producteurs':{mg:'Mpamboly',en:'Farmers'},
  'Point focal':{mg:'Mpandrindra',en:'Focal point'},
  'Distributeurs':{mg:'Mpizara entana',en:'Distributors'},
  'Consommateurs':{mg:'Mpanjifa',en:'Consumers'},
  'Transformation':{mg:'Fanodinana',en:'Processing'},
  'Distribution':{mg:'Fizarana',en:'Distribution'},
  'Production':{mg:'Famokarana',en:'Production'},
  'Collecte':{mg:'Fanangonana',en:'Collection'},
  'Précommandes':{mg:'Famandrihana mialoha',en:'Pre-orders'},
  'Paiements':{mg:'Fandoavam-bola',en:'Payments'},
  'Paramètres':{mg:'Fikirana',en:'Settings'},
  'Suivi':{mg:'Fanaraha-maso',en:'Tracking'},
  'Bienvenue':{mg:'Tongasoa',en:'Welcome'},
  'Votre nom':{mg:'Ny anaranao',en:'Your name'},
  'Nom complet':{mg:'Anarana feno',en:'Full name'},
  'Adresse e-mail':{mg:'Adiresy mailaka',en:'Email address'},
  'Téléphone':{mg:'Telefaonina',en:'Phone'},
  'Message':{mg:'Hafatra',en:'Message'},
  'Envoyer la demande':{mg:'Handefa ny fangatahana',en:'Send request'},
  'Envoyer un message':{mg:'Handefa hafatra',en:'Send message'},
  'Voir les détails':{mg:'Hijery ny antsipiriany',en:'View details'},
  'Mon espace':{mg:'Ny kaontiko',en:'My account'},
  'Les produits':{mg:'Ny vokatra',en:'Products'},
  'Sauces':{mg:'Saosy',en:'Sauces'},
  'Conserves':{mg:'Vokatra voatahiry',en:'Preserves'},
  'Épicerie':{mg:'Entana fihinana',en:'Grocery'},
  'Demander ce produit':{mg:'Hangataka ity vokatra ity',en:'Request this product'},
  'Demander les disponibilités':{mg:'Hanontany ny fisian’ny vokatra',en:'Ask about availability'},
  'Devenir partenaire':{mg:'Ho mpiara-miombon’antoka',en:'Become a partner'},
  'Voir les produits':{mg:'Hijery vokatra',en:'View products'},
  'Choisissez votre profil':{mg:'Fidio ny mombamomba anao',en:'Choose your profile'},
};
const ui = {
  fr:{name:'Langue du site',note:'Traduction progressive : certaines descriptions restent en français.'},
  mg:{name:'Fitenin’ny tranonkala',note:'Mbola adika tsikelikely ny famaritana sasany.'},
  en:{name:'Website language',note:'Translation in progress: some descriptions remain in French.'},
};
const originals = new WeakMap<Text,string>();
const lookup=new Map<string,{mg:string;en:string}>();
const canonical=new Map<string,string>();
for (const [key,value] of Object.entries(glossary)) {
  lookup.set(key.toLocaleLowerCase(),value);
  canonical.set(key.toLocaleLowerCase(),key);
  canonical.set(value.mg.toLocaleLowerCase(),key);
  canonical.set(value.en.toLocaleLowerCase(),key);
}
function getLanguage():Lang {const l=localStorage.getItem('tm-v03-lang');return l==='mg'||l==='en'?l:'fr';}
let current:Lang='fr';
let queued=false;
function translateTextNode(node:Text){
  const parent=node.parentElement;
  if(!parent||parent.closest('[data-tm-i18n-root],script,style,textarea,[contenteditable="true"]'))return;
  const raw=originals.get(node)??node.nodeValue??'';
  const trimmed=raw.trim();
  if(!trimmed)return;
  const key=canonical.get(trimmed.toLocaleLowerCase());
  if(!key)return;
  if(!originals.has(node))originals.set(node,raw);
  const target=current==='fr'?key:lookup.get(key.toLocaleLowerCase())?.[current]??key;
  const transformed=raw.replace(trimmed,target);
  if(node.nodeValue!==transformed)node.nodeValue=transformed;
}
function translateTree(){
  const root=document.getElementById('root');if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node:Node|null;
  while((node=walker.nextNode()))translateTextNode(node as Text);
}
function updateToolbar(){
  const toolbar=document.getElementById('tm-v03-language-select') as HTMLSelectElement|null;
  const note=document.getElementById('tm-v03-language-note');
  const label=document.getElementById('tm-v03-language-label');
  if(toolbar)toolbar.value=current;
  if(note)note.textContent=ui[current].note;
  if(label)label.textContent=ui[current].name;
  document.documentElement.lang=current;
}
function scheduleTranslate(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;translateTree();});}
function mount(){
  if(document.getElementById('tm-v03-i18n-toolbar'))return;
  const container=document.createElement('div');container.id='tm-v03-i18n-toolbar';
  container.setAttribute('data-tm-i18n-root','');
  container.innerHTML=`<label id="tm-v03-language-label" for="tm-v03-language-select">Langue du site</label><select id="tm-v03-language-select" aria-label="Choix de langue"><option value="fr">FR · Français</option><option value="mg">MG · Malagasy</option><option value="en">EN · English</option></select><small id="tm-v03-language-note"></small>`;
  document.body.appendChild(container);
  const select=container.querySelector('select')!;
  select.addEventListener('change',()=>{current=select.value as Lang;localStorage.setItem('tm-v03-lang',current);updateToolbar();scheduleTranslate();});
  const root=document.getElementById('root');
  if(root){new MutationObserver(scheduleTranslate).observe(root,{childList:true,subtree:true,characterData:false});}
  updateToolbar();scheduleTranslate();
}
current=getLanguage();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
