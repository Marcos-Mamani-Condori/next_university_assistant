const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Configurar multer para recibir el archivo como buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir y comprimir imágenes
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  const outputFilePath = path.join(__dirname, '../../uploads', `${path.parse(req.file.originalname).name}.webp`);

  try {
    // Comprimir la imagen directamente desde el buffer
    await sharp(req.file.buffer)
      .resize(500, 500, { fit: 'inside', kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 100 }) // Utiliza una calidad de 100
      .toFile(outputFilePath); // Guardar el archivo comprimido

    res.status(200).json({
      message: 'Imagen convertida a WebP correctamente',
      filePath: outputFilePath,
    });
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).json({ error: 'Error al procesar la imagen' });
  }
});

module.exports = router;
