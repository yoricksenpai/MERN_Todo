# TodoApp-Vite React

## Description

TodoApp-Vite React est une application de gestion de tâches (todolist) basée sur la stack MERN (MongoDB, Express, React, Node.js) avec un frontend assisté par Vite. Cette application offre des fonctionnalités CRUD (Create, Read, Update, Delete) pour les tâches, les catégories et les listes de tâches, ainsi que des options de tri avancées.

## Fonctionnalités principales

- CRUD de tâches
- CRUD de catégories
- CRUD de listes de tâches
- Tri des tâches par :
  - Date d'échéance
  - Ordre alphabétique
  - Catégories
  - État (terminées ou non terminées)
  - Liste de tâches

## Prérequis techniques

- Node.js
- MongoDB
- npm ou yarn

## Installation

### Backend

1. Naviguez vers le dossier backend :
   ```
   cd backend
   ```
2. Installez les dépendances :
   ```
   npm install
   ```
3. Générez les clés VAPID :
   ```
   npx web-push generate-vapid-keys
   ```
4. Créez un fichier `.env` dans le dossier backend et ajoutez les variables suivantes :
   ```
   PRIVATE_VAPID_KEY=<votre_clé_privée_générée>
   PUBLIC_VAPID_KEY=<votre_clé_publique_générée>
   JWT_SECRET=<votre_secret_jwt>
   MONGO_URI=<votre_uri_mongodb_atlas>
   ```

### Frontend

1. Naviguez vers le dossier racine du projet (si vous êtes dans le dossier backend) :
   ```
   cd ..
   ```
2. Installez les dépendances :
   ```
   npm install
   ```

## Structure du projet

```
.
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── schedulers/
│   ├── utils/
│   └── index.js
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── constants/
│   ├── contexts/
│   ├── utils/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
└── README.md
```

## Utilisation

[Ajoutez ici les instructions pour démarrer et utiliser l'application]

## Auteur

Écrit par yoricksenpai

- GitHub : [https://github.com/yoricksenpai](https://github.com/yoricksenpai)
- LinkedIn : [https://www.linkedin.com/in/johan-yorick-priso-1ba271285/](https://www.linkedin.com/in/johan-yorick-priso-1ba271285/)

## Version

0.0.0

## Licence
