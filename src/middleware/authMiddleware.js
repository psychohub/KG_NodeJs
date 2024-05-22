const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  // Obtener el token desde la cabecera 'Authorization'
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o caducado' });
  }
};

