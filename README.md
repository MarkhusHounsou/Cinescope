# 🎬 CinéScope

CinéScope est une Single Page Application (SPA) vitrine, développée dans le cadre d'un portfolio étudiant pour démontrer une maîtrise de React et de l'intégration d'API REST.

L'application offre une expérience premium, sombre et immersive, dédiée à la découverte de films via l'API The Movie Database (TMDB).

## ✨ Fonctionnalités et Aperçu

- **Catalogue Dynamique :** Films triés par popularité, notes, mieux notés, et sorties récentes.
- **Filtres Avancés :** Tri par année, genres, notes, avec pagination infinie (Intersection Observer).
- **Recherche en temps réel :** Barre de recherche avec système de *debouncing* pour limiter les requêtes.
- **Roulette Cinématographique ("Aléatoire") :** Une page dédiée permettant de sélectionner des critères et de trouver des pépites aléatoires.
- **Modale de Détails :** Aperçu approfondi avec trailer/synopsis via une route/modal accessible. 
- **Design Premium & Cinématographique :** Palette très spécifique (Noir bordeaux, accent Rouge sanguin, texte Blanc Rosé), UI *glassmorphism* et micro-interactions fluides.

## 🛠 Stack Technique

- **React 18**
- **Vite**
- **React Router v6**
- **CSS Modules** (zéro dépendance esthétique, pur Vanilla CSS)
- **Context API** (pour la gestion des filtres)

## 🚀 Installation & Lancement

1. **Prérequis:** Assurez-vous d'avoir Node.js (version 18 ou supérieure) installé.

2. **Cloner le repository:**
   ```bash
   git clone https://github.com/votre-profil/cinescope.git
   cd cinescope
   ```

3. **Installer les dépendances:**
   ```bash
   npm install
   ```

4. **Configurer la variable d'environnement:**
   Le projet contient déjà le fichier `.env.local` pour définir la clé API TMDB :
   ```env
   VITE_TMDB_KEY=votre_cle_api_tmdb
   ```

5. **Lancer l'application en développement:**
   ```bash
   npm run dev
   ```

L'application sera accessible (généralement) sur `http://localhost:5173/`.

## 📁 Structure du Projet

```text
cinescope/
├── src/
│   ├── api/          # Configuration et fonctions fetch de l'API TMDB
│   ├── components/   # Composants réutilisables (Layout, Movies, Random)
│   ├── context/      # Context Provider (ex: FiltersContext)
│   ├── hooks/        # Custom hooks (InfiniteScroll, Debounce, Fetching)
│   ├── pages/        # Views principales connectées au Routeur
│   └── styles/       # Variables, global et animations génériques
└── ...
```

## 📜 Crédits

Les données et images de films sont fournies par [TMDB (The Movie Database)](https://www.themoviedb.org/). Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.

**Auteur :** [Votre Nom/Portfolio]
