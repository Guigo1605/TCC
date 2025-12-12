// backend/server.js
const app = require('./src/index');
const connection = require('./src/models'); // Importa a conexão Sequelize

const PORT = process.env.PORT || 3333;

// *** Adicionar este bloco temporário ***
// Força a criação das tabelas se elas não existirem
connection.sync({ force: false }) 
  .then(() => {
    // Inicia o servidor Express somente após a conexão e sincronização com o DB
    app.listen(PORT, () => {
      console.log(`|-------------------------------------------|`);
      console.log(`| 🐾 Servidor Pet Scheduler Rodando!        |`);
      console.log(`| 📍 URL: http://localhost:${PORT}             |`);
      console.log(`|-------------------------------------------|`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', err);
    process.exit(1); // Sai do processo em caso de erro no DB
  });