# Solaris Live Chat

Real-time support chat for Solaris Tech Services using Node.js, Socket.IO and MySQL/MariaDB.

## Setup
1. Copy `.env.example` to `.env` and configure MySQL plus a 32+ character `JWT_SECRET`.
2. Import `sql/schema.sql`.
3. Run `npm install`.
4. Run `npm run create-admin` to create the first administrator.
5. Run `npm start`.
6. Open `/chat/admin`.

## Admin panel
The admin dashboard provides live conversation metrics, search, unread indicators, online agent presence, chat replies/closing, browser notifications, notification sounds, and agent-account management for administrators.

## Website widget
For same-origin deployments add before `</body>`:

```html
<script src="/socket.io/socket.io.js"></script>
<script src="/chat-widget.js"></script>
```

See `ADMIN-PANEL.md` for deployment and notification details.
