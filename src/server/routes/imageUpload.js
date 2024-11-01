const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const router = express.Router();

// Configurar multer para recibir el archivo como buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir y comprimir imágenes
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
    }

    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No se proporcionó token' });
    }

    const token = authHeader.split(' ')[1]; // Asumiendo que el formato es "Bearer TOKEN"

    try {
        // Decodificar el token usando el secreto
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        const userId = decoded.id; // Asegúrate de que el ID esté en el token
        console.log(`ID del usuario obtenido: ${userId}`); // Consola del ID del usuario

        // Crear carpeta para el usuario si no existe
        const userFolderPath = path.join(__dirname, '../../../public/uploads', userId.toString());
        if (!fs.existsSync(userFolderPath)) {
            fs.mkdirSync(userFolderPath, { recursive: true });
            console.log(`Carpeta creada: ${userFolderPath}`);
        } else {
            console.log(`La carpeta ya existe: ${userFolderPath}`);
        }

        // Crear un nombre de archivo único
        let fileIndex = 1;
        let outputFilePath;
        let outputFileName;

        // Generar un nombre de archivo único en la carpeta del usuario
        do {
            outputFileName = `${fileIndex}.webp`;
            outputFilePath = path.join(userFolderPath, outputFileName);
            fileIndex++;
        } while (fs.existsSync(outputFilePath));

        // Comprimir la imagen directamente desde el buffer
        await sharp(req.file.buffer)
            .resize(500, 500, { fit: 'inside', kernel: sharp.kernel.lanczos3 })
            .webp({ quality: 100 })
            .toFile(outputFilePath);

        console.log(`Imagen comprimida y guardada como: ${outputFileName} en ${userFolderPath}`);
        const filePath = `${userId}/${outputFileName}`;

// Enviar el filePath como parte de un objeto a la API imgchat
const imgChatResponse = await fetch('http://localhost:3000/api/imgchat', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filePath: filePath }), // Envío como un objeto
});

        // Consola para verificar el nombre enviado
        console.log(`Enviando a imgchat: {  ${filePath} }`);

        if (!imgChatResponse.ok) {
            console.error('Error al enviar a imgchat:', imgChatResponse.statusText);
            return res.status(500).json({ error: 'Error al enviar a imgchat' });
        }

        res.status(200).json({
            message: 'Imagen convertida a WebP correctamente',
            filePath: `/uploads/${userId}/${outputFileName}`, // Retorna la ruta pública correcta
        });
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        res.status(500).json({ error: 'Error al procesar la imagen' });
    }
});

module.exports = router;
