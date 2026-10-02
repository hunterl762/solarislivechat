# Socket.IO events

Visitor: `visitor:join`, `visitor:ready`.

Agent: `agent:join`, `agent:ready`, `agent:error`, `agent:watch`.

Shared: `chat:message`, `conversation:update`, `conversation:close`, `conversation:closed`, `agent:presence`.

`agent:presence` broadcasts the current online-agent count and display data whenever an authenticated agent connects or disconnects.
