import express from 'express';
import usersController from '../controllers/usersController.js';
const router = express.Router();


router.get('/', function(req, res, next) {
  res.send('API de Usuários: Use POST /users para criar e POST /users/login para logar.');
});

router.post('/', async function(req, res, next) {
  try {
    const { email, password } = req.body;
    const response = await usersController.criaLoginFirebase(email, password);
    res.status(response.code).json(response.payload);
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message || 'Erro interno do servidor.' });
  }
});

router.post('/login', async function(req, res, next) {
  try {
    const { email, password } = req.body;
    const response = await usersController.loginFirebase(email, password);
    res.status(response.code).json(response.payload);
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message || 'Erro interno do servidor.' });
  }
});

export default router;