const Chamado = require('../models/Chamado');

// POST /chamados - qualquer usuário autenticado pode abrir um chamado
exports.criar = async (req, res) => {
  try {
    const { titulo, descricao, categoria, prioridade } = req.body;

    if (!titulo || !descricao || !categoria) {
      return res.status(400).json({ erro: 'Título, descrição e categoria são obrigatórios' });
    }

    const chamado = await Chamado.create({
      titulo,
      descricao,
      categoria,
      prioridade,
      solicitante: req.usuario.id,
    });

    res.status(201).json(chamado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar chamado', detalhe: error.message });
  }
};

// GET /chamados - lista chamados com filtros opcionais (status, prioridade, categoria, tecnico)
exports.listar = async (req, res) => {
  try {
    const { status, prioridade, categoria, tecnicoResponsavel } = req.query;
    const filtro = {};
    if (status) filtro.status = status;
    if (prioridade) filtro.prioridade = prioridade;
    if (categoria) filtro.categoria = categoria;
    if (tecnicoResponsavel) filtro.tecnicoResponsavel = tecnicoResponsavel;

    // Funcionário comum só vê os próprios chamados; técnico e admin veem todos
    if (req.usuario.papel === 'funcionario') {
      filtro.solicitante = req.usuario.id;
    }

    const chamados = await Chamado.find(filtro)
      .populate('categoria', 'nome')
      .populate('solicitante', 'nome email')
      .populate('tecnicoResponsavel', 'nome email')
      .sort({ createdAt: -1 });

    res.json(chamados);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar chamados', detalhe: error.message });
  }
};

// GET /chamados/:id
exports.buscarPorId = async (req, res) => {
  try {
    const chamado = await Chamado.findById(req.params.id)
      .populate('categoria', 'nome')
      .populate('solicitante', 'nome email')
      .populate('tecnicoResponsavel', 'nome email');

    if (!chamado) return res.status(404).json({ erro: 'Chamado não encontrado' });
    res.json(chamado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar chamado', detalhe: error.message });
  }
};

// PUT /chamados/:id - atualização geral (título, descrição, categoria, prioridade)
exports.atualizar = async (req, res) => {
  try {
    const { titulo, descricao, categoria, prioridade } = req.body;
    const chamado = await Chamado.findByIdAndUpdate(
      req.params.id,
      { titulo, descricao, categoria, prioridade },
      { new: true, runValidators: true }
    );
    if (!chamado) return res.status(404).json({ erro: 'Chamado não encontrado' });
    res.json(chamado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar chamado', detalhe: error.message });
  }
};

// PATCH /chamados/:id/status - apenas técnico ou admin podem alterar status
exports.atualizarStatus = async (req, res) => {
  try {
    const { status, tecnicoResponsavel } = req.body;

    const dadosAtualizados = { status };
    if (tecnicoResponsavel) dadosAtualizados.tecnicoResponsavel = tecnicoResponsavel;
    if (status === 'fechado' || status === 'resolvido') {
      dadosAtualizados.dataFechamento = new Date();
    }

    const chamado = await Chamado.findByIdAndUpdate(req.params.id, dadosAtualizados, {
      new: true,
      runValidators: true,
    });

    if (!chamado) return res.status(404).json({ erro: 'Chamado não encontrado' });
    res.json(chamado);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar status do chamado', detalhe: error.message });
  }
};

// DELETE /chamados/:id - apenas admin
exports.remover = async (req, res) => {
  try {
    const chamado = await Chamado.findByIdAndDelete(req.params.id);
    if (!chamado) return res.status(404).json({ erro: 'Chamado não encontrado' });
    res.json({ mensagem: 'Chamado removido com sucesso' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao remover chamado', detalhe: error.message });
  }
};
