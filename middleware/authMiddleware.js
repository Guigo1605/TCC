require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Pega o token do header 'Authorization'
  const token = req.header('Authorization');

  // Verifica se o token existe e tem o formato 'Bearer <token>'
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Acesso negado. Token não fornecido ou inválido.' });
  }

  try {
    const tokenPayload = token.split(' ')[1]; // Extrai o token sem 'Bearer '
    
    // Verifica e decodifica o token
    const decoded = jwt.verify(tokenPayload, process.env.JWT_SECRET);
    
    // Anexa os dados do usuário (payload) à requisição
    req.usuario = decoded.usuario; 
    
    next(); // Continua para o próximo middleware/controller
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido.' });
  }
};

module.exports = authMiddleware;