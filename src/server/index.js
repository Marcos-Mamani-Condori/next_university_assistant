const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const registerSockets = require('./sockets/socketchat');
const registerLikes = require('./sockets/socketlike');
const imageUploadRouter = require('./routes/imageUpload');
const { router: connectedUsersRouter, handleusers } = require('./routes/connectedUsers');
const audioUploadRouter = require('./routes/audioUpload'); 

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use('/api', imageUploadRouter);
    server.use('/api/connected-users', connectedUsersRouter); 
    server.use('/api', audioUploadRouter);

    const httpServer = http.createServer(server);
    const io = new Server(httpServer);

    io.on('connection', (socket) => {
        handleusers(socket, io); 
        registerSockets(socket, io);
        registerLikes(socket, io);
    });

    server.all('*', (req, res) => handle(req, res));

    httpServer.listen(3000, (err) => {
        if (err) throw err;
        console.log('Servidor listo en http://localhost:3000');
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});