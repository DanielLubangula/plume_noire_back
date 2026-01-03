# Documentation API - Plume Noire

## Table des matières
- [Authentification](#authentification)
- [Endpoints Admin](#endpoints-admin)
- [Endpoints Publics](#endpoints-publics)
- [Modèles de données](#modèles-de-données)
- [Codes d'erreur](#codes-derreur)

---

## Authentification

### Login Admin
**POST** `/api/admin/login`

Authentifie un administrateur et retourne un token JWT.

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "motdepasse"
}
```

**Réponse (200):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs:**
- `401` - Identifiants invalides
- `500` - Erreur serveur

---

## Endpoints Admin

> **Note:** Tous les endpoints admin nécessitent un token JWT dans l'en-tête `Authorization: Bearer <token>`

### Configuration initiale

#### Créer le premier admin
**POST** `/api/admin/first-setup`

Crée le premier administrateur du système (uniquement si aucun admin n'existe).

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "motdepasse"
}
```

**Réponse (201):**
```json
{
  "status": "success",
  "message": "First admin created"
}
```

**Erreurs:**
- `403` - Admin déjà existant

### Gestion du profil admin

#### Mettre à jour le profil admin
**PUT** `/api/admin/profile`

Met à jour les informations du profil administrateur.

**Content-Type:** `multipart/form-data`

**Champs:**
- `currentPassword` (requis) - Mot de passe actuel
- `email` (optionnel) - Nouvel email
- `password` (optionnel) - Nouveau mot de passe
- `nom` (optionnel) - Nom de l'admin
- `biographie` (optionnel) - Biographie
- `short_biographie` (optionnel) - Biographie courte
- `email_contact` (optionnel) - Email de contact
- `message_accroche` (optionnel) - Message d'accroche
- `photo` (optionnel) - Fichier image
- `socials` (optionnel) - JSON string des réseaux sociaux

**Exemple socials:**
```json
[
  {"network": "facebook", "url": "https://facebook.com/profile"},
  {"network": "twitter", "url": "https://twitter.com/profile"}
]
```

**Réponse (200):**
```json
{
  "status": "success",
  "message": "Profil mis à jour avec succès",
  "admin": {
    "_id": "...",
    "email": "admin@example.com",
    "nom": "Nom Admin",
    "biographie": "...",
    "photo": "https://cloudinary.com/...",
    "social_links": [...]
  }
}
```

#### Supprimer des réseaux sociaux
**DELETE** `/api/admin/profile/socials`

**Body:**
```json
{
  "networks": ["facebook", "twitter"]
}
```

### Gestion des livres

#### Créer un livre
**POST** `/api/admin/livres`

**Content-Type:** `multipart/form-data`

**Champs requis:**
- `titre` - Titre du livre
- `fichier_pdf` - Fichier PDF
- `couverture` - Image de couverture

**Champs optionnels:**
- `description` - Description
- `extrait` - Extrait
- `statut` - "gratuit" ou "payant" (défaut: "gratuit")
- `prix` - Prix (nombre)
- `is_featured` - Livre mis en avant (boolean)

**Réponse (201):**
```json
{
  "status": "success",
  "book": {
    "_id": "...",
    "titre": "Mon Livre",
    "description": "...",
    "fichier_pdf": "https://cloudinary.com/...",
    "couverture": "https://cloudinary.com/...",
    "statut": "gratuit",
    "prix": 0,
    "is_featured": false
  }
}
```

#### Lister les livres
**GET** `/api/admin/livres`

**Réponse (200):**
```json
{
  "status": "success",
  "data": {
    "books": [...]
  }
}
```

#### Récupérer un livre
**GET** `/api/admin/livres/:id`

#### Mettre à jour un livre
**PUT** `/api/admin/livres/:id`

Même format que la création, tous les champs optionnels.

#### Supprimer un livre
**DELETE** `/api/admin/livres/:id`

### Gestion des actualités

#### Créer une actualité
**POST** `/api/admin/actus`

**Content-Type:** `multipart/form-data`

**Champs requis:**
- `titre` - Titre de l'actualité
- `contenu` - Contenu

**Champs optionnels:**
- `image` - Image (fichier)

**Réponse (201):**
```json
{
  "status": "success",
  "actu": {
    "_id": "...",
    "titre": "Titre actualité",
    "contenu": "Contenu...",
    "image": "https://cloudinary.com/... ou URL par défaut",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Lister les actualités
**GET** `/api/admin/actus`

#### Récupérer une actualité
**GET** `/api/admin/actus/:id`

#### Mettre à jour une actualité
**PUT** `/api/admin/actus/:id`

#### Supprimer une actualité
**DELETE** `/api/admin/actus/:id`

### Gestion du profil auteur

#### Récupérer le profil auteur
**GET** `/api/admin/profil`

#### Mettre à jour le profil auteur
**PUT** `/api/admin/profil`

**Content-Type:** `multipart/form-data`

**Champs optionnels:**
- `biographie` - Biographie de l'auteur
- `email_contact` - Email de contact
- `photo` - Photo de profil (fichier)
- `socials` - Réseaux sociaux (JSON string)

#### Supprimer la photo de profil
**DELETE** `/api/admin/profil/photo`

#### Supprimer un réseau social
**DELETE** `/api/admin/profil/socials/:network`

### Dashboard

#### Récupérer les métriques
**GET** `/api/admin/dashboard`

**Réponse (200):**
```json
{
  "status": "success",
  "nombre_livres": 5,
  "nombre_ventes": 12,
  "nombre_messages": 8,
  "statistiques_simples": {
    "ventes_last_7_days": [
      {"_id": "2024-01-01", "count": 2, "totalAmount": 25.99}
    ],
    "revenus_total": 150.50,
    "ventes_ce_mois": 3,
    "livres_gratuits": 3,
    "livres_payants": 2
  }
}
```

---

## Endpoints Publics

### Page d'accueil

#### Récupérer les données d'accueil
**GET** `/api/public/home`

**Réponse (200):**
```json
{
  "status": "success",
  "data": {
    "nom_auteur": "Nom de l'auteur",
    "photo_auteur": "https://cloudinary.com/...",
    "courte_biographie": "Biographie courte...",
    "livre_mis_en_avant": [
      {
        "id": "...",
        "titre": "Livre 1",
        "resume": "Résumé...",
        "couverture": "https://cloudinary.com/...",
        "statut": "gratuit"
      }
    ],
    "message_accroche": "Message d'accroche"
  }
}
```

### Biographie

#### Récupérer la biographie publique
**GET** `/api/public/biographie`

**Réponse (200):**
```json
{
  "status": "success",
  "data": {
    "admin": {
      "_id": "...",
      "email": "contact@example.com",
      "nom": "Nom Auteur",
      "biographie": "Biographie complète...",
      "photo": "https://cloudinary.com/...",
      "social_links": [
        {"network": "facebook", "url": "https://facebook.com/..."}
      ]
    }
  }
}
```

### Réseaux sociaux

#### Récupérer les réseaux sociaux
**GET** `/api/public/socials`

**Réponse (200):**
```json
{
  "status": "success",
  "data": {
    "social_links": [
      {"network": "facebook", "url": "https://facebook.com/..."},
      {"network": "twitter", "url": "https://twitter.com/..."}
    ]
  }
}
```

### Actualités

#### Lister les actualités publiques
**GET** `/api/public/actus`

**Query Parameters:**
- `limit` (optionnel) - Nombre maximum d'actualités (max 100)

**Réponse (200):**
```json
{
  "status": "success",
  "data": {
    "actus": [
      {
        "id": "...",
        "titre": "Titre actualité",
        "contenu": "Contenu complet...",
        "excerpt": "Extrait (300 chars max)...",
        "image": "https://cloudinary.com/...",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Récupérer une actualité
**GET** `/api/public/actus/:id`

### Livres

#### Télécharger un livre gratuit
**GET** `/api/public/livres/:id/telecharger`

Télécharge le fichier PDF d'un livre si son statut est "gratuit".

**Réponse (200):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename*=UTF-8''titre_livre.pdf`
- Corps: Fichier PDF en streaming

**Erreurs:**
- `403` - Livre payant (téléchargement non autorisé)
- `404` - Livre ou fichier PDF introuvable
- `502` - Erreur lors du téléchargement du fichier distant

---

## Modèles de données

### Admin
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password_hash: String,
  nom: String,
  biographie: String,
  short_biographie: String,
  email_contact: String,
  message_accroche: String,
  photo: String (URL Cloudinary),
  photo_public_id: String,
  social_links: [
    {
      network: String, // facebook, twitter, instagram, linkedin, youtube, tiktok, github
      url: String
    }
  ],
  created_at: Date,
  updated_at: Date
}
```

### Author
```javascript
{
  _id: ObjectId,
  nom: String,
  biographie: String,
  email_contact: String,
  photo: String (URL Cloudinary),
  photo_public_id: String,
  social_links: [
    {
      network: String,
      url: String
    }
  ],
  created_at: Date,
  updated_at: Date
}
```

### Book
```javascript
{
  _id: ObjectId,
  titre: String (requis),
  description: String,
  extrait: String,
  statut: String, // "gratuit" ou "payant"
  prix: Number,
  is_featured: Boolean,
  fichier_pdf: String (URL Cloudinary),
  fichier_pdf_public_id: String,
  couverture: String (URL Cloudinary),
  couverture_public_id: String,
  created_at: Date,
  updated_at: Date
}
```

### Actu
```javascript
{
  _id: ObjectId,
  titre: String (requis),
  contenu: String (requis),
  image: String (URL Cloudinary ou défaut),
  image_public_id: String,
  created_at: Date,
  updated_at: Date
}
```

### Sale
```javascript
{
  _id: ObjectId,
  amount: Number,
  created_at: Date
}
```

### Message
```javascript
{
  _id: ObjectId,
  created_at: Date
}
```

---

## Codes d'erreur

### Format des erreurs
```json
{
  "status": "error",
  "message": "Description de l'erreur"
}
```

### Codes HTTP utilisés
- **200** - Succès
- **201** - Créé avec succès
- **400** - Requête invalide
- **401** - Non authentifié
- **403** - Accès interdit
- **404** - Ressource non trouvée
- **500** - Erreur serveur
- **502** - Erreur de passerelle (problème Cloudinary/fichier distant)

### Erreurs spécifiques

#### Upload d'images
- `400` - "Erreur upload image : horloge du serveur désynchronisée. Synchronisez l'horloge (NTP) et réessayez."
- `500` - "Erreur upload image"

#### Authentification
- `401` - "Identifiants invalides"
- `401` - "Mot de passe actuel incorrect"
- `403` - "Forbidden – Admin already exists"

#### Validation
- `400` - "Aucune modification fournie"
- `400` - "Format socials invalide (JSON attendu)"
- `400` - "Réseau social invalide: [network]"
- `400` - "Fichier PDF et couverture requis"

#### Ressources
- `404` - "Book not found"
- `404` - "Actu not found"
- `404` - "Admin not found"
- `404` - "Profile not found"

---

## Notes techniques

### Upload de fichiers
- Utilise Cloudinary pour le stockage
- Formats supportés : PDF (livres), images (couvertures, photos, actualités)
- Taille maximale : définie par la configuration Cloudinary
- Dossiers organisés : `plume-noire/books/`, `plume-noire/actus/`, etc.

### Images par défaut
- URL générée dynamiquement : `${protocol}://${host}/static/images/default_image_actus.png`
- Utilisée quand aucune image n'est fournie

### Sécurité
- JWT avec expiration 7 jours
- Mots de passe hashés avec bcrypt (12 rounds)
- Validation des types de fichiers
- Sanitisation des noms de fichiers pour téléchargement

### Streaming
- Téléchargement de livres en streaming direct depuis Cloudinary
- Gestion des différents types de streams (WHATWG/Node.js)
- Headers appropriés pour le téléchargement de fichiers