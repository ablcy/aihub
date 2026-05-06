const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const DB_PATH = path.join(__dirname, 'data.json');

let db = {
  users: {},
  messages: []
};

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading DB:', error);
  }
}

function saveDB() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving DB:', error);
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  
  for (const id in db.users) {
    if (db.users[id].token === token) {
      return db.users[id];
    }
  }
  return null;
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

async function handleAPI(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  try {
    if (pathname === '/api/register' && method === 'POST') {
      const body = await parseBody(req);
      const { id, name, password } = body;
      
      if (!id || !name || !password) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: '缺少必填字段' }));
        return;
      }
      
      if (db.users[id]) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: '账号ID已存在' }));
        return;
      }
      
      db.users[id] = {
        id,
        name,
        password: hashPassword(password),
        createdAt: new Date().toISOString()
      };
      saveDB();
      
      res.writeHead(200);
      res.end(JSON.stringify({ success: true }));
      return;
    }
    
    if (pathname === '/api/login' && method === 'POST') {
      const body = await parseBody(req);
      const { id, password } = body;
      
      if (!db.users[id]) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: '账号不存在' }));
        return;
      }
      
      if (db.users[id].password !== hashPassword(password)) {
        res.writeHead(401);
        res.end(JSON.stringify({ error: '密码错误' }));
        return;
      }
      
      const token = generateToken();
      db.users[id].token = token;
      saveDB();
      
      res.writeHead(200);
      res.end(JSON.stringify({
        user: {
          id: db.users[id].id,
          name: db.users[id].name
        },
        token
      }));
      return;
    }
    
    const user = authenticate(req);
    if (!user) {
      res.writeHead(401);
      res.end(JSON.stringify({ error: '未授权' }));
      return;
    }
    
    if (pathname === '/api/users' && method === 'GET') {
      const users = Object.values(db.users)
        .filter(u => u.id !== user.id)
        .map(u => ({
          id: u.id,
          name: u.name
        }));
      res.writeHead(200);
      res.end(JSON.stringify(users));
      return;
    }
    
    if (pathname.startsWith('/api/users/') && method === 'GET') {
      const targetId = pathname.substring('/api/users/'.length);
      const targetUser = db.users[targetId];
      
      if (!targetUser) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: '用户不存在' }));
        return;
      }
      
      res.writeHead(200);
      res.end(JSON.stringify({
        id: targetUser.id,
        name: targetUser.name
      }));
      return;
    }
    
    if (pathname === '/api/messages' && method === 'POST') {
      const body = await parseBody(req);
      const { receiverId, content } = body;
      
      if (!receiverId || !content) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: '缺少必填字段' }));
        return;
      }
      
      if (!db.users[receiverId]) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: '接收者不存在' }));
        return;
      }
      
      const message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        receiverId,
        content,
        createdAt: new Date().toISOString()
      };
      
      db.messages.push(message);
      saveDB();
      
      res.writeHead(200);
      res.end(JSON.stringify(message));
      return;
    }
    
    if (pathname.startsWith('/api/messages/') && method === 'GET') {
      const otherUserId = pathname.substring('/api/messages/'.length);
      
      const messages = db.messages.filter(msg =>
        (msg.senderId === user.id && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === user.id)
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      res.writeHead(200);
      res.end(JSON.stringify(messages));
      return;
    }
    
    if (pathname === '/api/chats' && method === 'GET') {
      const chatMap = {};
      
      db.messages.forEach(msg => {
        const otherId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        const otherUser = db.users[otherId];
        
        if (!otherUser) return;
        
        if (!chatMap[otherId] || new Date(msg.createdAt) > new Date(chatMap[otherId].lastMessageTime)) {
          chatMap[otherId] = {
            userId: otherId,
            name: otherUser.name,
            lastMessage: msg.content,
            lastMessageTime: msg.createdAt
          };
        }
      });
      
      const chats = Object.values(chatMap).sort((a, b) => 
        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );
      
      res.writeHead(200);
      res.end(JSON.stringify(chats));
      return;
    }
    
    if (pathname === '/api/profile' && method === 'PUT') {
      const body = await parseBody(req);
      const { type } = body;
      
      if (type === 'id') {
        const { newId, password } = body;
        
        if (db.users[newId]) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: '新账号ID已被占用' }));
          return;
        }
        
        if (db.users[user.id].password !== hashPassword(password)) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: '密码错误' }));
          return;
        }
        
        db.messages = db.messages.map(msg => {
          if (msg.senderId === user.id) msg.senderId = newId;
          if (msg.receiverId === user.id) msg.receiverId = newId;
          return msg;
        });
        
        const userData = db.users[user.id];
        delete db.users[user.id];
        userData.id = newId;
        db.users[newId] = userData;
        saveDB();
        
        res.writeHead(200);
        res.end(JSON.stringify({
          user: { id: newId, name: userData.name }
        }));
        return;
      }
      
      if (type === 'name') {
        const { newName } = body;
        db.users[user.id].name = newName;
        saveDB();
        
        res.writeHead(200);
        res.end(JSON.stringify({
          user: { id: user.id, name: newName }
        }));
        return;
      }
      
      if (type === 'password') {
        const { currentPassword, newPassword } = body;
        
        if (db.users[user.id].password !== hashPassword(currentPassword)) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: '当前密码错误' }));
          return;
        }
        
        db.users[user.id].password = hashPassword(newPassword);
        saveDB();
        
        res.writeHead(200);
        res.end(JSON.stringify({ success: true }));
        return;
      }
      
      res.writeHead(400);
      res.end(JSON.stringify({ error: '无效的更新类型' }));
      return;
    }
    
    res.writeHead(404);
    res.end(JSON.stringify({ error: '未找到API' }));
    
  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: '服务器错误' }));
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  if (pathname.startsWith('/api/')) {
    handleAPI(req, res);
    return;
  }
  
  let filePath = '.' + pathname;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./index.html', (err, indexContent) => {
          if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

loadDB();

server.listen(PORT, () => {
  console.log(`aihub server running on http://localhost:${PORT}`);
});