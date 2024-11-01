const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Configurar multer para recibir el archivo como buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ruta para subir y comprimir imágenes
router.post("/upload", upload.single("image"), async (req, res) => {
  console.log("Iniciando procesamiento de imagen...");

  // Verificar si se subió un archivo
  if (!req.file) {
    console.log("Error: No se subió ningún archivo");
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  // Verificar si se proporcionó el token de autenticación
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("Error: No se proporcionó token de autenticación");
    return res.status(401).json({ error: "No se proporcionó token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    console.log("Token verificado, datos decodificados:", decoded);

    const userId = decoded.id;
    let outputFileName;
    let outputFilePath;

    // Crear la carpeta del usuario si no existe
    const userFolderPath = path.join(
      __dirname,
      "../../../public/uploads",
      userId.toString()
    );
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
      console.log(`Carpeta creada: ${userFolderPath}`);
    }

    // Generar un nombre de archivo único en la carpeta del usuario
    let fileIndex = 1;
    do {
      outputFileName = `${fileIndex}.webp`;
      outputFilePath = path.join(userFolderPath, outputFileName);
      fileIndex++;
    } while (fs.existsSync(outputFilePath));

    console.log(`Ruta final para guardar la imagen: ${outputFilePath}`);

    // Procesar la imagen con Sharp
    await sharp(req.file.buffer)
      .resize(500, 500, { fit: "inside", kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 100 })
      .toFile(outputFilePath);

    console.log(`Imagen comprimida y guardada con éxito: ${outputFilePath}`);

    const finalFileIndex = parseInt(outputFileName.replace(".webp", ""));

    // Enviar la respuesta al frontend incluyendo el fileIndex
    res.status(200).json({
      message: "Imagen convertida a WebP correctamente",
      fileIndex: finalFileIndex, // Enviando el fileIndex al frontend
      filePath: `/uploads/${userId}/${outputFileName}`,
    });
  } catch (error) {
    console.error("Error al procesar la imagen:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error al procesar la imagen" });
  }
});

module.exports = router;
