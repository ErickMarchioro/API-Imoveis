import express from 'express';
import reservasController from '../controllers/reservasController.js';
import authMiddleware from '../services/authMiddleware.js'; 
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
    try {
        const filters = {
            idImovel: req.query.idImovel,
            idUsuario: req.query.idUsuario 
        };
        const idUsuarioLogado = req.user.uid;
        const userNivel = req.user.nivel; 
        const response = await reservasController.getAllReservas(filters, idUsuarioLogado, userNivel);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao buscar reservas.' });
    }
});

// GET/reservas/:id - Obter uma reserva por ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const idUsuarioLogado = req.user.uid;
        const userNivel = req.user.nivel;
        const response = await reservasController.getReservaById(id, idUsuarioLogado, userNivel);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao buscar reserva.' });
    }
});

// POST /reservas - Criar uma nova reserva
router.post('/', async (req, res, next) => {
    try {
        const reservaData = req.body;
        const idUsuarioLogado = req.user.uid;
        const response = await reservasController.addReserva(reservaData, idUsuarioLogado);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao criar reserva.' });
    }
});

// PUT /reservas/:id - Atualizar uma reserva
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const idUsuarioLogado = req.user.uid;
        const userNivel = req.user.nivel;
        const response = await reservasController.updateReserva(id, updates, idUsuarioLogado, userNivel);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao atualizar reserva.' });
    }
});

// DELETE /reservas/:id - Deletar uma reserva
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const idUsuarioLogado = req.user.uid;
        const userNivel = req.user.nivel;
        const response = await reservasController.deleteReserva(id, idUsuarioLogado, userNivel);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao deletar reserva.' });
    }
});

export default router;