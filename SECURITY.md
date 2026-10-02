# Security notes

- Never commit `.env`, database passwords, JWT secrets, or administrator passwords.
- Use a unique `JWT_SECRET` of at least 32 characters.
- Use HTTPS in production.
- Administrator passwords are bcrypt-hashed before storage.
- Only users with the `admin` role may create new support accounts through the admin API.
- Use a dedicated least-privilege MySQL user rather than the database root account.
