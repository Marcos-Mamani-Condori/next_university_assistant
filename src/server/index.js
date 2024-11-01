const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const registerSockets = require('./sockets/socketchat');
const registerLikes = require('./sockets/socketlike');
const imageUploadRouter = require('./routes/imageUpload');
const { router: connectedUsersRouter, handleusers } = require('./routes/connectedUsers');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    let receivedData; // Variable para almacenar los datos recibidos

    // Middleware para procesar el cuerpo de las solicitudes
    server.use(express.json());
    server.use(bodyParser.text());

    // Rutas
    server.use('/api', imageUploadRouter);
    server.use('/api/connected-users', connectedUsersRouter);

    server.post('/api/imgchat', (req, res) => {
        const { fileIndex } = req.body; // Extraer fileIndex y message del cuerpo de la solicitud
    
        // Asegúrate de que fileIndex es un número
        if (typeof fileIndex === 'undefined' || isNaN(fileIndex)) {
            console.error('fileIndex no está definido o no es un número válido en la solicitud');
        }
    
        receivedData = String(fileIndex); // Convertir a cadena
        console.log('Datos recibidos en imgchat:', { fileIndex: receivedData }); // Mostrar ambos datos
    
        res.status(200).json({ message: 'Datos recibidos correctamente'+ { receivedData } });
    });
    
    console.log('Datos recibidos en idsaaaaaaaaaaaaaamgchat:', receivedData);

    const httpServer = http.createServer(server);
    const io = new Server(httpServer);

    // Manejar la conexión de usuarios y emitir el conteo
    io.on('connection', (socket) => {
        handleusers(socket, io);
        
        // Asegúrate de que receivedData esté definido antes de pasarlo
        registerSockets(socket, io, receivedData);
        registerLikes(socket, io);

        // Escuchar el evento newFileIndex para obtener los datos actualizados
            registerSockets(socket, io, message); // Actualiza registerSockets con el nuevo data
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
