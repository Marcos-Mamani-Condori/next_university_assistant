const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("image"), async (req, res) => {
  console.log("Iniciando procesamiento de imagen...");

  if (!req.file) {
    console.log("Error: No se subió ningún archivo");
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

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

    const inputSource = req.body.inputSource;
    console.log("Valor de inputSource:", inputSource);

    if (inputSource === "inputChat") {
      const userFolderPath = path.join(
        __dirname,
        "../../../public/uploads",
        userId.toString()
      );
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
        console.log(`Carpeta creada: ${userFolderPath}`);
      }

      let fileIndex = 1;
      do {
        outputFileName = `${fileIndex}.webp`;
        outputFilePath = path.join(userFolderPath, outputFileName);
        fileIndex++;
      } while (fs.existsSync(outputFilePath));

      console.log(`Ruta final para guardar la imagen en inputChat: ${outputFilePath}`);
    } else {
      outputFileName = `${userId}.webp`; 
      outputFilePath = path.join(__dirname, "../../../public/uploads", outputFileName);
      console.log(`Ruta final para guardar la imagen general: ${outputFilePath}`);
    }

    await sharp(req.file.buffer)
      .resize(500, 500, { fit: "inside", kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 100 })
      .toFile(outputFilePath);

    console.log(`Imagen comprimida y guardada con éxito: ${outputFilePath}`);

    const finalFileIndex = inputSource === "inputChat" 
      ? parseInt(outputFileName.replace(".webp", "")) 
      : userId; 

    res.status(200).json({
      message: "Imagen convertida a WebP correctamente",
      fileIndex: finalFileIndex, 
      filePath: inputSource === "inputChat" 
        ? `/uploads/${userId}/${outputFileName}` 
        : `/uploads/${outputFileName}`,
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
