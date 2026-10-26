import './style.css';
import { CatalogueSqlitePublicV03, ParametresAdminV03 } from './site08k';
import { ProduitsSqliteAdminV03 } from './produits08j';
import React, { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  Factory,
  Facebook,
  Globe,
  Home,
  Info,
  Instagram,
  Leaf,
  Linkedin,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Sprout,
  Truck,
  UserPlus,
  Users,
  X,
  Youtube,
} from 'lucide-react';
const BASE = import.meta.env.BASE_URL;
const ROUTER_BASE = BASE !== '/' && BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
const asset = (name: string) => `${BASE}assets/images/${name}`;
const catalogueAsset = (name: string) => `${BASE}assets/images/catalogue_v03/${name}`;

type ProductCategory = 'Sauces' | 'Conserves' | 'Épicerie';

type Product = {
  code: string;
  name: string;
  category: ProductCategory;
  unit: string;
  price: string;
  image: string;
  short: string;
  description: string;
  highlight?: string;
};

type ProcessStep = {
  title: string;
  text: string;
  image: string;
  icon: LucideIcon;
};

const processSteps: ProcessStep[] = [
  {
    title: 'Production',
    text: 'Prévisions agricoles, récoltes et accompagnement des producteurs membres.',
    image: asset('producteurs_champ_tomate.jpg'),
    icon: Sprout,
  },
  {
    title: 'Coordination',
    text: 'Organisation des points focaux, centralisation des besoins et planification des volumes.',
    image: asset('point_focal_producteurs.jpg'),
    icon: Users,
  },
  {
    title: 'Collecte',
    text: 'Regroupement des lots et préparation logistique avant l’arrivée à l’unité.',
    image: asset('collecte_transport_tomate.jpg'),
    icon: Truck,
  },
  {
    title: 'Transformation',
    text: 'Transformation locale, contrôle qualité et conditionnement des produits finis.',
    image: asset('hero_unite_transformation.jpg'),
    icon: Factory,
  },
  {
    title: 'Distribution',
    text: 'Présentation des gammes, commandes, distribution et relation avec les clients.',
    image: catalogueAsset('sauce-tomate-artisanale.png'),
    icon: ShoppingBasket,
  },
];

const products: Product[] = [
  {
    code: 'PRD-001',
    name: 'Sauce tomate artisanale',
    category: 'Sauces',
    unit: 'Bouteille 50 cl',
    price: '6 500 Ar',
    image: 'sauce-tomate-artisanale.png',
    short: 'Sauce prête à l’usage',
    description: 'Sauce tomate douce et onctueuse pour les pâtes, le riz, les plats mijotés et la restauration.',
    highlight: 'Best-seller',
  },
  {
    code: 'PRD-002',
    name: 'Purée de tomates',
    category: 'Sauces',
    unit: 'Bocal 350 g',
    price: '7 000 Ar',
    image: 'puree-tomates-artisanale.png',
    short: 'Texture lisse et naturelle',
    description: 'Purée épaisse à base de tomates mûres, idéale pour les sauces maison et la cuisine familiale.',
  },
  {
    code: 'PRD-003',
    name: 'Coulis de tomates au basilic',
    category: 'Sauces',
    unit: 'Bouteille 50 cl',
    price: '8 200 Ar',
    image: 'coulis-basilic.png',
    short: 'Saveur parfumée',
    description: 'Coulis cuisiné avec des herbes aromatiques pour relever les recettes simples et raffinées.',
  },
  {
    code: 'PRD-004',
    name: 'Double concentré de tomates',
    category: 'Conserves',
    unit: 'Boîte 210 g',
    price: '5 500 Ar',
    image: 'concentre-double.png',
    short: 'Goût intense',
    description: 'Concentré riche en goût pour renforcer les sauces, marinades et plats traditionnels.',
  },
  {
    code: 'PRD-005',
    name: 'Ketchup épicé aux tomates',
    category: 'Sauces',
    unit: 'Bouteille 45 cl',
    price: '7 800 Ar',
    image: 'ketchup-epice.png',
    short: 'Relevé mais équilibré',
    description: 'Recette gourmande au piment doux, adaptée aux snacks, grillades et sandwichs.',
  },
  {
    code: 'PRD-006',
    name: 'Tomates séchées',
    category: 'Épicerie',
    unit: 'Sachet 200 g',
    price: '9 500 Ar',
    image: 'tomates-sechees.png',
    short: 'Épicerie fine',
    description: 'Tomates séchées idéales pour les salades, apéritifs, sandwichs et recettes créatives.',
  },
  {
    code: 'PRD-007',
    name: 'Confiture de tomates',
    category: 'Épicerie',
    unit: 'Bocal 250 g',
    price: '8 500 Ar',
    image: 'confiture-tomates.png',
    short: 'Douceur originale',
    description: 'Confiture artisanale à déguster au petit-déjeuner, avec du pain, du fromage ou des desserts.',
  },
  {
    code: 'PRD-008',
    name: 'Chutney de tomates',
    category: 'Épicerie',
    unit: 'Bocal 250 g',
    price: '8 900 Ar',
    image: 'chutney-tomates.png',
    short: 'Saveur sucrée-salée',
    description: 'Chutney de caractère pour accompagner les grillades, plats de fête et plateaux gourmands.',
  },
];

const contactInfo = {
  email: 'contact@tantsaha-miombona.mg',
  phone: '+261 34 00 000 00',
  address: 'Lot FTM 01 – Andranomainty, Antananarivo, Madagascar',
  socials: [
    { name: 'Facebook', href: '#', icon: Facebook, cls: 'facebook' },
    { name: 'WhatsApp', href: '#', icon: MessageCircle, cls: 'whatsapp' },
    { name: 'YouTube', href: '#', icon: Youtube, cls: 'youtube' },
    { name: 'LinkedIn', href: '#', icon: Linkedin, cls: 'linkedin' },
    { name: 'Instagram', href: '#', icon: Instagram, cls: 'instagram' },
    { name: 'Site web', href: '#', icon: Globe, cls: 'web' },
  ],
};

