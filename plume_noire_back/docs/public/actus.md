# API publique — Actualités (Actus)

## Objectif
Fournir la liste publique des actualités (actus) publiées par l'admin.

## Endpoints
- GET `/api/public/actus` — retourne toutes les actus (triées par date descendante). Optionnel: `?limit=<n>` pour limiter le nombre de résultats (max 100).
- GET `/api/public/actus/:id` — retourne une actu par son `id`.

## Réponse
- 200 OK
```json
{
  "status": "success",
  "data": {
    "actus": [
      {
        "id": "60a7b2f4b5c2a1f5d8f9e1a3",
        "titre": "Nouvelle actu",
        "excerpt": "Courte description...",
        "image": "https://.../image.jpg",
        "created_at": "2026-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

## Notes
- Si une actu n'a pas d'image, l'API renvoie une image par défaut située dans `/static/images/default_image_actus.png`.
- Respecte les conventions du projet : contrôleur séparé, JSDoc, gestion d'erreur via `AppError`.

## Exemple curl
- Lister:
```bash
curl http://localhost:5000/api/public/actus
```

- Récupérer une actu:
```bash
curl http://localhost:5000/api/public/actus/<ACTU_ID>
```
