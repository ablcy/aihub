const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = path.resolve(__dirname);

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

const DB_PATH = path.join(ROOT_DIR, 'data.json');

let db = {
  users: {},
  messages: [],
  groups: []
};

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf8');
      db = JSON.parse(data);
      if (!db.groups) db.groups = [];
      if (!db.messages) db.messages = [];
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
        type: 'private',
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
        msg.type === 'private' &&
        ((msg.senderId === user.id && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === user.id))
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      res.writeHead(200);
      res.end(JSON.stringify(messages));
      return;
    }
    
    if (pathname === '/api/chats' && method === 'GET') {
      const chats = [];
      
      db.messages.forEach(msg => {
        if (msg.type === 'private') {
          const otherId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
          const otherUser = db.users[otherId];
          
          if (!otherUser) return;
          
          const existing = chats.find(c => c.id === otherId && c.type === 'private');
          if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessageTime)) {
            if (existing) {
              existing.lastMessage = msg.content;
              existing.lastMessageTime = msg.createdAt;
            } else {
              chats.push({
                id: otherId,
                type: 'private',
                name: otherUser.name,
                lastMessage: msg.content,
                lastMessageTime: msg.createdAt
              });
            }
          }
        }
      });
      
      db.groups.forEach(group => {
        if (group.members.includes(user.id)) {
          const groupMessages = db.messages.filter(m => m.type === 'group' && m.groupId === group.id);
          const lastMsg = groupMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          
          chats.push({
            id: group.id,
            type: 'group',
            name: group.name,
            lastMessage: lastMsg ? lastMsg.content : null,
            lastMessageTime: lastMsg ? lastMsg.createdAt : null
          });
        }
      });
      
      chats.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      });
      
      res.writeHead(200);
      res.end(JSON.stringify(chats));
      return;
    }
    
    if (pathname === '/api/groups' && method === 'GET') {
      const userGroups = db.groups.filter(g => g.members.includes(user.id));
      const result = userGroups.map(group => {
        const groupMessages = db.messages.filter(m => m.type === 'group' && m.groupId === group.id);
        const lastMsg = groupMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        return {
          id: group.id,
          name: group.name,
          memberIds: group.members,
          lastMessage: lastMsg ? lastMsg.content : null,
          lastMessageTime: lastMsg ? lastMsg.createdAt : null
        };
      });
      
      res.writeHead(200);
      res.end(JSON.stringify(result));
      return;
    }
    
    if (pathname === '/api/groups' && method === 'POST') {
      const body = await parseBody(req);
      const { name, memberIds } = body;
      
      if (!name || !memberIds || memberIds.length < 2) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: '群聊名称和至少2个成员是必需的' }));
        return;
      }
      
      const members = [...new Set([user.id, ...memberIds])];
      const group = {
        id: Date.now().toString(),
        name,
        members,
        creatorId: user.id,
        createdAt: new Date().toISOString()
      };
      
      db.groups.push(group);
      saveDB();
      
      res.writeHead(200);
      res.end(JSON.stringify({
        id: group.id,
        name: group.name,
        members: members.map(m => ({
          id: m,
          name: db.users[m]?.name || m
        }))
      }));
      return;
    }
    
    if (pathname.startsWith('/api/groups/') && method === 'GET') {
      const groupId = pathname.substring('/api/groups/'.length);
      const group = db.groups.find(g => g.id === groupId);
      
      if (!group) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: '群聊不存在' }));
        return;
      }
      
      if (!group.members.includes(user.id)) {
        res.writeHead(403);
        res.end(JSON.stringify({ error: '你不是群聊成员' }));
        return;
      }
      
      res.writeHead(200);
      res.end(JSON.stringify({
        id: group.id,
        name: group.name,
        members: group.members.map(m => ({
          id: m,
          name: db.users[m]?.name || m
        })),
        creatorId: group.creatorId
      }));
      return;
    }
    
    if (pathname.startsWith('/api/groups/') && pathname.endsWith('/messages') && method === 'POST') {
      const parts = pathname.substring('/api/groups/'.length).split('/');
      const groupId = parts[0];
      const group = db.groups.find(g => g.id === groupId);
      
      if (!group) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: '群聊不存在' }));
        return;
      }
      
      if (!group.members.includes(user.id)) {
        res.writeHead(403);
        res.end(JSON.stringify({ error: '你不是群聊成员' }));
        return;
      }
      
      const body = await parseBody(req);
      const { content } = body;
      
      if (!content) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: '消息内容不能为空' }));
        return;
      }
      
      const message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        groupId,
        type: 'group',
        content,
        createdAt: new Date().toISOString()
      };
      
      db.messages.push(message);
      saveDB();
      
      res.writeHead(200);
      res.end(JSON.stringify(message));
      return;
    }
    
    if (pathname.startsWith('/api/groups/') && pathname.endsWith('/messages') && method === 'GET') {
      const parts = pathname.substring('/api/groups/'.length).split('/');
      const groupId = parts[0];
      const group = db.groups.find(g => g.id === groupId);
      
      if (!group) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: '群聊不存在' }));
        return;
      }
      
      if (!group.members.includes(user.id)) {
        res.writeHead(403);
        res.end(JSON.stringify({ error: '你不是群聊成员' }));
        return;
      }
      
      const messages = db.messages
        .filter(m => m.type === 'group' && m.groupId === groupId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      res.writeHead(200);
      res.end(JSON.stringify(messages));
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
        
        db.groups = db.groups.map(g => {
          if (g.creatorId === user.id) g.creatorId = newId;
          g.members = g.members.map(m => m === user.id ? newId : m);
          return g;
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
  
  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);
  
  if (pathname.startsWith('/api/')) {
    handleAPI(req, res);
    return;
  }
  
  let filePath = path.join(ROOT_DIR, pathname);
  if (pathname === '/' || pathname === '') {
    filePath = path.join(ROOT_DIR, 'index.html');
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile(path.join(ROOT_DIR, 'index.html'), (err, indexContent) => {
          if (err) {
            console.error('Failed to read index.html:', err);
            res.writeHead(404);
            res.end('Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent, 'utf-8');
        });
      } else {
        console.error('Server error:', error);
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
