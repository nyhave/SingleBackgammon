import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const waiting = [];
const rooms = new Map(); // roomId -> [ws1, ws2]

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch {
      return;
    }
    if (data.type === 'join-lobby') {
      waiting.push(ws);
      tryMatch();
    } else if (data.type === 'join-room') {
      ws.roomId = data.roomId;
      if (!rooms.has(ws.roomId)) rooms.set(ws.roomId, []);
      rooms.get(ws.roomId).push(ws);
    } else if (data.type === 'chat' && ws.roomId) {
      const peers = rooms.get(ws.roomId) || [];
      peers.forEach((client) => {
        if (client !== ws && client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'chat', text: data.text }));
        }
      });
    }
  });

  ws.on('close', () => {
    const idx = waiting.indexOf(ws);
    if (idx >= 0) waiting.splice(idx, 1);
    if (ws.roomId && rooms.has(ws.roomId)) {
      const peers = rooms.get(ws.roomId);
      rooms.set(ws.roomId, peers.filter((p) => p !== ws));
    }
  });
});

function tryMatch() {
  if (waiting.length >= 2) {
    const p1 = waiting.shift();
    const p2 = waiting.shift();
    const roomId = Math.random().toString(36).slice(2, 8);
    [p1, p2].forEach((ws) => {
      ws.roomId = roomId;
      if (!rooms.has(roomId)) rooms.set(roomId, []);
      rooms.get(roomId).push(ws);
      ws.send(JSON.stringify({ type: 'match', roomId }));
    });
  }
}

console.log('WebSocket lobby server running on ws://localhost:8080');
