const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');
const { Console } = require('console');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Crear servidor HTTP para WebSockets
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  // Configurar WebSocket
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('chat message', (msg) => {
      console.log('Mensaje recibido:', msg);
      io.emit('chat message', msg);  // Emitir el mensaje a todos los clientes
      console.log('Mensaje enviado') 
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  // Manejar rutas de Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Escuchar en el puerto 3000
  httpServer.listen(3000, (err) => {
    if (err) throw err;
    console.log('Servidor listo en http://localhost:3000');
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
