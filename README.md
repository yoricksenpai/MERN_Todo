# MERN Todo Application 🚀

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)]
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)]
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)]

## 📖 Description

MERN Todo est une application moderne de gestion de tâches construite avec la stack MERN (MongoDB, Express, React, Node.js) entièrement en TypeScript. L'application utilise Vite pour un développement frontend rapide et offre des fonctionnalités avancées de gestion de tâches avec notifications push.

## ✨ Fonctionnalités principales

### 🎯 Gestion des tâches
- ✅ CRUD complet pour les tâches (Créer, Lire, Mettre à jour, Supprimer)
- 📅 Gestion des dates d'échéance
- 🏷️ Catégorisation des tâches
- ✔️ Marquage des tâches comme terminées/non terminées
- 📝 Descriptions détaillées des tâches

### 📁 Organisation avancée
- 🗂️ CRUD complet pour les catégories
- 📋 CRUD complet pour les listes de tâches
- 👥 Partage de listes avec d'autres utilisateurs
- 🔐 Gestion des permissions (lecture/écriture)

### 🔍 Tri et filtrage
- 📆 Tri par date d'échéance
- 🔤 Tri alphabétique
- 🏷️ Tri par catégories
- ✅ Filtrage par état (terminées/non terminées)
- 📋 Filtrage par liste de tâches

### 🔔 Notifications et rappels
- 🌐 Notifications push web (PWA)
- ⏰ Rappels automatiques programmés
- 🔧 Configuration VAPID pour les notifications
- 📱 Service Worker intégré

### 🔐 Authentification et sécurité
- 🔑 Authentification JWT
- 🛡️ Middleware de sécurité
- 🔒 Protection des routes
- 🍪 Gestion des cookies sécurisés

## 🛠️ Stack technique

### Frontend
- **React 18** avec TypeScript
- **Vite 5** pour le build et le développement
- **Tailwind CSS** pour le styling
- **React Router 6** pour la navigation
- **React Hot Toast** pour les notifications
- **Lucide React** pour les icônes

### Backend
- **Node.js** avec Express et TypeScript
- **MongoDB** avec Mongoose
- **JWT** pour l'authentification
- **bcrypt** pour le hashage des mots de passe
- **Web Push** pour les notifications
- **node-cron** pour les tâches planifiées
- **CORS** configuré pour la sécurité

### Déploiement
- **Vercel** pour le frontend et backend
- **MongoDB Atlas** pour la base de données
- Configuration **serverless** optimisée

## 🚀 Installation et configuration

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Compte MongoDB Atlas
- Compte Vercel (optionnel pour le déploiement)

### 1. Cloner le repository
```bash
git clone https://github.com/yoricksenpai/MERN_Todo.git
cd MERN_Todo
```

### 2. Configuration du Backend

#### Installation des dépendances
```bash
cd backend
npm install
```

#### Génération des clés VAPID
```bash
npx web-push generate-vapid-keys
```

#### Configuration des variables d'environnement
Créez un fichier `.env` dans le dossier `backend` :

```env
# Base de données
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Notifications Push (VAPID Keys)
PUBLIC_VAPID_KEY=votre_cle_publique_vapid
PRIVATE_VAPID_KEY=votre_cle_privee_vapid

# Environnement
NODE_ENV=development
```

#### Démarrage du serveur de développement
```bash
npm run dev
```
Le backend sera accessible sur `http://localhost:3000`

### 3. Configuration du Frontend

#### Installation des dépendances
```bash
cd ..
npm install
```

#### Démarrage du serveur de développement
```bash
npm run dev
```
Le frontend sera accessible sur `http://localhost:5173`

## 🏗️ Structure du projet

