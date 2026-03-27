# IvorioCI 🎬

> Plateforme de streaming vidéo dédiée au contenu ivoirien et africain.

**Challenge 14-14-14 — Jour 13 — Mars 2026**

---

## 📺 Aperçu

IvorioCI est une plateforme de streaming inspirée de Netflix, dédiée au cinéma
et aux contenus audiovisuels de Côte d'Ivoire. Films, séries, documentaires —
tout le contenu ivoirien en un seul endroit.

---

## ✨ Fonctionnalités

- 🎬 **Catalogue complet** — Films CI, Séries, Documentaires, Tendances
- ▶️ **Player vidéo** — Contrôles complets, vitesse, qualité, progression
- 🔍 **Recherche** — Par titre, description ou genre
- ⏯️ **Reprendre le visionnage** — Continue là où tu t'es arrêté
- ★ **Ma liste** — Sauvegarde tes vidéos à regarder plus tard
- 👤 **Multi-profils** — Profils adulte et enfant
- 🔐 **Authentification** — Login / Register avec JWT
- 🇨🇮 **Design CI** — Couleurs orange et vert ivoirien
- 📱 **Responsive** — Adapté mobile et desktop

---

## 🛠️ Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React.js + Vite |
| State | Zustand |
| Routing | React Router v6 |
| HTTP | Axios |
| Style | CSS-in-JS + Tailwind |
| Backend | Go (Microservices) |
| Recommandations | Python |
| API Gateway | Node.js |
| Streaming | HLS |
| Conteneurisation | Docker + Nginx |

---

## 🏗️ Architecture
```
src/
├── components/
│   ├── Navbar.jsx          → Navigation principale
│   ├── VideoCard.jsx       → Carte vidéo avec progression
│   ├── CategoryRow.jsx     → Ligne de vidéos scrollable
│   └── FlagBar.jsx         → Barre drapeau CI
├── pages/
│   ├── LoginPage.jsx       → Connexion
│   ├── RegisterPage.jsx    → Inscription
│   ├── HomePage.jsx        → Accueil + Hero + Catégories
│   ├── PlayerPage.jsx      → Lecteur vidéo
│   ├── CataloguePage.jsx   → Catalogue avec filtres
│   ├── WatchListPage.jsx   → Ma liste
│   └── AboutPage.jsx       → À propos
├── store/
│   ├── useVideoStore.js    → État vidéos, watchlist, historique
│   └── usePlayerStore.js   → État lecteur
├── services/
│   └── api.js              → Appels API avec Axios
├── data/
│   └── mockData.js         → Données fictives ivoiriennes
└── App.jsx                 → Routing principal
```

---

## 🚀 Installation

### Prérequis

- Node.js 20+
- npm 9+

### Lancer en développement
```bash
# Cloner le repo
git clone https://github.com/bath01/14challenge-ivorioci-frontend.git
cd 14challenge-ivorioci-frontend

# Installer les dépendances
npm install

# Lancer
npm run dev
```

Ouvre `http://localhost:5173`

### Variables d'environnement

Crée un fichier `.env` à la racine :
```env
VITE_API_URL=https://api.ivorioci.chalenge14.com
```

---

## 🐳 Docker

### Build et lancement
```bash
# Build l'image
docker build -t ivorioci-frontend .

# Lancer le conteneur
docker run -p 80:80 ivorioci-frontend
```

Ouvre `http://localhost`

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.ivorioci.chalenge14.com
    restart: unless-stopped
```
```bash
docker-compose up -d
```

---

## 🌐 API

Base URL : `https://api.ivorioci.chalenge14.com`

| Endpoint | Méthode | Auth | Description |
|---|---|---|---|
| `/auth/login` | POST | ❌ | Connexion |
| `/auth/register` | POST | ❌ | Inscription |
| `/videos` | GET | ✅ | Liste des vidéos |
| `/videos/:id` | GET | ✅ | Détail d'une vidéo |
| `/videos/:id/stream` | GET | ✅ | Stream HLS |
| `/videos/search` | GET | ✅ | Recherche |
| `/profiles` | GET | ✅ | Liste des profils |
| `/watchlist` | GET | ✅ | Ma liste |
| `/watchlist/:id` | POST | ✅ | Ajouter à la liste |
| `/watchlist/:id` | DELETE | ✅ | Retirer de la liste |

---

## 👥 Équipe

| Nom | Rôle |
|---|---|
| Bath Dorgeles | Chef de projet & Front-end |
| Oclin Marcel C. | Dev Front-end (React.js) |
| Rayane Irie | Back-end (Go + Python + Node.js) |

---

## 📄 Licence

Open Source · [225os.com](https://225os.com) & [GitHub](https://github.com/bath01)

---

*14-14-14 // JOUR 13 // MARS 2026*