const patchStyles = `
.process-card .card-media, .steps.five .card img {height: 205px; object-fit: cover; width: 100%;}
.catalogue-highlight img {width: 108px; height: 108px; object-fit: cover; border-radius: 20px; background: #fff;}
.catalogue-highlight {display:flex; gap:16px; align-items:center; padding:18px; border-radius:24px; background:#fff; box-shadow:0 10px 30px rgba(16,71,54,.08);}
.catalogue-hero-stack {display:grid; gap:16px; align-content:center;}
.about-kpis {display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:16px; margin-top:28px;}
.about-kpis article {background:#fff; border:1px solid rgba(26,88,64,.08); border-radius:22px; padding:18px; box-shadow:0 10px 30px rgba(16,71,54,.06);}
.about-kpis strong {display:block; font-size:1.8rem; color:#0f4d3a; margin-bottom:8px;}
.about-kpis span {display:block; color:#5b6f64; font-size:.95rem;}
.about-pillars {display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:22px;}
.about-pillars article {background:#fff; border:1px solid rgba(26,88,64,.08); border-radius:26px; overflow:hidden; box-shadow:0 10px 30px rgba(16,71,54,.06);}
.about-pillars img {width:100%; height:215px; object-fit:cover; display:block;}
.about-pillars .content {padding:20px 22px 24px;}
.about-pillars h3 {margin:0 0 10px; color:#0f4d3a; font-size:1.25rem;}
.about-dual-grid {display:grid; grid-template-columns:1.08fr .92fr; gap:24px;}
.about-surface {background:#fff; border:1px solid rgba(26,88,64,.08); border-radius:26px; padding:24px; box-shadow:0 10px 30px rgba(16,71,54,.06);}
.about-surface h3 {margin-top:0; color:#0f4d3a;}
.about-list, .numbered {padding-left:18px; margin:12px 0 0; display:grid; gap:10px; color:#51685c;}
.about-journey {display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:18px;}
.about-journey article {background:linear-gradient(180deg,#ffffff 0%,#f7fbf8 100%); border:1px solid rgba(26,88,64,.08); border-radius:24px; padding:22px; box-shadow:0 10px 24px rgba(16,71,54,.05);}
.about-journey strong {display:inline-flex; width:52px; height:52px; align-items:center; justify-content:center; border-radius:16px; background:#eaf4ed; color:#0f6b4c; font-size:1.15rem; margin-bottom:12px;}
.about-gallery {display:grid; grid-template-columns:1.15fr .85fr; gap:22px; align-items:stretch;}
.about-gallery .main-visual, .about-gallery .side-visual {background:#fff; border-radius:28px; overflow:hidden; border:1px solid rgba(26,88,64,.08); box-shadow:0 10px 30px rgba(16,71,54,.06);}
.about-gallery .main-visual img {width:100%; height:100%; min-height:360px; object-fit:cover; display:block;}
.about-gallery .side-visual {display:grid;}
.about-gallery .side-visual img {width:100%; height:180px; object-fit:cover; display:block;}
.about-gallery .side-visual .copy {padding:20px;}
.compact-contact-cta {padding-top:18px;}
.compact-contact-card {display:flex; justify-content:space-between; gap:24px; align-items:center; background:linear-gradient(135deg,#0f6b4c 0%,#19593f 100%); color:#fff; border-radius:28px; padding:26px 28px; box-shadow:0 16px 42px rgba(15,79,58,.22);}
.compact-contact-card h3 {margin:10px 0 10px; font-size:1.7rem;}
.compact-contact-card p {margin:0; color:rgba(255,255,255,.88); max-width:720px;}
.compact-contact-card .eyebrow {display:inline-flex; align-items:center; gap:8px; color:#d3f1e0; font-weight:700; text-transform:uppercase; letter-spacing:.08em; font-size:.78rem;}
.compact-contact-card .cta-actions {display:flex; gap:12px; flex-wrap:wrap;}
.compact-contact-card .btn.outline {border-color:rgba(255,255,255,.46); color:#fff;}
.compact-contact-card .btn.outline:hover {background:rgba(255,255,255,.12);}
.catalog-note.public-note {display:flex; gap:12px; align-items:flex-start; padding:18px 20px; border-radius:22px; background:#fff; border:1px solid rgba(26,88,64,.08);}
.catalog-note.public-note svg {flex:0 0 auto; color:#0f6b4c; margin-top:2px;}
.products-grid.expanded .product-card img {height:280px; object-fit:cover; width:100%;}
.contact-card.rich .contact-map-card img {height:180px; object-fit:cover; width:100%;}
@media (max-width: 1100px) {
  .about-kpis, .about-pillars, .about-journey {grid-template-columns:repeat(2,minmax(0,1fr));}
  .about-dual-grid, .about-gallery {grid-template-columns:1fr;}
}
@media (max-width: 760px) {
  .about-kpis, .about-pillars, .about-journey {grid-template-columns:1fr;}
  .compact-contact-card {flex-direction:column; align-items:flex-start;}
}
/* === TANTSAHA V03 LOT 10H — DESIGN CANONIQUE CORRIGE === */
:root {
  --tm-cream: #fffaf4;
  --tm-surface: #ffffff;
  --tm-leaf: #edf5ed;
  --tm-leaf-strong: #e4f0e5;
  --tm-forest: #104c35;
  --tm-forest-2: #176443;
  --tm-ink: #173e2f;
  --tm-muted: #617568;
  --tm-line: #e9dfd1;
  --tm-orange: #c97719;
  --tm-radius: 22px;
  --tm-shadow: 0 12px 30px rgba(28,54,37,.075);
}

/* En-tête : une seule rangée sur PC, menu replié sur petits écrans. */
.header { position: sticky !important; top: 0; z-index: 60; width: 100%; background: rgba(255,250,244,.97); backdrop-filter: blur(12px); border-bottom: 1px solid var(--tm-line); }
.header > .wrap.nav {
  box-sizing: border-box; display: grid !important; grid-template-columns: minmax(210px, 1fr) auto auto;
  align-items: center; justify-content: stretch; gap: clamp(12px, 1.4vw, 24px);
  width: min(1480px, calc(100% - 56px)); max-width: 1480px; min-height: 88px; margin-inline: auto;
  padding-block: 10px; flex-wrap: nowrap !important;
}
.header .identity { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; gap: 12px; width: auto; max-width: 290px; min-width: 0; white-space: normal; text-decoration: none; }
.header .identity img { display: block; flex: 0 0 46px; width: 46px; height: 46px; max-width: 46px; max-height: 46px; object-fit: contain; }
.header .identity span { display: block; min-width: 0; }
.header .identity b { display: block; line-height: 1.25; overflow-wrap: normal; word-break: normal; }
.header .identity small { display: block; margin-top: 4px; line-height: 1.35; white-space: normal; color: var(--tm-muted); }
.header .menu-toggle { display: none !important; }
.header .nav-links { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; align-items: center; justify-content: center; gap: 4px; width: auto; min-width: 0; }
.header .nav-links a { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 42px; padding: 10px 11px; border-radius: 13px; line-height: 1.25; font-size: .94rem; font-weight: 750; white-space: nowrap; text-decoration: none; }
.header .nav-links a.active, .header .nav-links a[aria-current="page"], .header .nav-links a:hover { background: var(--tm-leaf); color: var(--tm-forest); }
.header .nav-links .mobile-auth { display: none !important; }
.header .auth-actions { display: flex !important; flex-direction: row; align-items: center; justify-content: flex-end; flex-wrap: nowrap !important; gap: 8px; min-width: 0; }
.header .auth-actions .btn { min-height: 46px; padding: 11px 15px; border-radius: 14px; white-space: nowrap; }
.header .dashboard-provisional { border-color: #cbded0; }

/* Hero : deux colonnes nettes, sans texte étroit ni actions qui se chevauchent. */
.hero { padding: clamp(42px, 5vw, 72px) 0 clamp(34px, 4vw, 56px); background: linear-gradient(135deg, #fffaf4 0%, #f2f7ed 100%); }
.hero .hero-grid { display: grid !important; grid-template-columns: minmax(0, 1.04fr) minmax(360px, .96fr); align-items: center; gap: clamp(28px, 4vw, 64px); }
.hero .hero-grid > div { min-width: 0; }
.hero .eyebrow, .pagehero .eyebrow { display: inline-flex; align-items: center; gap: 8px; color: var(--tm-orange); font-weight: 850; letter-spacing: .12em; text-transform: uppercase; font-size: .82rem; }
.hero h1 { max-width: 13ch; margin: 16px 0 20px; color: var(--tm-forest); font-size: clamp(2.65rem, 4.6vw, 4.75rem); line-height: 1.02 !important; letter-spacing: -.035em; text-wrap: balance; }
.hero p { max-width: 62ch; margin: 0; color: var(--tm-muted); font-size: clamp(1.02rem, 1.3vw, 1.22rem); line-height: 1.75; }
.hero .hero-image { display: block; width: 100%; height: clamp(330px, 38vw, 520px); object-fit: cover; object-position: center; border-radius: 30px; border: 1px solid var(--tm-line); box-shadow: var(--tm-shadow); }
.hero .actions { display: flex !important; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.hero .actions .btn { min-height: 48px; padding: 12px 20px; border-radius: 15px; }
.hero .actions .btn.quiet { color: var(--tm-forest); background: transparent; border-color: transparent; }
.hero .hero-highlights { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 24px; }
.hero .hero-highlights > div { display: flex; align-items: flex-start; gap: 9px; min-width: 0; padding: 12px; border: 1px solid rgba(26,88,64,.09); border-radius: 16px; background: rgba(255,255,255,.72); color: #365443; font-size: .9rem; line-height: 1.45; font-weight: 700; }
.hero .hero-highlights svg { flex: 0 0 auto; color: var(--tm-forest-2); margin-top: 1px; }

/* Titres et sections : largeur de lecture cohérente. */
.section { padding-block: clamp(44px, 5.2vw, 76px); }
.section.soft { background: var(--tm-leaf); }
.heading { max-width: 920px; margin: 0 auto clamp(26px, 3vw, 38px); text-align: center; }
.heading > span { display: inline-block; margin-bottom: 10px; color: var(--tm-orange); font-size: .82rem; font-weight: 850; letter-spacing: .1em; }
.heading h2, .section h2 { color: var(--tm-forest); font-size: clamp(2rem, 3.4vw, 3.25rem); line-height: 1.08; letter-spacing: -.025em; margin: 0 0 12px; text-wrap: balance; }
.heading p { max-width: 800px; margin: 0 auto; color: var(--tm-muted); font-size: clamp(1rem, 1.25vw, 1.18rem); line-height: 1.7; }

/* Cartes du processus métier : même hauteur, image propre et vrai lien d'action. */
.steps.five { display: grid !important; grid-template-columns: repeat(5, minmax(0, 1fr)); align-items: stretch; gap: 20px; }
.steps.five .process-card { display: flex; flex-direction: column; min-width: 0; height: 100%; overflow: hidden; border: 1px solid var(--tm-line); border-radius: var(--tm-radius); background: #fff; box-shadow: var(--tm-shadow); }
.steps.five .process-card .card-media { display: block; width: 100%; height: 205px; flex: 0 0 205px; object-fit: cover; object-position: center; }
.steps.five .process-card .card-inner { display: flex; flex: 1 1 auto; flex-direction: column; align-items: flex-start; padding: 20px 21px 22px; min-width: 0; }
.steps.five .process-card .icon.large { display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 18px; background: var(--tm-leaf); color: var(--tm-forest-2); margin-bottom: 15px; }
.steps.five .process-card h3 { margin: 0 0 10px; color: var(--tm-forest); font-size: 1.22rem; line-height: 1.2; }
.steps.five .process-card p { margin: 0; color: var(--tm-muted); line-height: 1.65; }
.process-card-link { display: inline-flex !important; align-items: center; gap: 8px; margin-top: auto; padding: 11px 14px; border-radius: 12px; background: var(--tm-leaf); color: var(--tm-forest) !important; font-weight: 800; text-decoration: none; }
.process-card-link:hover { background: var(--tm-leaf-strong); }

/* Section Découvrez le catalogue : bénéfices empilés, CTA en dessous, aucun chevauchement. */
.two.feature-split { display: grid !important; grid-template-columns: minmax(0, 1.02fr) minmax(320px, .98fr); align-items: center; gap: clamp(26px, 4vw, 58px); }
.feature-split > div { min-width: 0; }
.feature-split .heading { text-align: left; margin: 0 0 22px; }
.feature-split .heading h2 { max-width: 13ch; }
.feature-split .heading p { margin: 0; }
.feature-split .benefit-list { display: grid !important; grid-template-columns: minmax(0, 1fr); gap: 10px; margin: 20px 0 0; }
.feature-split .benefit-list .tick { display: flex; align-items: flex-start; gap: 11px; min-width: 0; padding: 12px 14px; border: 1px solid rgba(26,88,64,.08); border-radius: 15px; background: rgba(255,255,255,.68); color: var(--tm-ink); line-height: 1.45; }
.feature-split .benefit-list .tick svg { flex: 0 0 auto; margin-top: 1px; color: var(--tm-forest-2); }
.feature-split .actions { display: flex !important; margin-top: 22px; }
.catalogue-hero-stack { display: grid !important; grid-template-columns: minmax(0, 1fr); gap: 16px; align-content: center; min-width: 0; }
.catalogue-highlight { display: flex !important; flex-direction: row; align-items: center; gap: 18px; min-width: 0; padding: 18px; border: 1px solid var(--tm-line); border-radius: 22px; background: #fff; box-shadow: var(--tm-shadow); }
.catalogue-highlight img { display: block; flex: 0 0 112px; width: 112px; height: 112px; object-fit: contain; object-position: center; padding: 7px; border-radius: 17px; background: #f8f7f0; }
.catalogue-highlight > div { display: flex; flex-direction: column; align-items: flex-start; gap: 7px; min-width: 0; }
.catalogue-highlight strong { display: block; color: var(--tm-forest); font-size: 1.06rem; line-height: 1.35; }
.catalogue-highlight span { display: block; margin: 0; color: var(--tm-muted); line-height: 1.55; }

/* CTA : contenu et actions restent côte à côte sur PC et empilés sur mobile. */
.cta-section { padding-top: 16px !important; padding-bottom: clamp(28px, 4vw, 48px) !important; }
.cta-panel-wide { display: grid !important; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 28px; padding: clamp(26px, 3.5vw, 42px); border: 1px solid var(--tm-line); border-radius: 28px; background: linear-gradient(135deg, #fff 0%, #eef6ee 100%); box-shadow: var(--tm-shadow); }
.cta-panel-wide h2 { max-width: 22ch; margin: 12px 0; color: var(--tm-forest); font-size: clamp(1.8rem, 3vw, 2.75rem); line-height: 1.1; }
.cta-panel-wide p { max-width: 72ch; margin: 0; color: var(--tm-muted); line-height: 1.65; }
.cta-panel-wide .cta-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.cta-panel-wide .cta-actions .btn { min-height: 46px; padding: 12px 17px; border-radius: 14px; white-space: nowrap; }

/* Page Catalogue : filtres, recherche et cartes produits alignés. */
.pagehero.catalogue-hero { padding-block: clamp(36px, 4vw, 58px); }
.catalogue-hero .pagehero-grid { display: grid !important; grid-template-columns: minmax(0, 1.08fr) minmax(320px, .92fr); align-items: center; gap: clamp(24px, 4vw, 52px); }
.catalogue-hero h1 { max-width: 16ch; margin: 14px 0 18px; color: var(--tm-forest); font-size: clamp(2.45rem, 4.1vw, 4.1rem); line-height: 1.04; letter-spacing: -.03em; }
.catalogue-hero p { max-width: 65ch; color: var(--tm-muted); line-height: 1.7; }
.catalogue-hero .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; }
.catalog-tools.clean { display: grid !important; grid-template-columns: minmax(0, 1fr) minmax(240px, 340px); align-items: center; gap: 16px; padding: 16px; margin-bottom: 20px; border: 1px solid var(--tm-line); border-radius: 20px; background: #fff; box-shadow: var(--tm-shadow); }
.catalog-tools .filter-group { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; }
.catalog-tools .filter { min-height: 40px; padding: 9px 14px; border: 1px solid var(--tm-line); border-radius: 999px; background: #fff; color: var(--tm-forest); font-weight: 750; cursor: pointer; }
.catalog-tools .filter.active { background: var(--tm-forest); border-color: var(--tm-forest); color: #fff; }
.catalog-tools .search { display: flex; align-items: center; gap: 9px; min-width: 0; padding: 0 12px; border: 1px solid var(--tm-line); border-radius: 14px; background: #fff; color: var(--tm-muted); }
.catalog-tools .search input { width: 100%; min-width: 0; min-height: 44px; border: 0; outline: 0; background: transparent; }
.catalogue-intro-grid { display: grid !important; grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); gap: 16px; margin-bottom: 22px; }
.catalog-note.public-note { display: flex; align-items: flex-start; gap: 12px; padding: 18px; border: 1px solid var(--tm-line); border-radius: 18px; background: #fff; }
.catalog-note.public-note svg { flex: 0 0 auto; color: var(--tm-forest-2); margin-top: 2px; }
.catalog-note.public-note p { margin: 0; color: var(--tm-muted); line-height: 1.6; }
.catalog-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.catalog-metrics > div { display: flex; flex-direction: column; justify-content: center; min-width: 0; padding: 14px; border: 1px solid var(--tm-line); border-radius: 17px; background: #fff; text-align: center; }
.catalog-metrics strong { color: var(--tm-forest); font-size: 1.35rem; }
.catalog-metrics span { color: var(--tm-muted); font-size: .85rem; line-height: 1.4; }
.products-grid.expanded { display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; align-items: stretch; }
.products-grid.expanded .product-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border: 1px solid var(--tm-line); border-radius: 20px; background: #fff; box-shadow: var(--tm-shadow); }
.products-grid.expanded .product-image-wrap { position: relative; overflow: hidden; background: #f8f7f0; }
.products-grid.expanded .product-card img { display: block; width: 100%; height: 220px; object-fit: contain; padding: 12px; background: #fff; }
.products-grid.expanded .product-body { display: flex; flex: 1 1 auto; flex-direction: column; align-items: flex-start; padding: 18px; min-width: 0; }
.products-grid.expanded .product-body h3 { margin: 10px 0 8px; color: var(--tm-forest); font-size: 1.13rem; line-height: 1.3; }
.products-grid.expanded .product-desc, .products-grid.expanded .product-short { color: var(--tm-muted); line-height: 1.55; }
.products-grid.expanded .product-meta { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: baseline; margin-top: auto; padding-top: 12px; }
.products-grid.expanded .text-link { display: inline-flex; align-items: center; gap: 7px; margin-top: 14px; padding: 10px 13px; border-radius: 12px; background: var(--tm-leaf); color: var(--tm-forest) !important; font-weight: 800; text-decoration: none; }

/* Contact : formulaire et coordonnées équilibrés. */
.contact-section { padding-block: clamp(42px, 5vw, 70px); background: var(--tm-leaf); }
.contact-layout { display: grid !important; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: start; gap: clamp(20px, 3vw, 34px); }
.contact-card { min-width: 0; padding: clamp(18px, 2.5vw, 28px); border: 1px solid var(--tm-line); border-radius: 24px; background: #fff; box-shadow: var(--tm-shadow); }
.contact-card.rich { display: grid; gap: 15px; }
.contact-item { display: flex; align-items: flex-start; gap: 12px; min-width: 0; padding: 13px 0; border-bottom: 1px solid #edf0e9; }
.contact-item:last-of-type { border-bottom: 0; }
.contact-item svg { flex: 0 0 auto; color: var(--tm-forest-2); }
.contact-item strong { display: inline-block; margin-right: 6px; color: var(--tm-forest); }
.contact-item span { color: var(--tm-muted); overflow-wrap: anywhere; }
.contact-map-card { overflow: hidden; border: 1px solid var(--tm-line); border-radius: 20px; background: #fff; }
.contact-map-card img { display: block; width: 100%; height: 220px; object-fit: cover; }
.contact-map-card div { padding: 16px 18px; }
.contact-map-card h3 { margin: 0 0 8px; color: var(--tm-forest); }
.contact-form { display: grid; gap: 13px; }
.contact-form h3 { margin: 0 0 4px; color: var(--tm-forest); }
.contact-form label { display: grid; gap: 7px; color: var(--tm-forest); font-weight: 750; }
.contact-form input, .contact-form select, .contact-form textarea { box-sizing: border-box; width: 100%; min-width: 0; min-height: 46px; padding: 12px 14px; border: 1px solid #d6e1d6; border-radius: 13px; background: #fff; color: var(--tm-ink); font: inherit; }
.contact-form textarea { min-height: 140px; resize: vertical; }
.contact-form button { width: 100%; min-height: 48px; border-radius: 13px; }

/* Pied de page : logo et colonnes ne se chevauchent plus. */
.footer { margin-top: 0 !important; padding: 42px 0 36px; background: #eef5ef; color: var(--tm-forest); border-top: 1px solid var(--tm-line); }
.footer-grid { display: grid !important; grid-template-columns: minmax(0, 1.2fr) minmax(140px, .7fr) minmax(0, 1fr); align-items: start; gap: clamp(20px, 3vw, 42px); }
.footer-grid > * { min-width: 0; }
.footer-brand { display: flex !important; flex-direction: row !important; align-items: flex-start !important; gap: 14px; min-width: 0; max-width: 100%; }
.footer-brand img { display: block; flex: 0 0 58px; width: 58px; height: 58px; max-width: 58px; max-height: 58px; object-fit: contain; padding: 8px; border-radius: 17px; background: #fff; }
.footer-brand > div { min-width: 0; }
.footer-brand strong { display: block; margin-bottom: 7px; color: var(--tm-forest); }
.footer-brand p { max-width: 34ch; margin: 0; color: var(--tm-muted); line-height: 1.6; overflow-wrap: normal; word-break: normal; }
.footer h4 { margin: 0 0 13px; color: var(--tm-forest); }
.footer ul { display: grid; gap: 9px; padding: 0; margin: 0; list-style: none; color: var(--tm-muted); }
.footer a { color: var(--tm-forest); text-decoration: none; }
.footer a:hover { text-decoration: underline; }

/* Boutons et liens d'action cohérents sans changer les textes de contenu. */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; max-width: 100%; padding: 11px 18px; border-radius: 13px; font-weight: 800; line-height: 1.3; text-align: center; text-decoration: none; cursor: pointer; }
.btn.primary { background: var(--tm-forest-2); color: #fff; border: 1px solid var(--tm-forest-2); }
.btn.primary:hover { background: var(--tm-forest); box-shadow: 0 8px 22px rgba(16,76,53,.14); }
.btn.outline { background: #fff; color: var(--tm-forest); border: 1px solid #cbded0; }
.btn.outline:hover { background: var(--tm-leaf); }
:focus-visible { outline: 3px solid #d88b2c; outline-offset: 3px; }

@media (max-width: 1240px) {
  .header > .wrap.nav { width: calc(100% - 36px); gap: 10px; }
  .header .identity { max-width: 230px; }
  .header .nav-links a { padding-inline: 8px; font-size: .88rem; }
  .header .auth-actions .btn { padding-inline: 11px; font-size: .9rem; }
  .steps.five { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .products-grid.expanded { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 1080px) {
  .header > .wrap.nav { display: grid !important; grid-template-columns: minmax(0, 1fr) auto; width: calc(100% - 32px); min-height: 72px; gap: 12px; }
  .header .menu-toggle { display: inline-flex !important; grid-column: 2; grid-row: 1; align-items: center; justify-content: center; width: 44px; height: 44px; border: 1px solid var(--tm-line); border-radius: 12px; background: #fff; color: var(--tm-forest); }
  .header .nav-links { display: none !important; grid-column: 1 / -1; grid-row: 2; flex-direction: column !important; align-items: stretch; justify-content: flex-start; gap: 4px; padding: 10px 0 4px; }
  .header .nav-links.open { display: flex !important; }
  .header .nav-links a { justify-content: flex-start; width: 100%; min-height: 44px; padding: 11px 13px; white-space: normal; font-size: 1rem; }
  .header .nav-links .mobile-auth { display: inline-flex !important; }
  .header .auth-actions { display: none !important; }
  .hero .hero-grid, .catalogue-hero .pagehero-grid, .two.feature-split { grid-template-columns: minmax(0, 1fr); }
  .hero .hero-image { height: clamp(300px, 52vw, 480px); }
  .catalogue-hero-stack { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .contact-layout { grid-template-columns: minmax(0, 1fr); }
  .products-grid.expanded { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .catalogue-intro-grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 760px) {
  .header > .wrap.nav { width: calc(100% - 24px); }
  .header .identity { max-width: calc(100% - 56px); }
  .header .identity img { flex-basis: 40px; width: 40px; height: 40px; max-width: 40px; max-height: 40px; }
  .hero { padding-top: 34px; }
  .hero h1 { max-width: 100%; font-size: clamp(2.35rem, 8vw, 3.6rem); }
  .hero .hero-image { height: 300px; border-radius: 22px; }
  .hero .hero-highlights { grid-template-columns: minmax(0, 1fr); }
  .hero .actions { align-items: stretch; }
  .hero .actions .btn { width: 100%; }
  .steps.five { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .steps.five .process-card .card-media { height: 170px; flex-basis: 170px; }
  .steps.five .process-card .card-inner { padding: 16px; }
  .catalogue-hero-stack { grid-template-columns: minmax(0, 1fr); }
  .catalogue-highlight { gap: 13px; padding: 14px; }
  .catalogue-highlight img { flex-basis: 84px; width: 84px; height: 84px; }
  .catalog-tools.clean { grid-template-columns: minmax(0, 1fr); }
  .catalog-tools .search { width: 100%; box-sizing: border-box; }
  .catalog-metrics { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .cta-panel-wide { grid-template-columns: minmax(0, 1fr); }
  .cta-panel-wide .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-panel-wide .cta-actions .btn { width: 100%; white-space: normal; }
  .footer-grid { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 520px) {
  .section { padding-block: 36px; }
  .steps.five, .products-grid.expanded { grid-template-columns: minmax(0, 1fr); }
  .steps.five .process-card .card-media { height: 210px; flex-basis: 210px; }
  .products-grid.expanded .product-card img { height: 240px; }
  .catalog-metrics { grid-template-columns: minmax(0, 1fr); }
  .contact-card { padding: 16px; }
  .footer-brand img { flex-basis: 48px; width: 48px; height: 48px; max-width: 48px; max-height: 48px; }
}
/* === FIN LOT 10H === */
`;

