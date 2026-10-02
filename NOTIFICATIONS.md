# Live notification behavior

## Agents
- Incoming visitor messages increment unread counts when another conversation is selected.
- The browser tab title displays the total unread count.
- A short audio tone plays for new visitor messages.
- The Notifications navigation action requests browser notification permission.
- Desktop notifications are displayed for new visitor messages while the page is hidden when permission is granted.

## Visitors
- Agent replies increment the minimized widget badge.
- The page title displays the unread count.
- A short audio tone plays for agent replies.
- Desktop notifications are displayed while the page is hidden when the host site already has notification permission.
- The widget displays whether support agents are currently online.

Browsers generally require notification permission to be requested from a user gesture. The admin console includes an explicit Notifications action for this reason.
