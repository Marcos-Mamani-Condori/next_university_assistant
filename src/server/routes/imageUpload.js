const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const jwt = require('jsonwebtoken');

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

    console.log('ID de usuario:', userId); // Muestra el ID en la consola

    const outputFilePath = path.join(__dirname, '../../../public/uploads', `${userId}.webp`);
    console.log('Ruta de salida:', outputFilePath); // Muestra la ruta del archivo de salida

    // Comprimir la imagen directamente desde el buffer
    await sharp(req.file.buffer)
      .resize(500, 500, { fit: 'inside', kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 100 })
      .toFile(outputFilePath);

    res.status(200).json({
      message: 'Imagen convertida a WebP correctamente',
      filePath: `/uploads/${userId}.webp`, // Retorna la ruta pública
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
