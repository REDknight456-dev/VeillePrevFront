# VeillePrevFront

Frontend Vue.js pour la veille préventive juridique - un système de gestion des termes juridiques et des lois.

## Fonctionnalités

- 🏠 **Page d'accueil** : Vue d'ensemble avec statistiques et état de connexion au backend
- 📚 **Gestion des termes juridiques** : Ajout, affichage et gestion des termes juridiques avec catégorisation
- ⚖️ **Gestion des lois** : Ajout, affichage et gestion des lois avec métadonnées complètes
- 🔗 **Connexion backend** : API RESTful vers le backend sur le port 9090
- 📱 **Interface responsive** : Design moderne et adaptatif

## Architecture technique

- **Framework** : Vue.js 3 avec Composition API
- **Routage** : Vue Router 4
- **Build Tool** : Vite
- **HTTP Client** : Axios
- **Styling** : CSS vanilla avec design responsive

## Installation et lancement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

## Configuration Backend

L'application se connecte à un backend REST API sur `http://localhost:9090/api`.

Les endpoints attendus sont :
- `GET/POST/PUT/DELETE /api/juridical-terms` : Gestion des termes juridiques
- `GET/POST/PUT/DELETE /api/laws` : Gestion des lois

## Structure des données

### Terme juridique
```json
{
  "id": "number",
  "term": "string",
  "definition": "string", 
  "category": "droit-civil|droit-penal|droit-commercial|droit-administratif|autre"
}
```

### Loi
```json
{
  "id": "number",
  "title": "string",
  "reference": "string",
  "description": "string",
  "domain": "protection-donnees|droit-travail|droit-commercial|droit-civil|droit-penal|droit-administratif|autre",
  "effectiveDate": "date",
  "status": "en-vigueur|abroge|modifie|projet"
}
```

## Pages disponibles

- `/` : Page d'accueil avec statistiques
- `/juridical-terms` : Gestion des termes juridiques
- `/laws` : Gestion des lois