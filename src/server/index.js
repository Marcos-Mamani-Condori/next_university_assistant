// src/server/index.js
const express = require('express');
const http = require('http');
const next = require('next');
const registerSockets = require('./sockets/socketchat'); // Importar el archivo de sockets

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Crear servidor HTTP para WebSockets
    const httpServer = http.createServer(server);

    // Registrar los sockets
    registerSockets(httpServer);

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
