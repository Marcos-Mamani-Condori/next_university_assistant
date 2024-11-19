const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const generateUniqueFilename = (directory, baseName, extension) => {
  let counter = 1;
  let uniqueName;

  do {
    uniqueName = `${baseName}${counter}${extension}`;
    counter++;
  } while (fs.existsSync(path.join(directory, uniqueName)));  

  return uniqueName;
};

router.post("/upload-audio", authenticate, upload.single("audio"), async (req, res) => {
  console.log("Iniciando procesamiento de audio...");

  if (!req.file) {
    console.log("Error: No se subió ningún archivo");
    return res.status(400).json({ error: "No se subió ningún archivo" });
  }

  try {
    const userId = req.user.id;

    const userFolderPath = path.join(
      __dirname,
      "../../../uploads/audio",
      userId.toString()
    );

    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
      console.log(`Carpeta creada: ${userFolderPath}`);
    }

    const baseName = "audio";
    const extension = ".mp3"; 
    const uniqueFileName = generateUniqueFilename(userFolderPath, baseName, extension);
    const outputFilePath = path.join(userFolderPath, uniqueFileName);

    fs.writeFileSync(outputFilePath, req.file.buffer);

    res.status(200).json({
      message: "Audio recibido correctamente",
      filePath: `/uploads/audio/${userId}/${uniqueFileName}`,
    });
  } catch (error) {
    console.error("Error al procesar el audio:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error al procesar el audio" });
  }
});

module.exports = router;
