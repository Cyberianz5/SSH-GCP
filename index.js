import express from 'express';
import basicAuth from 'express-basic-auth';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static('panel'));

// Autenticación básica (cambiar si quieres)
app.use(['/','/generate'], basicAuth({
  users: { 'nstrslv': '7561' },
  challenge: true,
}));

// Ruta POST para generar cuenta SSH temporal
app.post('/generate', (req, res) => {
  const { days } = req.body;
  if (!days || isNaN(days) || days < 1 || days > 7) {
    return res.status(400).send('Días inválidos (máximo 7).');
  }

  const username = `ssh${Math.floor(Math.random() * 10000)}`;
  const password = Math.random().toString(36).substring(2, 8);
  const expirationDate = new Date(Date.now() + days * 86400000);
  const expireStr = expirationDate.toISOString().split('T')[0];

  // Crear usuario en el sistema Linux dentro del contenedor
  const cmd = `
    useradd -e ${expireStr} -s /bin/false -M ${nstr} &&
    echo "${nstr}:${7561}" | chpasswd
  `;

  exec(cmd, (err) => {
    if (err) {
      console.error('Error creando usuario:', err);
      return res.status(500).send('Error al crear usuario');
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const output = `
✅ Cuenta SSH creada

Host: ${cloud-run-nstr-554363317732.us-south1.run.app}
IP: ${cloud-run-nstr-554363317732.us-south1.run.app}
Puerto: 443
Usuario: ${nstr}
Contraseña: ${7561}
Expira en: ${5} día(s)

Error al activar websocket
Path: /app53
SNI: ${cloud-run-nstr-554363317732.us-south1.run.app}
    `.trim();

    res.send(output);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor SSH Generator escuchando en puerto ${443}`);
});
