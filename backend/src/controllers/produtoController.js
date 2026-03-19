const produtoModel = require('../models/produtoModel');
const movimentacaoModel= require('../models/movimentacaoModel');

const cadastrarProduto = async (request, reply) => {
    try {
        const novoProduto = await produtoModel.criar(request.body);
        return reply.code(201).send(novoProduto);
    } catch (erro) {
        request.log.error(erro);
        return reply.code(500).send({ erro: 'Falha ao cadastrar o produto.' });
    }
};

const listarProdutos = async (request, reply) => {
    try {
        // Captura ?nome=mdf da URL
        const { nome } = request.query;

        // Se o usuário logado for ESTOQUISTA, forçamos apenasAtivos: true
        // Se for ADMIN, futuramente você pode ver os inativos
        const apenasAtivos = request.user.cargo !== 'ADMIN' ? true : true; 

        const produtos = await produtoModel.listarTodos(request.query);
        
        return reply.send(produtos);
    } catch (erro) {
        request.log.error(erro);
        return reply.code(500).send({ erro: 'Falha ao listar produtos.' });
    }
};

const editarProduto = async (request, reply) => {
    const { ref } = request.params; // Pegamos a referência da URL
    const dados = request.body;

    // BLOQUEIO DE AUDITORIA: Saldo só muda via Movimentação
    if (dados.quantidade_atual !== undefined) {
        return reply.code(400).send({
            erro: "Operação não permitida",
            motivo: "O campo 'quantidade_atual' é protegido. Use a rota de Movimentações para alterar o estoque."
        });
    }

    try {
        const produtoAtualizado = await produtoModel.atualizarPorRef(ref, dados);
        
        if (!produtoAtualizado) {
            return reply.code(404).send({ erro: 'Produto não encontrado com esta referência.' });
        }

        return reply.send({
            mensagem: "Produto atualizado com sucesso!",
            produto: produtoAtualizado
        });
    } catch (erro) {
        return reply.code(500).send({ erro: 'Falha interna ao atualizar o produto.' });
    }
};

//  ex: DELETE /produtos/MDF-BRANCO-15
const deletarProduto = async (request, reply) => {
    try {
        const { ref } = request.params;
        const produtoDeletado = await produtoModel.deletarPorRef(ref); // Nova função no Model
        
        if (!produtoDeletado) {
            return reply.code(404).send({ erro: 'Produto com esta referência não encontrado.' });
        }
        return reply.send({ mensagem: 'Produto removido do catálogo.' });
    } catch (erro) {
        return reply.code(500).send({ erro: 'Erro interno ao deletar.' });
    }
};

const listarAlertas = async (request, reply) => {
    try {
        const produtosEmAlerta = await produtoModel.buscarAlertas();
        
        return reply.send({
            total_itens_criticos: produtosEmAlerta.length,
            itens: produtosEmAlerta,
            mensagem: produtosEmAlerta.length > 0 
                ? "Atenção: Os itens destacados estão com estoque igual ou abaixo do limite!" 
                : "Tudo certo! Nenhum item em estado crítico."
        });
    } catch (erro) {
        return reply.code(500).send({ erro: 'Falha ao buscar alertas de estoque.' });
    }
};

const desativarProduto = async (request, reply) => {
    const { ref } = request.params;
    const usuarioId = request.user.id; // Pegamos do Token

    try {
        const produto = await produtoModel.mudarStatusAtivo(ref, false);
        
        if (!produto) return reply.code(404).send({ erro: 'Produto não encontrado.' });

        // REGISTRO NA AUDITORIA
        await movimentacaoModel.registrar({
            produto_id: produto.id,
            usuario_id: usuarioId,
            tipo: 'DESATIVACAO',
            quantidade: 0,
            observacao: `Produto ocultado do sistema.`
        });

        return reply.send({ mensagem: 'Produto desativado com sucesso.' });
    } catch (erro) {
        return reply.code(500).send({ erro: 'Falha ao desativar.' });
    }
};


const reativarProduto = async (request, reply) => {
    const { ref } = request.params;
    const usuarioId = request.user.id;

    try {
        // 1. Muda o status para TRUE no banco de dados
        const produto = await produtoModel.mudarStatusAtivo(ref, true);
        
        if (!produto) return reply.code(404).send({ erro: 'Produto não encontrado.' });

        // 2. Registra o rastro da reativação na auditoria
        await movimentacaoModel.registrar({
            produto_id: produto.id,
            usuario_id: usuarioId,
            tipo: 'ATIVACAO', 
            quantidade: 0,
            observacao: `Produto reativado e disponível novamente no estoque.`
        });

        return reply.send({ mensagem: `Produto '${produto.nome}' reativado com sucesso!` });
    } catch (erro) {
        return reply.code(500).send({ erro: 'Falha ao reativar produto.' });
    }
};

module.exports = { cadastrarProduto, listarProdutos, deletarProduto, editarProduto, listarAlertas, desativarProduto, reativarProduto };