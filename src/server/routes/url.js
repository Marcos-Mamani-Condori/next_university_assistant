// src/routes/url.js

const express = require('express');

const router = express.Router();

// Variable global para almacenar el fileIndex recibido
let receivedData = null;

// Ruta para recibir el fileIndex
router.post('/receive-file-index', (req, res) => {
    const { img } = req.body; // Acceder al fileIndex
    console.log("File Index recibido:", img);
    if (img) {
        // Almacenar el fileIndex en la variable global
        receivedData = img;
        console.log("File Index almacenado:", receivedData);
        // Emitir el nuevo fileIndex a todos los sockets conectados
        // Aquí asumiendo que 'io' se pasará como argumento desde el archivo index
        return res.status(200).json({ message: 'File Index recibido correctamente' });
    } else {
        return res.status(400).json({ error: 'File Index no proporcionado' });
    }
});

// Exportar la variable para que pueda ser usada en otros módulos
const getReceivedData = () => receivedData;

module.exports = { router, getReceivedData };
