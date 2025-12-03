require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario'); // Certifique-se de que o caminho está correto

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // 1. Encontra o usuário
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      // Para segurança, use a mesma mensagem para email e senha errados
      return res.status(400).json({ msg: 'Credenciais inválidas (email ou senha).' }); 
    }

    // 2. Compara a senha
    const isMatch = await bcrypt.compare(senha, usuario.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas (email ou senha).' });
    }

    // 3. Gera o JWT
    const payload = {
      usuario: {
        id: usuario.id,
        perfil: usuario.perfil,
        nome: usuario.nome
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' }, // Token expira em 1 dia
      (err, token) => {
        if (err) throw err;
        
        // Se a requisição aceita HTML (Web), redireciona após setar o cookie
        if (!req.accepts('json')) {
            res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 dia
            console.log(`Usuário ${usuario.nome} logado. JWT gerado.`);
            return res.redirect('/'); 
        }

        // Resposta API
        res.json({ token, perfil: usuario.perfil }); 
      }
    );

  } catch (err) {
    console.error("Erro no login:", err.message);
    res.status(500).send('Erro no Servidor');
  }
};

exports.register = async (req, res) => {
  const { nome, email, senha, telefone, perfil } = req.body;
  try {
    // Verifica se o usuário já existe
    let existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ msg: 'Email já registrado.' });
    }

    const novoUsuario = await Usuario.create({ 
        nome, 
        email, 
        senha, // A senha será hashada pelo hook 'beforeCreate' no Model
        telefone,
        perfil: perfil === 'admin' ? 'admin' : 'cliente' // Prevenindo criação acidental de admin
    });
    
    // Resposta API ou Web
    if (req.accepts('json')) {
        return res.status(201).json({ msg: 'Usuário registrado com sucesso!', userId: novoUsuario.id });
    }
    res.redirect('/login');

  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: 'Erro ao registrar usuário.', details: err.message });
  }
};