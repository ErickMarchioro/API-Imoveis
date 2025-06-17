import express from 'express';
import imoveisController from '../controllers/imoveisController.js';
import authMiddleware from '../services/authMiddleware.js'; 
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const response = await imoveisController.getAllImoveis();
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao buscar imóveis.' });
    }
});

// GET/imoveis/meus - Listar imóveis do usuário autenticado
router.get('/meus', authMiddleware, async (req, res, next) => {
    try {
        const idProprietario = req.user.uid;
        const response = await imoveisController.getAllImoveis(idProprietario);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao buscar seus imóveis.' });
    }
});

// GET/imoveis/:id - Obter um imóvel por ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await imoveisController.getImovelById(id);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao buscar imóvel.' });
    }
});


// POST/imoveis - Criar um novo imóvel (requer autenticação)
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const imovelData = req.body;
        const idProprietario = req.user.uid;
        const response = await imoveisController.addImovel(imovelData, idProprietario);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao criar imóvel.' });
    }
});

// PUT/imoveis/:id - Atualizar um imóvel (requer autenticação e ser proprietário)
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const idProprietario = req.user.uid;
        const response = await imoveisController.updateImovel(id, updates, idProprietario);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao atualizar imóvel.' });
    }
});

// DELETE/imoveis/:id - Deletar um imóvel (requer autenticação e ser proprietário)
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const idProprietario = req.user.uid;
        const response = await imoveisController.deleteImovel(id, idProprietario);
        res.status(response.code).json(response.payload);
    } catch (error) {
        res.status(error.code || 500).json({ message: error.message || 'Erro ao deletar imóvel.' });
    }
});

export default router;