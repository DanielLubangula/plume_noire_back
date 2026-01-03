# API publique — Réseaux sociaux

## Objectif
Fournir la liste publique des réseaux sociaux associés à l'auteur/admin avec leurs URLs.

## Endpoint
- Méthode: GET
- URL: `/api/public/socials`
- Auth: Aucune (endpoint public)

## Réponse
- 200 OK

```json
{
  "status": "success",
  "data": {
    "social_links": [
      { "network": "twitter", "url": "https://twitter.com/author" },
      { "network": "github", "url": "https://github.com/author" }
    ]
  }
}
```

## Description des champs
- `social_links`: tableau d'objets `{ network, url }`.
  - `network`: nom du réseau (ex: `twitter`, `facebook`, `instagram`, `linkedin`, `youtube`, `tiktok`, `github`)
  - `url`: URL complète du profil

## Origine des données / Comment l'admin les crée
Les réseaux sociaux sont gérés par l'admin via l'endpoint protégé suivant:

- Méthode: PUT
- URL: `/api/admin/profile`
- Auth: `Authorization: Bearer <ADMIN_TOKEN>`
- Paramètre important: `currentPassword` est requis pour valider la modification

Payload (JSON) pour ajouter ou mettre à jour des réseaux:

```json
{
  "socials": [
    { "network": "twitter", "url": "https://twitter.com/author" },
    { "network": "github",  "url": "https://github.com/author" }
  ],
  "currentPassword": "monMotDePasseActuel"
}
```

Pour supprimer un réseau, envoyez `url: null` ou `url: ""` pour le network ciblé.

## Remarques techniques
- Les réseaux autorisés sont: `facebook`, `twitter`, `instagram`, `linkedin`, `youtube`, `tiktok`, `github`.
- Le endpoint public renvoie un tableau vide si aucun réseau n'est configuré.
- Respecte les conventions du projet: contrôleur unique, route séparée, réponse JSON uniforme, gestion d'erreurs via `AppError`.

## Exemples
- `curl` (récupérer les réseaux publics):
```bash
curl http://localhost:5000/api/public/socials
```

- `curl` (mettre à jour en tant qu'admin):
```bash
curl -X PUT http://localhost:5000/api/admin/profile \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"socials":[{"network":"twitter","url":"https://twitter.com/author"}],"currentPassword":"pwd"}'
```

---

Fichier généré automatiquement par l'équipe backend — mettez à jour la documentation si le comportement change.