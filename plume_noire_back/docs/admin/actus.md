# 📄 Documentation API – Module « Actus »
**Base URL :** `http://localhost:5000`

---

## 1. POST /api/admin/actus
Créer une actualité.  
**Auth :** admin (à implémenter côté front).  
**Content-Type :** `multipart/form-data`

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| titre | string | ✔ | Titre de l’actu |
| contenu | string | ✔ | Corps de l’actu |
| file | file | ✖ | Image (jpg/png/webp…). Si absent, image par défaut automatique |

**Réponse 201**
```json
{
  "status": "success",
  "actu": {
    "_id": "60d…",
    "titre": "Nouvelle collection",
    "contenu": "Texte…",
    "image": "https://res.cloudinary.com/…/image.png",
    "image_public_id": "plume-noire/actus/images/…",
    "created_at": "2026-01-03T12:00:00.000Z",
    "updated_at": null
  }
}