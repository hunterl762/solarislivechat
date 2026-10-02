require('dotenv').config();
const express=require('express');
const http=require('http');
const path=require('path');
const {Server}=require('socket.io');
const crypto=require('crypto');
const mysql=require('mysql2/promise');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const required=['JWT_SECRET','DB_HOST','DB_USER','DB_PASSWORD','DB_NAME'];
for(const k of required){if(!process.env[k]){console.error(`Missing required .env setting: ${k}`);process.exit(1)}}
if(process.env.JWT_SECRET.length<32){console.error('JWT_SECRET must be at least 32 characters.');process.exit(1)}
const PORT=+(process.env.PORT||3010);
const db=mysql.createPool({host:process.env.DB_HOST,port:+(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,waitForConnections:true,connectionLimit:10,charset:'utf8mb4'});
const app=express(),server=http.createServer(app),io=new Server(server,{cors:{origin:false}}),conversations=new Map();
app.use(express.json({limit:'20kb'}));app.use(express.static(__dirname));
app.get('/chat/health',async(_,res)=>{try{await db.query('SELECT 1');res.json({ok:true,service:'Solaris Live Chat',database:true})}catch{res.status(503).json({ok:false,database:false})}});
app.get('/chat/admin',(_,res)=>res.sendFile(path.join(__dirname,'chat-admin.html')));
app.post('/api/chat/admin/login',async(req,res)=>{try{const username=String(req.body?.username||'').trim(),password=String(req.body?.password||'');if(!username||!password)return res.status(400).json({error:'Username and password are required.'});const [rows]=await db.execute('SELECT id,username,password_hash,display_name,role,is_active FROM chat_admins WHERE username=? LIMIT 1',[username]);const u=rows[0];if(!u||!u.is_active||!(await bcrypt.compare(password,u.password_hash)))return res.status(401).json({error:'Invalid username or password.'});await db.execute('UPDATE chat_admins SET last_login_at=NOW() WHERE id=?',[u.id]);const token=jwt.sign({sub:String(u.id),username:u.username,name:u.display_name,role:u.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'12h'});res.json({token,user:{username:u.username,displayName:u.display_name,role:u.role}})}catch(e){console.error(e);res.status(500).json({error:'Login service unavailable.'})}});
function verifyToken(token){return jwt.verify(token,process.env.JWT_SECRET)}
io.on('connection',socket=>{
 socket.on('visitor:join',({conversationId,name,email}={})=>{const id=conversationId||crypto.randomUUID();socket.join(`conversation:${id}`);socket.data={role:'visitor',conversationId:id};if(!conversations.has(id))conversations.set(id,{id,name:name||'Website Visitor',email:email||'',status:'open',messages:[],createdAt:Date.now()});socket.emit('visitor:ready',conversations.get(id));io.to('agents').emit('conversation:update',conversations.get(id))});
 socket.on('agent:join',({token}={})=>{try{const user=verifyToken(token);socket.data={role:'agent',user};socket.join('agents');socket.emit('agent:ready',{conversations:[...conversations.values()],user:{username:user.username,displayName:user.name,role:user.role}})}catch{socket.emit('agent:error','Your login has expired or is invalid. Please sign in again.')}});
 socket.on('agent:watch',({conversationId}={})=>{if(socket.data?.role!=='agent')return;socket.join(`conversation:${conversationId}`);const c=conversations.get(conversationId);if(c)socket.emit('conversation:update',c)});
 socket.on('chat:message',({conversationId,text}={})=>{const c=conversations.get(conversationId);if(!c||!text||!String(text).trim())return;if(socket.data?.role==='visitor'&&socket.data.conversationId!==conversationId)return;const sender=socket.data?.role==='agent'?'agent':'visitor';if(sender==='agent'&&!socket.data?.user)return;const message={id:crypto.randomUUID(),text:String(text).trim().slice(0,2000),sender,agentName:sender==='agent'?socket.data.user.name:null,at:Date.now()};c.messages.push(message);io.to(`conversation:${conversationId}`).emit('chat:message',message);io.to('agents').emit('conversation:update',c)});
 socket.on('conversation:close',({conversationId}={})=>{if(socket.data?.role!=='agent')return;const c=conversations.get(conversationId);if(c){c.status='closed';io.to(`conversation:${conversationId}`).emit('conversation:closed');io.to('agents').emit('conversation:update',c)}})
});
(async()=>{try{await db.query('SELECT 1');server.listen(PORT,()=>console.log(`Solaris Live Chat running at http://localhost:${PORT}`))}catch(e){console.error('MySQL connection failed:',e.message);process.exit(1)}})();