```
MERN_Todo/
├── 📁 backend/                    # Serveur Express TypeScript
│   ├── 📁 config/                 # Configuration DB et autres
│   │   └── dbConfig.ts            # Configuration MongoDB
│   ├── 📁 middlewares/            # Middlewares Express
│   │   ├── authMiddleware.ts      # Authentification JWT
│   │   ├── errorHandler.ts       # Gestion des erreurs
│   │   └── validation.ts          # Validation des données
│   ├── 📁 models/                 # Modèles Mongoose
│   │   ├── userModel.ts           # Modèle utilisateur
│   │   ├── taskModel.ts           # Modèle tâche et liste
│   │   ├── categoryModel.ts       # Modèle catégorie
│   │   └── notificationsModel.ts  # Modèle notifications
│   ├── 📁 routes/                 # Routes API
│   │   ├── authRoutes.ts          # Authentification
│   │   ├── taskRoutes.ts          # Gestion des tâches
│   │   ├── taskListRoutes.ts      # Gestion des listes
│   │   └── categoryRoutes.ts      # Gestion des catégories
│   ├── 📁 schedulers/             # Tâches planifiées
│   │   └── reminderScheduler.ts   # Rappels automatiques
│   ├── 📁 utils/                  # Utilitaires
│   │   └── notificationService.ts # Service notifications
│   ├── 📁 types/                  # Types TypeScript
│   │   └── index.ts               # Définitions de types
│   ├── index.ts                   # Point d'entrée serveur
│   ├── package.json               # Dépendances backend
│   ├── tsconfig.json              # Config TypeScript
│   └── vercel.json                # Config déploiement Vercel
├── 📁 src/                        # Application React TypeScript
│   ├── 📁 api/                    # Services API
│   │   ├── auth.ts                # API authentification
│   │   ├── task.ts                # API tâches
│   │   ├── tasklist.ts            # API listes
│   │   └── category.ts            # API catégories
│   ├── 📁 components/             # Composants React
│   │   ├── 📁 ui/                 # Composants UI de base
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   ├── Header.tsx             # En-tête navigation
│   │   ├── Footer.tsx             # Pied de page
│   │   ├── TaskComponent.tsx      # Composant tâche
│   │   ├── FormComponent.tsx      # Formulaires
│   │   ├── FilterComponent.tsx    # Filtres et tri
│   │   └── Notifications.tsx      # Système notifications
│   ├── 📁 contexts/               # Contextes React
│   │   ├── AuthContext.tsx        # Contexte authentification
│   │   └── UserContext.tsx        # Contexte utilisateur
│   ├── 📁 pages/                  # Pages de l'application
│   │   ├── MainPage.tsx           # Page principale
│   │   ├── CreateTaskPage.tsx     # Création de tâches
│   │   ├── EditTaskPage.tsx       # Édition de tâches
│   │   ├── AddListPage.tsx        # Création de listes
│   │   ├── ManageCategoriesPage.tsx # Gestion catégories
│   │   └── 📁 auth/
│   │       └── LoginAndRegister.tsx # Authentification
│   ├── 📁 hooks/                  # Hooks personnalisés
│   │   └── useAsync.ts            # Hook async
│   ├── 📁 utils/                  # Utilitaires frontend
│   │   ├── toast.ts               # Notifications toast
│   │   ├── cache.ts               # Gestion du cache
│   │   └── UserUtils.ts           # Utilitaires utilisateur
│   ├── 📁 types/                  # Types TypeScript partagés
│   │   └── index.ts
│   ├── App.tsx                    # Composant racine
│   ├── main.tsx                   # Point d'entrée React
│   └── index.css                  # Styles globaux
├── 📁 public/                     # Fichiers statiques
│   └── service-worker.js          # Service Worker PWA
├── package.json                   # Dépendances frontend
├── vite.config.js                 # Configuration Vite
├── tailwind.config.js             # Configuration Tailwind
├── tsconfig.json                  # Config TypeScript frontend
├── vercel.json                    # Configuration déploiement
└── README.md                      # Documentation
```

## 🌐 Déploiement

### Déploiement automatique avec Vercel

1. **Connectez votre repository à Vercel**
2. **Configurez les variables d'environnement** dans le dashboard Vercel
3. **Le déploiement se fait automatiquement** à chaque push

### Variables d'environnement pour la production
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
PUBLIC_VAPID_KEY=...
PRIVATE_VAPID_KEY=...
NODE_ENV=production
```

### URLs de déploiement
- **Frontend**: `https://mern-todo-chi-gold.vercel.app`
- **Backend API**: `https://mern-todo-backend-psi.vercel.app`

## 📚 Scripts disponibles

### Frontend
```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Aperçu du build
npm run lint     # Linting ESLint
```

### Backend
```bash
npm run dev      # Serveur de développement avec hot-reload
npm start        # Serveur de production
npm run build    # Pas de build nécessaire (Vercel gère TypeScript)
```

## 🔧 Configuration avancée

### Notifications Push
1. Générez les clés VAPID avec `npx web-push generate-vapid-keys`
2. Ajoutez les clés dans votre `.env`
3. Le service worker est automatiquement enregistré
4. Les notifications fonctionnent en HTTPS uniquement

### Base de données MongoDB
1. Créez un cluster sur MongoDB Atlas
2. Configurez l'accès réseau (0.0.0.0/0 pour Vercel)
3. Créez un utilisateur avec les permissions lecture/écriture
4. Utilisez l'URI de connexion dans `MONGO_URI`

## 🐛 Dépannage

### Problèmes courants

#### Erreur 404 sur l'API
- Vérifiez que le backend est déployé et accessible
- Contrôlez la configuration CORS
- Vérifiez les URLs dans `vite.config.js`

#### Notifications ne fonctionnent pas
- Vérifiez les clés VAPID
- Assurez-vous d'être en HTTPS
- Vérifiez que le service worker est enregistré

#### Problèmes de build TypeScript
- Vérifiez la cohérence des extensions d'imports (.ts)
- Contrôlez la configuration `tsconfig.json`
- Vérifiez les types et dépendances

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 👨‍💻 Auteur

**Yorick Senpai**
- GitHub : [https://github.com/yoricksenpai](https://github.com/yoricksenpai)
- LinkedIn : [https://www.linkedin.com/in/johan-yorick-priso-1ba271285/](https://www.linkedin.com/in/johan-yorick-priso-1ba271285/)

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [React](https://reactjs.org/) pour l'interface utilisateur
- [Vite](https://vitejs.dev/) pour les outils de développement
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Express.js](https://expressjs.com/) pour le serveur backend
- [MongoDB](https://www.mongodb.com/) pour la base de données
- [Vercel](https://vercel.com/) pour l'hébergement

---

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !

## 📈 Version

**Version actuelle**: 1.0.0

### Changelog
- **v1.0.0** : Version initiale avec toutes les fonctionnalités de base
  - CRUD complet pour tâches, catégories et listes
  - Authentification JWT
  - Notifications push
  - Interface responsive
  - Déploiement Vercel optimisé
