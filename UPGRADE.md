# Upgrade from the initial live-chat build

```bat
git fetch origin
git checkout admin-panel-live-notifications
npm install
npm start
```

For an existing `solaris_chat` database, import `sql/admin-panel-upgrade.sql`. The existing `chat_admins` table already has the role and active-state columns required by this build.

After restart, open `/chat/admin`, sign in, and click Notifications to grant desktop-notification permission.
