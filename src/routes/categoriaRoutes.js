const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { autenticar, autorizar } = require('../middleware/auth');

router.get('/', autenticar, categoriaController.listar);
router.get('/:id', autenticar, categoriaController.buscarPorId);

// Apenas admin cria/edita/remove categorias
router.post('/', autenticar, autorizar('admin'), categoriaController.criar);
router.put('/:id', autenticar, autorizar('admin'), categoriaController.atualizar);
router.delete('/:id', autenticar, autorizar('admin'), categoriaController.remover);

module.exports = router;
