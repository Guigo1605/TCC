require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const defineAssociations = require('./config/associations');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// --- 1. Importar Rotas ---
const authRoutes = require('./routes/authRoutes');
const agendamentoRoutes = require('./routes/agendamentoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const animalRoutes = require('./routes/animalRoutes');
const servicoRoutes = require('./routes/servicoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_padrao'; // Usar uma variável de ambiente

// --- 2. CONFIGURAÇÃO DE MIDDLEWARES E EJS (ORDEM CORRETA) ---

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware do Layout (DEVE VIR ANTES DAS ROTAS)
app.use(expressLayouts); 
app.set('layout', 'layout'); 

// Middlewares para processamento de dados e cookies
app.use(express.json()); // Para API JSON
app.use(express.urlencoded({ extended: true })); // Para dados de formulários HTML
app.use(cookieParser()); // Para ler o cookie com o token JWT

// --- MIDDLEWARE DE AUTENTICAÇÃO E INJEÇÃO DE VARIÁVEIS NA VIEW ---
// Este middleware verifica se o cookie 'token' existe e injeta os dados do usuário (payload do JWT)
// na variável local 'usuario', que é acessada por todas as views (layout.ejs, home.ejs).
app.use((req, res, next) => {
    const token = req.cookies.token;
    res.locals.usuario = null; // Garante que a variável exista para evitar ReferenceError no EJS

    if (token) {
        try {
            // Verifica o token usando o segredo
            const decoded = jwt.verify(token, JWT_SECRET);
            // Anexa os dados do usuário ao res.locals (para uso nas views)
            res.locals.usuario = decoded; 
        } catch (err) {
            // Token inválido ou expirado, apenas ignora e permite que o usuário prossiga como convidado
            console.warn("Token JWT inválido ou expirado no cookie.");
            res.clearCookie('token'); // Limpa o cookie inválido
        }
    }
    next();
});

// --- 3. CARREGAMENTO E SINCRONIZAÇÃO DO SEQUELIZE ---

console.log('1. Carregando Modelos...');
// Garante que todas as classes de Models sejam definidas antes das associações
require('./models/Usuario');
require('./models/Animal');
require('./models/Servico');
require('./models/Agendamento');
console.log('   Modelos carregados.');

console.log('2. Definindo Associações...');
defineAssociations();
console.log('   Associações definidas.');

// --- 4. MAPEAMENTO DE ROTAS ---

// Rotas de Autenticação (Login, Registro)
app.use('/', authRoutes); 

// Rota de Logout (limpa o cookie e redireciona)
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Rotas Protegidas e API
app.use('/agendamentos', agendamentoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/animais', animalRoutes);
app.use('/api/servicos', servicoRoutes);

// Rota de Home Simples (Web)
app.get('/', (req, res) => {
    // A variável 'usuario' já está em res.locals e é injetada automaticamente
    res.render('home', { title: 'Bem-vindo ao PetShop' });
});


// --- 5. Inicialização do Servidor ---

sequelize.sync({ alter: true })
  .then(() => {
    console.log('3. Conexão e Sincronização com o banco de dados estabelecidas com sucesso.');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('ERRO FATAL: Não foi possível conectar/sincronizar ao banco de dados:', err.message);
    process.exit(1);
  });