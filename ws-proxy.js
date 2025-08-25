const WebSocket = require('ws');
const net = require('net');
const http = require('http');

const SSH_HOST = "127.0.0.1";
const SSH_PORT = 22;

const wss = new WebSocket.Server({ noServer: true });
const server = http.createServer();

server.on('upgrade', (req, socket, head) => {
  // Accept ANY path: /app1, /app2, etc.
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  const sshSocket = net.connect(SSH_PORT, SSH_HOST);

  ws.on('message', (msg) => sshSocket.write(msg));
  sshSocket.on('data', (chunk) => ws.send(chunk));

  ws.on('close', () => sshSocket.end());
  sshSocket.on('close', () => ws.close());
});

server.listen(process.env.PORT || 8080, () => {
  console.log("WS Proxy running → SSH server on 22");
});
