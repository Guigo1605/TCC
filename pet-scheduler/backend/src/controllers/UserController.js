const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = {

  // --- REGISTRO DE NOVO USUÁRIO (TUTOR) ---
  async store(req, res) {
    const { name, email, password } = req.body;

    // 1. Verifica se o usuário já existe
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // 2. Cria o novo usuário
    try {
      // Passamos 'password' que é capturado pelo hook beforeSave do modelo User.js
      user = await User.create({ name, email, password }); 

      // 3. Gera o Token JWT para o novo usuário logado
      const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      // Retorna os dados do usuário e o token
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  },

  // --- LOGIN (AUTENTICAÇÃO) ---
  async login(req, res) {
    const { email, password } = req.body;

    // 1. Busca o usuário pelo e-mail
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    // 2. Verifica se a senha está correta
    // O método checkPassword é definido no modelo User.js
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // 3. Gera o Token JWT
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    // 4. Retorna os dados e o token
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  },
};