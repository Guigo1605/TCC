const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = {

  // --- REGISTRO DE NOVO USUÁRIO (SIGNUP) ---
  async store(req, res) {
    const { name, email, password } = req.body;

    // 1. Verifica se o usuário já existe
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
    }

    try {
      // 2. Cria o usuário. O hook beforeSave no modelo User.js fará a criptografia.
      user = await User.create({ name, email, password }); 

      // 3. Gera o token de acesso
      const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      // 4. Retorna os dados do usuário e o token
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

  // --- AUTENTICAÇÃO DE USUÁRIO (LOGIN) ---
  async login(req, res) {
    const { email, password } = req.body;

    // 1. Busca o usuário pelo email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado.' });
    }

    // 2. Compara a senha digitada com o hash salvo no DB
    // A função checkPassword está definida no modelo User.js
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // 3. Gera o token se a senha estiver correta
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    // 4. Retorna o sucesso
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