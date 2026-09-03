const Usuario = require('../models/Usuario');

// POST /usuarios - cadastro de novo usuário (funcionário, técnico ou admin)
exports.criar = async (req, res) => {
  try {
    const { nome, email, senha, papel } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios' });
    }

    const existente = await Usuario.findOne({ email });
    if (existente) {
      return res.status(409).json({ erro: 'Já existe um usuário com este e-mail' });
    }

    const usuario = await Usuario.create({ nome, email, senha, papel });

    res.status(201).json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
    });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar usuário', detalhe: error.message });
  }
};

// GET /usuarios - lista todos os usuários (uso administrativo)
exports.listar = async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar usuários', detalhe: error.message });
  }
};

// GET /usuarios/:id
exports.buscarPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuário', detalhe: error.message });
  }
};

// PUT /usuarios/:id
exports.atualizar = async (req, res) => {
  try {
    const { nome, papel, ativo } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nome, papel, ativo },
      { new: true, runValidators: true }
    );
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhe: error.message });
  }
};

// DELETE /usuarios/:id
exports.remover = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json({ mensagem: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover usuário', detalhe: error.message });
  }
};
