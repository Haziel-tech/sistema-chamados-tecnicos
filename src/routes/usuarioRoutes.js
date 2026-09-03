const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { autenticar, autorizar } = require('../middleware/auth');

// Cadastro público (ex: funcionário se cadastrando)
router.post('/', usuarioController.criar);

// Demais operações exigem autenticação; listar/editar/remover exigem admin
router.get('/', autenticar, autorizar('admin'), usuarioController.listar);
router.get('/:id', autenticar, usuarioController.buscarPorId);
router.put('/:id', autenticar, autorizar('admin'), usuarioController.atualizar);
router.delete('/:id', autenticar, autorizar('admin'), usuarioController.remover);

module.exports = router;
