const WebSocket = require('ws');
const net = require('net');

const SSH_HOST = "127.0.0.1";
const SSH_PORT = 22;

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

wss.on('connection', (ws) => {
  const sshSocket = net.connect(SSH_PORT, SSH_HOST);

  ws.on('message', (msg) => sshSocket.write(msg));
  sshSocket.on('data', (chunk) => ws.send(chunk));

  ws.on('close', () => sshSocket.end());
  sshSocket.on('close', () => ws.close());
});

console.log("WS Proxy running → SSH server on 22");
