# Production deployment

Run the live-chat service behind HTTPS/reverse proxy and keep `.env` outside source control. After pulling this branch run `npm install`, import `sql/schema.sql` for a fresh database (or `sql/admin-panel-upgrade.sql` for an existing installation), and restart Node.

For browser desktop notifications, the public site must be served over HTTPS (localhost is treated specially by browsers). Users must grant notification permission. Audio may also require a prior user interaction because of browser autoplay policies.
