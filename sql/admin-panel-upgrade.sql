USE solaris_chat;
-- The current chat_admins schema already contains the fields required by the
-- admin panel (role, is_active, created_at, last_login_at). This migration is
-- intentionally safe for existing installations and provides a version marker.
CREATE TABLE IF NOT EXISTS chat_schema_meta (
  meta_key VARCHAR(64) NOT NULL PRIMARY KEY,
  meta_value VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO chat_schema_meta(meta_key,meta_value) VALUES('admin_panel_version','1') ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
