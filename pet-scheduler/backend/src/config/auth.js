module.exports = {
  // Chave secreta para assinatura dos tokens (lida do .env)
  secret: process.env.JWT_SECRET, 
  
  // Opções de expiração do token (lida do .env)
  expiresIn: process.env.JWT_EXPIRES_IN || '1d', 
};