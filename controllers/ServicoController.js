const Servico = require('../models/Servico');

// Middleware de autorização para ADMIN
const checkAdmin = (req, res, next) => {
  if (req.usuario.perfil !== 'admin') {
    return res.status(403).json({ msg: 'Acesso negado. Requer perfil de administrador.' });
  }
  next();
};

// 1. Listar todos os serviços (acessível por qualquer um logado)
exports.index = async (req, res) => {
  try {
    const servicos = await Servico.findAll({ order: [['nome', 'ASC']] });

    if (req.accepts('json')) {
      return res.json(servicos);
    }
    res.render('servicos/index', { title: 'Nossos Serviços', servicos });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços.' });
  }
};

// 2. Criar novo serviço (Apenas ADMIN)
exports.create = [checkAdmin, async (req, res) => {
  const { nome, descricao, preco } = req.body;
  try {
    const novoServico = await Servico.create({ nome, descricao, preco });
    res.status(201).json(novoServico);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar serviço.', details: error.message });
  }
}];

// 3. Deletar serviço (Apenas ADMIN)
exports.delete = [checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Servico.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ msg: 'Serviço não encontrado.' });
    }
    res.json({ msg: 'Serviço excluído com sucesso!' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir serviço.' });
  }
}];