const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io'); // Importar Socket.IO
const registerSockets = require('./sockets/socketchat'); // Importar archivo de sockets de chat
const registerLikes = require('./sockets/socketlike'); // Importar archivo de sockets de likes
const imageUploadRouter = require('./routes/imageUpload'); // Importar el router de la subida de imágenes

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use('/api', imageUploadRouter);

    const httpServer = http.createServer(server);
    
    const io = new Server(httpServer);

    let connectedUsers = 0;

    io.on('connection', (socket) => {
        connectedUsers++; 
        console.log(`Usuario conectado. Total de usuarios: ${connectedUsers}`);
        
        io.emit('user_count', connectedUsers);

        registerSockets(socket, io); 
        registerLikes(socket, io);    

        socket.on('disconnect', () => {
            connectedUsers--; 
            console.log(`Usuario desconectado. Total de usuarios: ${connectedUsers}`);
            io.emit('user_count', connectedUsers); 
        });
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    httpServer.listen(3000, (err) => {
        if (err) throw err;
        console.log('Servidor listo en http://localhost:3000');
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
