const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No se proporcionó token de autenticación" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.log("Error al verificar el token", error);
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = authenticate;
