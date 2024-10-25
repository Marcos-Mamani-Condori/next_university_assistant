const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io'); // Importar Socket.IO
const registerSockets = require('./sockets/socketchat'); // Importar archivo de sockets
const registerLikes = require('./sockets/socketlike');  
const imageUploadRouter = require('./routes/imageUpload'); // Importar el router de la subida de imágenes

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Usar el router para manejar la subida y compresión de imágenes
    server.use('/api', imageUploadRouter);

    // Crear servidor HTTP para WebSockets
    const httpServer = http.createServer(server);
    
    // Crear instancia de Socket.IO
    const io = require('socket.io')(httpServer); // Inicializar Socket.IO con el servidor HTTP

    // Registrar los sockets en la instancia de Socket.IO
    registerSockets(io);  // Inicia la configuración de socketchat
    registerLikes(io);    // Inicia la configuración de socketlike

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
