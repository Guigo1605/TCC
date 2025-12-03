const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

// Middleware para autorização de ADMIN ou dono do perfil
const checkOwnerOrAdmin = (req, res, next) => {
  const { id } = req.params;
  // Permite se for ADMIN ou se o ID do parâmetro for o ID do usuário logado
  if (req.usuario.perfil === 'admin' || req.usuario.id == id) {
    return next();
  }
  return res.status(403).json({ msg: 'Acesso negado. Você não tem permissão para acessar este recurso.' });
};

// 1. Listar todos os usuários (Apenas ADMIN)
exports.index = async (req, res) => {
  // Simplesmente verifica se é admin (a verificação de perfil deve estar na rota/middleware)
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nome', 'email', 'perfil', 'telefone'] // Não retorna a senha
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// 2. Mostrar detalhes de um usuário (Admin ou Dono do perfil)
exports.show = [checkOwnerOrAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: ['id', 'nome', 'email', 'perfil', 'telefone']
    });
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
}];

// 3. Atualizar dados do usuário (Admin ou Dono do perfil)
exports.update = [checkOwnerOrAdmin, async (req, res) => {
  const { nome, email, senha, telefone, perfil } = req.body;
  const { id } = req.params;
  
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const dataToUpdate = { nome, email, telefone };

    // Se a senha for fornecida, gera novo hash
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.senha = await bcrypt.hash(senha, salt);
    }
    
    // Apenas ADMIN pode alterar o perfil de outro usuário
    if (perfil && req.usuario.perfil === 'admin' && req.usuario.id != id) {
        dataToUpdate.perfil = perfil;
    } else if (perfil && req.usuario.id == id) {
        // Previne que o próprio usuário altere seu perfil
        return res.status(403).json({ msg: 'Você não pode alterar seu próprio perfil.' });
    }

    await usuario.update(dataToUpdate);
    res.json({ msg: 'Usuário atualizado com sucesso!' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
}];