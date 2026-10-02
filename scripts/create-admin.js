require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const required=['DB_HOST','DB_USER','DB_PASSWORD','DB_NAME'];
for(const k of required) if(!process.env[k]) { console.error(`Missing ${k} in .env`); process.exit(1); }
const rl=readline.createInterface({input:process.stdin,output:process.stdout});
const ask=q=>new Promise(r=>rl.question(q,r));
(async()=>{
 const username=(await ask('Username: ')).trim();
 const displayName=(await ask('Display name: ')).trim() || username;
 const password=await ask('Password (12+ characters): ');
 if(!/^[A-Za-z0-9_.-]{3,64}$/.test(username)) throw new Error('Username must be 3-64 characters and use letters, numbers, ., _, or -.');
 if(password.length<12) throw new Error('Password must be at least 12 characters.');
 const db=await mysql.createConnection({host:process.env.DB_HOST,port:+(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME});
 const hash=await bcrypt.hash(password,12);
 await db.execute(`INSERT INTO chat_admins (username,password_hash,display_name,role,is_active) VALUES (?,?,?,'admin',1) ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash),display_name=VALUES(display_name),role='admin',is_active=1`,[username,hash,displayName]);
 console.log(`Admin ${username} created/updated successfully.`); await db.end(); rl.close();
})().catch(e=>{console.error(e.message);rl.close();process.exit(1)});
