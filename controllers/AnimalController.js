const Animal = require('../models/Animal');

// 1. Listar todos os animais (ou animais de um usuário específico, se cliente)
exports.index = async (req, res) => {
  try {
    const isCliente = req.usuario.perfil === 'cliente';
    let options = {};

    // Se for cliente, lista apenas seus próprios animais
    if (isCliente) {
      options.where = { usuario_id: req.usuario.id };
    }

    const animais = await Animal.findAll(options);

    if (req.accepts('json')) {
      return res.json(animais);
    }
    res.render('animais/index', { title: 'Meus Pets', animais });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar animais.' });
  }
};

// 2. Criar novo animal
exports.create = async (req, res) => {
  const { nome, especie, raca, data_nascimento } = req.body;
  const usuario_id = req.usuario.id; // O dono é o usuário logado

  try {
    const novoAnimal = await Animal.create({ nome, especie, raca, data_nascimento, usuario_id });
    res.status(201).json(novoAnimal);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao cadastrar animal.', details: error.message });
  }
};

// 3. Atualizar animal
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, especie, raca, data_nascimento } = req.body;
  const usuario_id = req.usuario.id;

  try {
    const animal = await Animal.findByPk(id);

    if (!animal) {
      return res.status(404).json({ msg: 'Animal não encontrado.' });
    }

    // Garante que o cliente só edite seu próprio animal
    if (req.usuario.perfil === 'cliente' && animal.usuario_id !== usuario_id) {
      return res.status(403).json({ msg: 'Acesso negado. Você não é o dono deste animal.' });
    }

    await animal.update({ nome, especie, raca, data_nascimento });
    res.json({ msg: 'Animal atualizado com sucesso!', animal });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar animal.' });
  }
};
// ... (Métodos show e delete seriam adicionados)