# Solaris Live Chat Admin Panel

## Admin console
Open `/chat/admin` and sign in with a MySQL-backed chat administrator account.

Administrators can view live metrics, open/closed conversations, unread counts, online agent count, search chats, reply/close conversations, and manage agent accounts. Only `admin` role users may create accounts.

## Browser notifications
In the admin console click **Notifications** and allow browser notifications. Incoming visitor messages also play a short notification tone and update the browser title/unread badge.

Visitors receive unread badges, title counters, and a notification tone when an agent replies. Browser desktop notifications are shown when permission has already been granted by the host site/browser.

## Website embed
Before `</body>` on the Solaris Tech Services site, load Socket.IO and the widget from the live-chat service:

```html
<script src="https://YOUR-CHAT-HOST/socket.io/socket.io.js"></script>
<script src="https://YOUR-CHAT-HOST/chat-widget.js"></script>
```

If the website and chat service use different origins, update the Socket.IO/CORS deployment configuration and initialize the widget against the chat service URL rather than relying on same-origin `io()`.
