const Agendamento = require('../models/Agendamento');
const Animal = require('../models/Animal');
const Servico = require('../models/Servico');
const Usuario = require('../models/Usuario');

// Método auxiliar para buscar dados necessários para views de criação/edição
const fetchPrerequisites = async (usuarioId) => {
    // Busca apenas os animais pertencentes ao usuário logado
    const animais = await Animal.findAll({ 
        where: { usuario_id: usuarioId },
        attributes: ['id', 'nome', 'especie'] 
    });
    // Busca todos os serviços disponíveis
    const servicos = await Servico.findAll({
        attributes: ['id', 'nome', 'preco'] 
    });
    return { animais, servicos };
};

// 1. Mostrar todos os agendamentos (admin) ou do cliente (cliente)
exports.index = async (req, res) => {
  try {
    const isCliente = req.usuario.perfil === 'cliente';
    let options = {
      include: [
        { model: Animal, as: 'pet', attributes: ['nome', 'especie'] },
        { model: Servico, as: 'servicoContratado', attributes: ['nome', 'preco'] },
        { model: Usuario, as: 'cliente', attributes: ['nome', 'email'] }
      ],
      order: [['data_hora', 'ASC']]
    };

    // Filtra por usuário se for cliente
    if (isCliente) {
      options.where = { usuario_id: req.usuario.id };
    }

    const agendamentos = await Agendamento.findAll(options);

    // Resposta API ou Web
    if (req.accepts('json')) {
      return res.json(agendamentos);
    }
    res.render('agendamentos/index', { 
      title: 'Meus Agendamentos', 
      agendamentos,
      isCliente 
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agendamentos.' });
  }
};

// 2. Mostrar formulário de criação
exports.showCreateForm = async (req, res) => {
    try {
        const { animais, servicos } = await fetchPrerequisites(req.usuario.id);

        res.render('agendamentos/create', { 
            title: 'Novo Agendamento', 
            animais, 
            servicos 
        });

    } catch (error) {
        res.status(500).send('Erro ao carregar dados para o agendamento.');
    }
};

// 3. Criar novo agendamento (via POST)
exports.create = async (req, res) => {
  const { data_hora, animal_id, servico_id, observacoes } = req.body;
  const usuario_id = req.usuario.id; // ID do usuário logado (cliente)

  try {
    // 1. Verifica se o animal pertence ao usuário logado
    const pet = await Animal.findOne({ where: { id: animal_id, usuario_id } });
    if (!pet) {
        return res.status(403).json({ msg: 'Animal inválido ou você não é o dono.' });
    }

    const novoAgendamento = await Agendamento.create({
      data_hora,
      usuario_id,
      animal_id,
      servico_id,
      observacoes,
      status: 'pendente'
    });

    // Resposta API: retorna o objeto JSON
    if (req.accepts('json')) {
        return res.status(201).json(novoAgendamento);
    }
    
    // Resposta Web: redireciona
    res.redirect('/agendamentos'); 

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao criar agendamento.', details: error.message });
  }
};

// 4. Deletar agendamento (apenas admin ou o próprio cliente, se for futuro)
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const agendamento = await Agendamento.findByPk(id);

        if (!agendamento) {
            return res.status(404).json({ msg: 'Agendamento não encontrado.' });
        }

        const isOwner = agendamento.usuario_id === req.usuario.id;
        const isAdmin = req.usuario.perfil === 'admin';

        // Permite exclusão se for ADMIN ou se for dono E o agendamento ainda não passou
        if (!isAdmin && (!isOwner || new Date(agendamento.data_hora) < new Date())) {
            return res.status(403).json({ msg: 'Acesso negado. Você não pode cancelar este agendamento.' });
        }

        await agendamento.destroy();
        
        // Resposta API ou Web
        if (req.accepts('json')) {
             return res.json({ msg: 'Agendamento cancelado com sucesso!' });
        }
        res.redirect('/agendamentos');

    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar agendamento.' });
    }
};

// ... (Métodos show e update seriam implementados para completar o CRUD)