function PatchStyle() {
  return <style>{patchStyles}</style>;
}

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    if (location.search.includes('contact=1')) {
      requestAnimationFrame(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }));
    } else if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash, location.search]);
  return null;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-cover" role="presentation" onMouseDown={(e) => e.currentTarget === e.target && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">
          <X size={18} />
        </button>
        <div className="modal-icon">
          <ShieldCheck size={28} />
        </div>
        <h3>{title}</h3>
        <div className="modal-content">{children}</div>
        <button type="button" className="btn primary" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="header">
      <div className="wrap nav">
        <Link to="/" className="identity" onClick={close}>
          <img src={asset('tomato-logo.svg')} alt="Logo tomate" />
          <span>
            <b>Tantsaha Miombona</b>
            <small>Production · Transformation · Distribution</small>
          </span>
        </Link>
        <button type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Navigation principale">
          <NavLink to="/" end onClick={close}><Home size={17} /> Accueil</NavLink>
          <NavLink to="/a-propos" onClick={close}><Info size={17} /> À propos</NavLink>
          <NavLink to="/catalogue" onClick={close}><ShoppingBasket size={17} /> Catalogue</NavLink>
          <Link to="/?contact=1" onClick={close}><Mail size={17} /> Contact</Link>
          <Link className="mobile-auth" to="/connexion" onClick={close}>Connexion</Link>
          <Link className="mobile-auth" to="/inscription" onClick={close}>Créer un compte</Link>
          <Link className="mobile-auth" to="/dashboard" onClick={close}>Tableau de bord</Link>
        </nav>
        <div className="auth-actions desktop-only">
          <Link className="btn outline dashboard-provisional" to="/dashboard">Tableau de bord</Link>
          <Link className="btn outline" to="/connexion">Connexion</Link>
          <Link className="btn primary" to="/inscription">Créer un compte</Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <div className="footer-brand">
            <img src={asset('tomato-logo.svg')} alt="Logo Tantsaha Miombona" />
            <div>
              <strong>Tantsaha Miombona</strong>
              <p>Valoriser les produits transformés issus de la filière tomate locale.</p>
            </div>
          </div>
        </div>
        <div>
          <h4>Accès rapide</h4>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/a-propos">À propos</Link></li>
            <li><Link to="/catalogue">Catalogue</Link></li>
            <li><Link to="/?contact=1">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Nous écrire</h4>
          <ul>
            <li><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></li>
            <li><a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}>{contactInfo.phone}</a></li>
            <li>{contactInfo.address}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function SectionTitle({ label, title, text }: { label: string; title: string; text?: string }) {
  return (
    <div className="heading">
      <span>{label}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function CTASection({ title, text, primaryLabel, primaryTo, secondaryLabel, secondaryTo }: { title: string; text: string; primaryLabel: string; primaryTo: string; secondaryLabel?: string; secondaryTo?: string }) {
  return (
    <section className="section cta-section">
      <div className="wrap cta-panel-wide">
        <div>
          <span className="eyebrow"><Leaf size={16} /> Passez à l’action</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-actions">
          <Link className="btn primary" to={primaryTo}>{primaryLabel} <ArrowRight size={18} /></Link>
          {secondaryLabel && secondaryTo ? <Link className="btn outline" to={secondaryTo}>{secondaryLabel}</Link> : null}
        </div>
      </div>
    </section>
  );
}

function CompactContactCTA({ title, text }: { title: string; text: string }) {
  return (
    <section className="section compact-contact-cta">
      <div className="wrap">
        <div className="compact-contact-card">
          <div>
            <span className="eyebrow"><Mail size={16} /> Besoin d’un échange rapide ?</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <div className="cta-actions">
            <Link className="btn primary" to="/?contact=1">Contacter l’équipe <ArrowRight size={18} /></Link>
            <Link className="btn outline" to="/catalogue">Voir le catalogue</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="section contact-section" id="contact">
      <div className="wrap">
        <SectionTitle
          label="Contact"
          title="Parlons de votre projet"
          text="Vous êtes producteur, point focal, distributeur ou partenaire ? Utilisez ce formulaire pour demander des informations sur les produits et les modalités de collaboration."
        />
        <div className="contact-layout">
          <div className="contact-card rich">
            <div className="contact-item"><Mail size={18} /><div><strong>E-mail</strong><span>{contactInfo.email}</span></div></div>
            <div className="contact-item"><Phone size={18} /><div><strong>Téléphone</strong><span>{contactInfo.phone}</span></div></div>
            <div className="contact-item"><MapPin size={18} /><div><strong>Adresse</strong><span>{contactInfo.address}</span></div></div>
            <div className="contact-map-card">
              <img src={asset('hero_unite_transformation.jpg')} alt="Unité de transformation" />
              <div>
                <h3>Unité de transformation</h3>
                <p>Accueil des partenaires, présentation des produits et échanges autour de la filière tomate locale.</p>
              </div>
            </div>
          </div>
          <div className="contact-card form-card">
            <h3>Envoyer un message</h3>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <label>Nom complet<input type="text" placeholder="Votre nom" /></label>
              <label>Adresse e-mail<input type="email" placeholder="nom@domaine.mg" /></label>
              <label>Objet<select defaultValue="Demande d'information"><option>Demande d'information</option><option>Adhésion producteur</option><option>Partenariat distribution</option><option>Catalogue produits</option></select></label>
              <label>Message<textarea rows={5} placeholder="Décrivez votre besoin ou votre projet..."></textarea></label>
              <button className="btn primary" type="submit">Envoyer la demande</button>
            </form>
            <p className="tiny-note">Exemple de formulaire public. Les envois réels seront activés lors du raccordement du service de messagerie.</p>
          </div>
        </div>
        <div className="social-panel">
          <div>
            <h3>Retrouvez-nous sur les réseaux</h3>
            <p>Les liens seront modifiables depuis le dashboard. Les couleurs illustrent chaque réseau social pour une présentation plus claire.</p>
          </div>
          <div className="social-list">
            {contactInfo.socials.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.name} href={item.href} className={`social-pill ${item.cls}`}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow"><Leaf size={16} /> Filière tomate · Madagascar</span>
            <h1>Une plateforme claire pour présenter, organiser et valoriser les produits de la filière tomate.</h1>
            <p>Tantsaha Miombona met en relation producteurs, points focaux, unité de transformation, distributeurs et consommateurs autour d’une même chaîne de valeur.</p>
            <div className="actions">
              <Link className="btn primary" to="/catalogue">Voir le catalogue <ArrowRight size={18} /></Link>
              <Link className="btn outline" to="/a-propos">Découvrir l’établissement</Link>
              <Link className="btn quiet" to="/inscription">Devenir membre</Link>
            </div>
            <div className="hero-highlights">
              <div><CheckCircle2 size={18} /> Produits transformés mieux présentés</div>
              <div><CheckCircle2 size={18} /> Parcours membres plus lisibles</div>
              <div><CheckCircle2 size={18} /> Contact rapide depuis l’accueil</div>
            </div>
          </div>
          <img className="hero-image" src={asset('hero_unite_transformation.jpg')} alt="Unité de transformation de tomates" />
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <SectionTitle
            label="Notre mission"
            title="Relier les acteurs d’une même filière"
            text="La plateforme aide à mieux comprendre le parcours des produits transformés et prépare les futurs espaces membres pour la gestion des commandes et informations métier."
          />
          <div className="info-grid four">
            <article className="info-card icon-strong"><Sprout size={30} /><h3>Producteurs</h3><p>Présenter les productions, les périodes et les volumes disponibles.</p></article>
            <article className="info-card icon-strong"><Users size={30} /><h3>Points focaux</h3><p>Coordonner les collectes, centraliser les échanges et préparer les flux.</p></article>
            <article className="info-card icon-strong"><Factory size={30} /><h3>Transformation</h3><p>Mettre en valeur les produits finis et la qualité de conditionnement.</p></article>
            <article className="info-card icon-strong"><ShoppingBasket size={30} /><h3>Marché</h3><p>Faciliter la découverte des gammes par les distributeurs et consommateurs.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionTitle
            label="Processus métier"
            title="De la récolte à la distribution"
            text="Une lecture simple des principales étapes de la chaîne de valeur, avec des visuels mieux alignés sur chaque étape."
          />
          <div className="steps five">
            {processSteps.map((step) => {
              const Icon = step.icon;
              const processTargets: Record<string, string> = {
                Production: '/a-propos#production-locale',
                Coordination: '/a-propos#coordination-flux',
                Collecte: '/a-propos#coordination-flux',
                Transformation: '/a-propos#transformation-locale',
                Distribution: '/catalogue',
              };
              const processTarget = processTargets[step.title] || '/a-propos';
              return (
                <article className="card process-card" key={step.title}>
                  <img className="card-media" src={step.image} alt={step.title} />
                  <div className="card-inner">
                    <span className="icon large"><Icon size={22} /></span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                    <Link className="text-link process-card-link" to={processTarget}>En savoir plus <ArrowRight size={16} /></Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap two feature-split">
          <div>
            <SectionTitle
              label="Produits transformés"
              title="Découvrez le catalogue"
              text="Une gamme illustrée avec des visuels dédiés, pensée pour présenter proprement les produits aux visiteurs."
            />
            <div className="benefit-list">
              <div className="tick"><PackageCheck size={18} /> Présentation claire de la gamme</div>
              <div className="tick"><ShieldCheck size={18} /> Lecture plus professionnelle pour les visiteurs</div>
              <div className="tick"><Mail size={18} /> Contact centralisé depuis l’accueil</div>
            </div>
            <div className="actions compact">
              <Link className="btn primary" to="/catalogue">Voir le catalogue <ArrowRight size={18} /></Link>
            </div>
          </div>
          <div className="catalogue-hero-stack">
            <article className="catalogue-highlight">
              <img src={catalogueAsset('sauce-tomate-artisanale.png')} alt="Sauce tomate artisanale" />
              <div><strong>Sélection du moment</strong><span>Des visuels dédiés pour chaque produit</span></div>
            </article>
            <article className="catalogue-highlight">
              <img src={catalogueAsset('tomates-sechees.png')} alt="Tomates séchées" />
              <div><strong>Gamme diversifiée</strong><span>Sauces, concentrés, épicerie fine</span></div>
            </article>
          </div>
        </div>
      </section>

      <CTASection
        title="Vous souhaitez acheter ou distribuer nos produits ?"
        text="Consultez les produits disponibles, découvrez les gammes et utilisez le formulaire de contact pour échanger avec l’équipe."
        primaryLabel="Découvrir le catalogue"
        primaryTo="/catalogue"
        secondaryLabel="Nous contacter"
        secondaryTo="/?contact=1"
      />

      <ContactSection />
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section className="pagehero">
        <div className="wrap pagehero-grid">
          <div>
            <span className="eyebrow"><Info size={16} /> À propos</span>
            <h1>Une vitrine plus claire pour l’établissement, les acteurs de la filière et les futurs membres.</h1>
            <p>Tantsaha Miombona présente la chaîne de valeur locale, la gamme de produits, les avantages du réseau et la manière d’interagir avec l’application avant l’ouverture complète du dashboard métier.</p>
            <div className="hero-highlights about-highlights">
              <div><CheckCircle2 size={18} /> Présentation de l’établissement</div>
              <div><CheckCircle2 size={18} /> Parcours membres expliqués</div>
              <div><CheckCircle2 size={18} /> Utilisation simple pour le public</div>
            </div>
          </div>
          <img src={asset('point_focal_producteurs.jpg')} alt="Rencontre entre acteurs de la filière" className="pagehero-image" />
        </div>
        <div className="wrap about-kpis">
          <article><strong>5</strong><span>étapes métier clairement illustrées</span></article>
          <article><strong>8</strong><span>produits transformés mis en vitrine</span></article>
          <article><strong>3</strong><span>familles de produits présentées</span></article>
          <article><strong>1</strong><span>point d’entrée public pour contacter l’équipe</span></article>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionTitle
            label="Présentation de l’établissement"
            title="Ce que la plateforme met en valeur aujourd’hui"
            text="Une page étudiée pour présenter l’activité, les avantages, le processus et les parcours membres sans répétition inutile."
          />
          <div className="about-pillars">
            <article id="production-locale">
              <img src={asset('producteurs_champ_tomate.jpg')} alt="Production locale" />
              <div className="content">
                <h3>Valoriser la production locale</h3>
                <p>Les producteurs membres sont au cœur de la plateforme. L’objectif est de rendre la filière plus visible, mieux organisée et mieux reliée au marché.</p>
              </div>
            </article>
            <article id="coordination-flux">
              <img src={asset('collecte_transport_tomate.jpg')} alt="Coordination et logistique" />
              <div className="content">
                <h3>Organiser les flux</h3>
                <p>Les points focaux, la collecte et la préparation logistique sont expliqués avec un langage clair pour aider les partenaires à comprendre le fonctionnement.</p>
              </div>
            </article>
            <article id="transformation-locale">
              <img src={asset('hero_unite_transformation.jpg')} alt="Unité de transformation" />
              <div className="content">
                <h3>Montrer la transformation</h3>
                <p>L’unité de transformation, les produits finis et leur distribution sont présentés de manière professionnelle pour renforcer la confiance des visiteurs.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap about-dual-grid">
          <div className="about-surface">
            <SectionTitle
              label="Avantages"
              title="Pourquoi la plateforme est utile ?"
              text="Elle sert de vitrine professionnelle aujourd’hui, puis de base de travail pour les services membres de demain."
            />
            <ul className="about-list">
              <li>Présenter les produits transformés avec des visuels dédiés et cohérents.</li>
              <li>Expliquer le rôle de chaque acteur : producteur, point focal, unité, distributeur, consommateur.</li>
              <li>Préparer les futurs parcours de précommandes, de suivi des lots, d’achats et d’historiques.</li>
              <li>Centraliser le contact public sur une seule section claire : la page d’accueil.</li>
            </ul>
          </div>
          <div className="about-surface">
            <SectionTitle
              label="Comment interagir avec l’application ?"
              title="Une navigation simple pour les visiteurs"
              text="Chaque page a un rôle précis afin de simplifier l’expérience utilisateur."
            />
            <ol className="numbered">
              <li><strong>Découvrir :</strong> parcourir l’accueil, la page à propos et le catalogue.</li>
              <li><strong>Comprendre :</strong> voir les produits, les avantages et le processus métier.</li>
              <li><strong>Contacter :</strong> utiliser le formulaire de l’accueil pour les demandes concrètes.</li>
              <li><strong>S’inscrire :</strong> préparer un parcours membre selon son profil.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionTitle
            label="Parcours membres"
            title="Comment devenir membre de la plateforme ?"
            text="Deux parcours principaux sont mis en avant dès la page À propos."
          />
          <div className="about-dual-grid">
            <article className="about-surface">
              <span className="eyebrow"><Sprout size={16} /> Producteurs · Points focaux</span>
              <h3>Rejoindre la plateforme comme acteur de terrain</h3>
              <ol className="numbered">
                <li>Créer un compte et choisir le profil « Producteur » ou « Point focal ».</li>
                <li>Renseigner la zone d’activité, les cultures, la période de disponibilité et les volumes.</li>
                <li>Soumettre la demande pour validation par l’équipe d’administration.</li>
                <li>Accéder ensuite aux modules de précommandes, de lots, de validations et d’historiques.</li>
              </ol>
            </article>
            <article className="about-surface">
              <span className="eyebrow"><ShoppingBasket size={16} /> Distributeurs · Consommateurs</span>
              <h3>Rejoindre la plateforme comme acheteur ou partenaire</h3>
              <ol className="numbered">
                <li>Consulter la gamme sur le catalogue public pour identifier les produits adaptés.</li>
                <li>Créer un compte membre et choisir le profil « Distributeur » ou « Consommateur ».</li>
                <li>Exprimer le besoin d’achat, d’approvisionnement ou de partenariat commercial.</li>
                <li>Retrouver ensuite ses commandes, situations d’achats et historiques dans l’espace membre.</li>
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <SectionTitle
            label="Lecture rapide"
            title="Du premier contact au futur espace membre"
            text="Un résumé visuel du parcours utilisateur."
          />
          <div className="about-journey">
            <article><strong>01</strong><h3>Découvrir</h3><p>Le visiteur parcourt l’accueil, À propos et le catalogue.</p></article>
            <article><strong>02</strong><h3>Choisir</h3><p>Il identifie son profil et comprend les avantages de la plateforme.</p></article>
            <article><strong>03</strong><h3>Contacter</h3><p>Il utilise la section contact de l’accueil pour demander des informations ou une adhésion.</p></article>
            <article><strong>04</strong><h3>Accéder</h3><p>Après validation, il retrouvera ses modules métier dans le dashboard adapté à son rôle.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-gallery">
          <div className="main-visual">
            <img src={asset('hero_unite_transformation.jpg')} alt="Transformation des produits" />
          </div>
          <div className="side-visual">
            <img src={catalogueAsset('confiture-tomates.png')} alt="Produit transformé" />
            <div className="copy">
              <span className="eyebrow"><PackageCheck size={16} /> Produits finis</span>
              <h3>Une gamme prête à être mieux distribuée</h3>
              <p>La page À propos renforce maintenant le lien entre l’établissement, le processus de production et la présentation des produits transformés.</p>
            </div>
          </div>
        </div>
      </section>

      <CompactContactCTA
        title="Une question sur les produits ou sur l’adhésion ?"
        text="Toutes les prises de contact publiques passent par la section contact de la page d’accueil, afin de garder une navigation propre et éviter les répétitions."
      />
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={catalogueAsset(product.image)} alt={product.name} />
        {product.highlight ? <span className="product-badge">{product.highlight}</span> : null}
      </div>
      <div className="product-body">
        <div className="product-topline">
          <span>{product.code}</span>
          <span className="pill">{product.category}</span>
        </div>
        <h3>{product.name}</h3>
        <p className="product-short">{product.short}</p>
        <p className="product-desc">{product.description}</p>
        <div className="product-meta"><strong>{product.price}</strong><span>{product.unit}</span></div>
        <Link to="/?contact=1" className="text-link">Demander ce produit <ArrowRight size={16} /></Link>
      </div>
    </article>
  );
}

function CataloguePage() {
  const [category, setCategory] = useState<string>('Tous');
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const byCategory = category === 'Tous' || product.category === category;
      const q = search.toLowerCase();
      const bySearch = !q || `${product.name} ${product.description} ${product.short}`.toLowerCase().includes(q);
      return byCategory && bySearch;
    });
  }, [category, search]);

  return (
    <>
      <section className="pagehero catalogue-hero">
        <div className="wrap pagehero-grid">
          <div>
            <span className="eyebrow"><ShoppingBasket size={16} /> Catalogue</span>
            <h1>Des produits transformés présentés de manière claire, cohérente et professionnelle.</h1>
            <p>Découvrez plusieurs gammes à base de tomate : sauces, conserves et produits d’épicerie transformés localement, chacun avec son propre visuel.</p>
            <div className="actions compact">
              <Link className="btn primary" to="/?contact=1">Demander les disponibilités</Link>
              <Link className="btn outline" to="/inscription">Devenir partenaire</Link>
            </div>
          </div>
          <div className="catalogue-hero-stack">
            <article className="catalogue-highlight">
              <img src={catalogueAsset('sauce-tomate-artisanale.png')} alt="Sauce tomate" />
              <div><strong>Sélection du moment</strong><span>Des visuels dédiés pour chaque produit</span></div>
            </article>
            <article className="catalogue-highlight">
              <img src={catalogueAsset('tomates-sechees.png')} alt="Tomates séchées" />
              <div><strong>Gamme diversifiée</strong><span>Sauces, conserves et épicerie fine</span></div>
            </article>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="wrap">
          <div className="catalog-tools clean">
            <div className="filter-group">
              {['Tous', 'Sauces', 'Conserves', 'Épicerie'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={category === item ? 'filter active' : 'filter'}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="search">
              <Search size={18} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit..." />
            </label>
          </div>
          <div className="catalogue-intro-grid">
            <div className="catalog-note public-note"><CheckCircle2 size={20} /><p>Catalogue public simplifié : pour connaître les quantités, conditions de commande ou livraisons, utilisez le contact de l’accueil.</p></div>
            <div className="catalog-metrics">
              <div><strong>{products.length}</strong><span>produits visibles</span></div>
              <div><strong>3</strong><span>familles de produits</span></div>
              <div><strong>100 %</strong><span>visuels dédiés au catalogue</span></div>
            </div>
          </div>
          {filtered.length ? (
            <div className="products-grid expanded">
              {filtered.map((product) => <ProductCard key={product.code} product={product} />)}
            </div>
          ) : (
            <div className="no-results">Aucun produit ne correspond à votre recherche.</div>
          )}
        </div>
      </section>

      <CompactContactCTA
        title="Besoin d’un devis, d’une commande ou d’un partenariat ?"
        text="Pour toute demande concrète, utilisez la section contact de l’accueil. Le catalogue reste une vitrine publique de la gamme présentée."
      />
    </>
  );
}

function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="auth-shell">
      <div className="wrap auth-grid">
        <div className="auth-visual">
          <span className="eyebrow"><UserPlus size={16} /> Espace membres</span>
          <h1>Préparez votre accès à la plateforme.</h1>
          <p>Les formulaires ci-dessous servent à présenter le parcours. L’intégration avec les vrais comptes membres sera activée après validation des pages publiques et des flux métier.</p>
          <img src={asset('producteurs_champ_tomate.jpg')} alt="Producteurs dans un champ de tomates" />
        </div>
        <div className="auth-panel">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

function LoginPage() {
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  return (
    <>
      <AuthLayout title="Se connecter" subtitle="Accédez à votre espace membre dès l’activation de l’authentification sécurisée.">
        <form className="simple-form" onSubmit={(e) => { e.preventDefault(); setModal(true); }}>
          <label>Adresse e-mail<input type="email" placeholder="nom@domaine.mg" required /></label>
          <label>Mot de passe
            <div className="password-wrap">
              <input type={show ? 'text' : 'password'} placeholder="Votre mot de passe" required />
              <button type="button" onClick={() => setShow(!show)} aria-label="Afficher ou masquer le mot de passe">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </label>
          <p className="tiny-note inline"><LockKeyhole size={16} /> Démonstration frontend : aucune donnée n’est enregistrée.</p>
          <button className="btn primary" type="submit">Continuer</button>
        </form>
        <div className="auth-links">
          <Link to="/inscription">Créer un compte</Link>
          <Link to="/dashboard">Voir le dashboard</Link>
          <Link to="/?contact=1">Contacter l’équipe</Link>
        </div>
      </AuthLayout>
      <Modal open={modal} onClose={() => setModal(false)} title="Connexion bientôt disponible">
        <p>L’interface est prête, mais la connexion réelle sera activée lors du raccordement sécurisé avec le backend et la base membres.</p>
      </Modal>
    </>
  );
}

function RegistrationPage() {
  const [role, setRole] = useState('Producteur');
  const [modal, setModal] = useState(false);
  const roles = ['Producteur', 'Point focal', 'Distributeur', 'Consommateur'];
  return (
    <>
      <AuthLayout title="Créer un compte" subtitle="Choisissez votre profil pour découvrir le futur parcours d’adhésion.">
        <form className="simple-form" onSubmit={(e) => { e.preventDefault(); setModal(true); }}>
          <label>Profil
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {roles.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>Nom complet<input type="text" placeholder="Votre nom" required /></label>
          <label>Adresse e-mail<input type="email" placeholder="nom@domaine.mg" required /></label>
          <label>Téléphone<input type="text" placeholder="034 00 000 00" /></label>
          <button className="btn primary" type="submit">Préparer mon inscription</button>
        </form>
        <div className="auth-links">
          <Link to="/connexion">J’ai déjà un compte</Link>
          <Link to="/?contact=1">Questions sur l’adhésion</Link>
        </div>
      </AuthLayout>
      <Modal open={modal} onClose={() => setModal(false)} title={`Parcours ${role}`}>
        <p>Le formulaire public est prêt. Les validations, droits d’accès et créations réelles de compte seront activés après la finalisation des écrans frontend et du dashboard.</p>
      </Modal>
    </>
  );
}

function DashboardPage() {
  const modules = [
    { icon: BarChart3, title: 'Vue d’ensemble', text: 'Indicateurs, tableaux de bord et activités récentes.' },
    { icon: ClipboardList, title: 'Précommandes', text: 'Préparer les demandes et suivre les validations.' },
    { icon: Package, title: 'Lots & stocks', text: 'Suivi des lots, états de stocks et disponibilités.' },
    { icon: ShoppingBasket, title: 'Achats & ventes', text: 'Commandes, historiques et situations de paiement.' },
    { icon: Users, title: 'Membres', text: 'Profils producteurs, points focaux et distributeurs.' },
    { icon: Factory, title: 'Transformation', text: 'Suivi des produits transformés et de leur mise à disposition.' },
  ];
  return (
    <section className="section dashboard-preview">
      <div className="wrap">
        <SectionTitle
          label="Dashboard"
          title="Aperçu du futur espace membre"
          text="Le dashboard ci-dessous présente la structure attendue après intégration complète des parcours, commandes, historiques et rapports."
        />
        <div className="dashboard-summary">
          <div><strong>—</strong><span>Commandes</span></div>
          <div><strong>—</strong><span>Précommandes</span></div>
          <div><strong>—</strong><span>Lots</span></div>
          <div><strong>—</strong><span>Membres</span></div>
        </div>
        <div className="dashboard-grid">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="dashboard-card">
                <span className="icon large"><Icon size={22} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
        <CompactContactCTA
          title="Vous voulez voir les produits avant l’ouverture des services membres ?"
          text="Le catalogue public reste le meilleur point d’entrée pour découvrir les produits actuellement présentés."
        />
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter basename={ROUTER_BASE}>
      <PatchStyle />
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/admin-parametres" element={<ParametresAdminV03 />} />
          <Route path="/catalogue-dynamique" element={<CatalogueSqlitePublicV03 />} />
          <Route path="/gestion-produits-sqlite" element={<ProduitsSqliteAdminV03 />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegistrationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
