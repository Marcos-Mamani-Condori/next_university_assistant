// src/server/sockets/socketchat.js
const { Server } = require('socket.io');

const registerSockets = (httpServer) => {
    const io = new Server(httpServer);

    // Configurar WebSocket
    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('chat message', (msg) => {
            console.log('Mensaje recibido:', msg);
            io.emit('chat message', msg);  // Emitir el mensaje a todos los clientes
            console.log('Mensaje enviado');
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });

    console.log('Socket.IO configurado y escuchando');
};

module.exports = registerSockets;
