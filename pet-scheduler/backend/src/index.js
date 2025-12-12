require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

// Importa a conexão com o banco para garantir que ela ocorra
require('./models'); 

const app = express();

app.use(cors());
app.use(express.json()); // Permite que a API entenda JSON
app.use(routes);

module.exports = app;