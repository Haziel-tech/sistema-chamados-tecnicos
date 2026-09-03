const express = require('express');
const router = express.Router();
const chamadoController = require('../controllers/chamadoController');
const comentarioController = require('../controllers/comentarioController');
const { autenticar, autorizar } = require('../middleware/auth');

// Todas as rotas de chamados exigem autenticação
router.use(autenticar);

router.post('/', chamadoController.criar);
router.get('/', chamadoController.listar);
router.get('/:id', chamadoController.buscarPorId);
router.put('/:id', chamadoController.atualizar);

// Apenas técnico ou admin podem alterar o status/atribuição do chamado
router.patch('/:id/status', autorizar('tecnico', 'admin'), chamadoController.atualizarStatus);

// Apenas admin remove chamados
router.delete('/:id', autorizar('admin'), chamadoController.remover);

// Comentários (histórico de interações do chamado)
router.post('/:id/comentarios', comentarioController.criar);
router.get('/:id/comentarios', comentarioController.listarPorChamado);

module.exports = router;
