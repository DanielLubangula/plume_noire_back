# API Plume Noire - Documentation Complète

## 📋 Table des matières

### 🔐 Endpoints Admin (Authentification requise)
- [**Authentification Admin**](./admin/auth.md) - Login, profil, first-setup
- [**Gestion des Livres**](./admin/books.md) - CRUD livres, upload fichiers
- [**Gestion des Actualités**](./admin/actus.md) - CRUD actualités, upload images
- [**Profil Auteur**](./admin/profile.md) - Gestion profil public, réseaux sociaux
- [**Dashboard**](./admin/dashboard.md) - Métriques et statistiques

### 🌐 Endpoints Publics (Aucune authentification)
- [**Page d'Accueil**](./public/home.md) - Informations auteur + livres mis en avant
- [**Biographie**](./public/bio.md) - Profil public de l'auteur
- [**Livres**](./public/books.md) - Téléchargement livres gratuits
- [**Actualités**](./public/actus.md) - Liste et détail des actualités
- [**Réseaux Sociaux**](./public/socials.md) - Liens sociaux publics

---

## 🔧 Configuration Générale

### Base URL
```
http://localhost:5000
```

### Format des Réponses
Toutes les réponses suivent ce format JSON uniforme :

**Succès :**
```json
{
  "status": "success",
  "data": { ... },
  "message": "..." // optionnel
}
```

**Erreur :**
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Description de l'erreur"
}
```

### Authentification Admin
Les endpoints admin nécessitent un token JWT dans le header :
```
Authorization: Bearer <JWT_TOKEN>
```

Le token est obtenu via `/api/admin/login` et est valide 7 jours.

### Upload de Fichiers
Les endpoints supportant l'upload utilisent `multipart/form-data` :
- **Images** : JPG, PNG, WebP (max 10MB)
- **PDF** : Fichiers PDF uniquement (max 50MB)
- **Stockage** : Cloudinary (URLs sécurisées)

### Rate Limiting
- **Admin login** : 5 tentatives / 15 min par IP
- **First-setup** : 3 tentatives / 15 min par IP
- **Endpoints publics** : Pas de limite actuellement

### Codes de Statut HTTP
- `200` - Succès
- `201` - Créé avec succès
- `400` - Erreur de validation
- `401` - Non authentifié
- `403` - Accès interdit
- `404` - Ressource non trouvée
- `500` - Erreur serveur

---

## 🚀 Démarrage Rapide

### 1. Premier Setup (Création Admin)
```bash
curl -X POST http://localhost:5000/api/admin/first-setup \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"motdepasse123"}'
```

### 2. Login Admin
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"motdepasse123"}'
```

### 3. Récupérer les Données Publiques
```bash
# Page d'accueil
curl http://localhost:5000/api/public/home

# Actualités
curl http://localhost:5000/api/public/actus

# Réseaux sociaux
curl http://localhost:5000/api/public/socials
```

---

## 📝 Notes Importantes

### Gestion des Images par Défaut
Si aucune image n'est fournie, l'API utilise automatiquement :
```
http://localhost:5000/static/images/default_image_actus.png
```

### Réseaux Sociaux Autorisés
```javascript
['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'github']
```

### Statuts des Livres
- `gratuit` - Téléchargement libre
- `payant` - Téléchargement restreint (futur système de paiement)

### Variables d'Environnement Requises
```env
JWT_SECRET=votre_secret_jwt_super_securise
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
MONGODB_URI=mongodb://localhost:27017/plume_noire
```

---

*Documentation générée automatiquement - Version 1.0*