module.exports = {
  // Configuração do SGBD
  dialect: 'mysql', 
  
  // Variáveis de Conexão (Serão lidas do .env)
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Porta padrão do MySQL
  
  // Opções adicionais
  define: {
    // Nomes de tabelas e colunas em snake_case (padrão do SQL)
    underscored: true,
    
    // Adiciona as colunas 'createdAt' e 'updatedAt' automaticamente
    timestamps: true,
    
    // Evita pluralização automática (opcional, dependendo do seu estilo)
    freezeTableName: false, 
  },
  
  // Configurações para pool de conexões
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
};