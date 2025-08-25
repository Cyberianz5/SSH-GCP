const WebSocket = require('ws');
const net = require('net');
const http = require('http');

const SSH_HOST = "127.0.0.1";
const SSH_PORT = 22;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log("New WS connection from:", req.socket.remoteAddress);

  const sshSocket = net.connect(SSH_PORT, SSH_HOST, () => {
    console.log("Connected to SSH");
  });

  ws.on('message', (msg) => sshSocket.write(msg));
  sshSocket.on('data', (chunk) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(chunk);
    }
  });

  ws.on('close', () => sshSocket.end());
  sshSocket.on('close', () => ws.close());
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WS Proxy running on port ${PORT} (SNI=api.snapchat.com)`);
});
