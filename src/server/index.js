const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const registerSockets = require('./sockets/socketchat');
const registerLikes = require('./sockets/socketlike');
const imageUploadRouter = require('./routes/imageUpload');
const { router: connectedUsersRouter, handleusers } = require('./routes/connectedUsers');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    let receivedData;

    // Middleware para procesar el cuerpo de las solicitudes
    server.use(express.json());

    // Rutas
    server.use('/api', imageUploadRouter);
    server.use('/api/connected-users', connectedUsersRouter);
// Ruta para manejar la recepción de datos en imgchat
server.post('/api/imgchat', (req, res) => {
    const { fileIndex } = req.body; // Extraer fileIndex del cuerpo de la solicitud

    if (typeof fileIndex === 'undefined') {
        console.error('fileIndex no está definido en la solicitud');
        return res.status(400).json({ message: 'fileIndex es requerido' });
    }

    receivedData = { fileIndex }; // Guardar los datos en la variable
    console.log('Datos recibidos en imgchat:', receivedData);

    // Convertir receivedData a string
    const receivedDataString = JSON.stringify(receivedData);
    console.log('Datos recibidos en imgchat como string:', receivedDataString);

    // Aquí puedes manejar los datos según tus necesidades, como guardarlos en la base de datos

    res.status(200).json({ message: 'Datos recibidos correctamente', data: receivedData });
});


    const httpServer = http.createServer(server);
    const io = new Server(httpServer);

    // Manejar la conexión de usuarios y emitir el conteo
    io.on('connection', (socket) => {
        handleusers(socket, io);
        registerSockets(socket, io, receivedDataString);
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
