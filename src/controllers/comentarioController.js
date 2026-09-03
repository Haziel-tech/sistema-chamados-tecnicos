const Comentario = require('../models/Comentario');

// POST /chamados/:id/comentarios
exports.criar = async (req, res) => {
  try {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ erro: 'O texto do comentário é obrigatório' });

    const comentario = await Comentario.create({
      chamado: req.params.id,
      autor: req.usuario.id,
      texto,
    });

    const comentarioPopulado = await comentario.populate('autor', 'nome papel');
    res.status(201).json(comentarioPopulado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar comentário', detalhe: error.message });
  }
};

// GET /chamados/:id/comentarios
exports.listarPorChamado = async (req, res) => {
  try {
    const comentarios = await Comentario.find({ chamado: req.params.id })
      .populate('autor', 'nome papel')
      .sort({ createdAt: 1 });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar comentários', detalhe: error.message });
  }
};
