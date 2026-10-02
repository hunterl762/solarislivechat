# Solaris Live Chat — Website Integration

The live-chat server and Solaris Tech Services website may run on different origins. Configure the public chat URL and allowed website origins before embedding the widget.

## 1. Configure `.env`

```env
NODE_ENV=production
CHAT_PUBLIC_URL=https://chat.example.com
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

`ALLOWED_ORIGINS` must contain origins only (scheme + hostname + optional port), with no paths.

Restart Node after changing `.env`.

## 2. Recommended production deployment

Keep Node listening internally on port 3010 and terminate HTTPS at your reverse proxy. Point a hostname such as `https://chat.example.com` to `http://127.0.0.1:3010`.

Your proxy must support WebSocket upgrades for `/socket.io/` as well as normal HTTP requests.

## 3. Embed on the website

Place this immediately before `</body>` and replace the hostname with your public chat hostname:

```html
<script src="https://chat.example.com/socket.io/socket.io.js"></script>
<script>
  window.SOLARIS_CHAT_URL = 'https://chat.example.com';
</script>
<script src="https://chat.example.com/chat-widget.js"></script>
```

Alternatively, the widget supports a `data-chat-url` attribute:

```html
<script src="https://chat.example.com/socket.io/socket.io.js"></script>
<script src="https://chat.example.com/chat-widget.js" data-chat-url="https://chat.example.com"></script>
```

Do not load an HTTP chat URL from an HTTPS website; browsers block mixed active content.

## 4. Test

Open:

- `https://chat.example.com/chat/health`
- `https://chat.example.com/socket.io/socket.io.js`

Both should load successfully. Then open the website developer console. The widget should change from `Connecting…` to either `Support online` or `Leave us a message`.

If it says `Support connection unavailable — retrying…`, confirm the website's exact origin appears in `ALLOWED_ORIGINS` and that your reverse proxy passes WebSocket upgrades.
