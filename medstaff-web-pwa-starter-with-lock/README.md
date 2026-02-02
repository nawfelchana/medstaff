# MedStaff Web (PWA) – Starter (Next.js + Supabase)

Objectif: **site web** qui fonctionne comme une **application installable** (PWA) sur Android/iPhone **sans Play Store / App Store**.
Les utilisateurs ouvrent `app.medstaff.pro` et installent via:
- Android/Chrome: bouton **Installer**
- iPhone/Safari: **Partager → Sur l’écran d’accueil**

Ce starter inclut:
- Auth (email + mot de passe) via Supabase
- 2 espaces: Patient / Pro
- Dossier patient (table `patient_medical_record`)
- RDV (table `appointments`)
- Posts pro (table `posts`) — version minimale
- **PWA**: manifest + service worker (basique) pour rendre l’app installable

> ⚠️ Santé: ajoute ensuite audit, logs d’accès, chiffrement docs, modération, sauvegardes, monitoring.

## 1) Créer Supabase
1) Crée un projet Supabase.
2) Dans SQL editor: exécute `supabase/schema.sql`.
3) Récupère: SUPABASE_URL et SUPABASE_ANON_KEY.

## 2) Lancer en local
```bash
npm i
cp .env.example .env.local
# renseigne NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## 3) Déployer (Vercel recommandé)
- Mets ce repo sur GitHub
- Vercel → New Project → Import GitHub repo
- Ajoute les variables d’environnement
- Deploy

Docs PWA Next.js: https://nextjs.org/docs/app/guides/progressive-web-apps
