const Categoria = require('../models/Categoria');

exports.criar = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome) return res.status(400).json({ erro: 'O nome da categoria é obrigatório' });

    const categoria = await Categoria.create({ nome, descricao });
    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar categoria', detalhe: error.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nome: 1 });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar categorias', detalhe: error.message });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar categoria', detalhe: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nome, descricao },
      { new: true, runValidators: true }
    );
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar categoria', detalhe: error.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover categoria', detalhe: error.message });
  }
};
