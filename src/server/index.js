const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const registerSockets = require('./sockets/socketchat');
const registerLikes = require('./sockets/socketlike');
const imageUploadRouter = require('./routes/imageUpload');
const { router: connectedUsersRouter, handleusers } = require('./routes/connectedUsers');
const { router: apiRouter, getReceivedData } = require('./routes/url'); // Importar el nuevo router
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Middleware para procesar el cuerpo de las solicitudes
    server.use(express.json());
    server.use(bodyParser.text());

    // Usar las rutas
    server.use('/api', apiRouter); // Usar el router de la API
    server.use('/api', imageUploadRouter);
    server.use('/api/connected-users', connectedUsersRouter);

    // Crear el servidor HTTP
    const httpServer = http.createServer(server);
    const io = new Server(httpServer);

    // Manejar la conexión de usuarios
    io.on('connection', (socket) => {
        console.log("Cliente conectado:", socket.id);

        // Emitir el fileIndex actual al nuevo cliente conectado
        socket.emit('fileIndex', { img: getReceivedData() }); // Llamar a getReceivedData para obtener el valor actual

        handleusers(socket, io);
        registerSockets(socket, io, getReceivedData()); // Pasar el valor actual de receivedData
        registerLikes(socket, io);
    });

    // Manejar todas las demás rutas con Next.js
    server.all('*', (req, res) => handle(req, res));

    // Iniciar el servidor en el puerto 3000
    httpServer.listen(3000, (err) => {
        if (err) throw err;
        console.log('Servidor listo en http://localhost:3000');
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
