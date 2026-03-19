const movimentacaoModel = require('../models/movimentacaoModel');

const criarMovimentacao = async (request, reply) => {
    const { produto_id, tipo, quantidade, observacao } = request.body;
    const usuario_id = request.user.id;

    try {
        const resultado = await movimentacaoModel.registrar({
            produto_id,
            usuario_id,
            tipo,
            quantidade,
            observacao
        });
        return reply.code(201).send(resultado);
    } catch (err) {
        if (err.message.includes('insuficiente')) {
            return reply.code(400).send({ erro: err.message });
        }
        return reply.code(500).send({ erro: 'Falha ao registrar movimentação.' });
    }
};

const listarMovimentacoes = async (request, reply) => {
    try {
        const historico = await movimentacaoModel.listarTodas();
        return reply.send(historico);
    } catch (err) {
        console.error("ERRO REAL AQUI ->", err);
        return reply.code(500).send({ erro: 'Erro ao buscar histórico de auditoria.' });
    }
};

module.exports = { criarMovimentacao, listarMovimentacoes };