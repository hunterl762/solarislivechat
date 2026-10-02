# Admin API

- `POST /api/chat/admin/login` — username/password login and JWT issuance.
- `GET /api/chat/admin/users` — authenticated staff listing.
- `POST /api/chat/admin/users` — administrator-only staff account creation.
- `GET /chat/health` — database/service health and online-agent count.

Authenticated API calls use `Authorization: Bearer <token>`.
