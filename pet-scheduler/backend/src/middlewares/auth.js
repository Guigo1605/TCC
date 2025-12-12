const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const authConfig = require('../config/auth');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se o token foi fornecido
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // O formato é 'Bearer TOKEN', precisamos separar o token
  const [, token] = authHeader.split(' ');

  // 2. Tenta verificar e decodificar o token
  try {
    // promisify transforma uma função baseada em callback (jwt.verify) em uma função async/await
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // 3. Adiciona o ID do usuário (do payload do token) na requisição
    // Isso é útil para saber QUEM está fazendo a requisição nos controllers
    req.userId = decoded.id; 

    // Continua para a próxima função (o Controller)
    return next(); 

  } catch (err) {
    // Se a chave secreta não bater ou o token estiver expirado
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};