// backend/src/routes.js

const { Router } = require('express');
const UserController = require('./controllers/UserController');
const AnimalController = require('./controllers/AnimalController'); 
const AppointmentController = require('./controllers/AppointmentController');
const authMiddleware = require('./middlewares/auth');

const routes = new Router();

// Rotas de Autenticação (Acesso Público)
routes.post('/users', UserController.store);     
routes.post('/sessions', UserController.login);  

routes.use(authMiddleware); 

// --- Rotas de Animais (Atualizadas) ---
routes.post('/animals', AnimalController.store);
routes.get('/animals', AnimalController.index);
routes.put('/animals/:animal_id', AnimalController.update);   // EDIÇÃO
routes.delete('/animals/:animal_id', AnimalController.delete); // EXCLUSÃO

// --- Rotas de Agendamentos (Existentes) ---
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.put('/appointments/:appointment_id', AppointmentController.update); 
routes.delete('/appointments/:appointment_id', AppointmentController.delete);

module.exports = routes;