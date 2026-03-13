const movimentacaoController = require('../controllers/movimentacaoController');
const { verificarLogado, verificarAdmin } = require('../middlewares/authMiddleware');

async function movimentacaoRoutes(fastify, options) {
    const security = [{ bearerAuth: [] }];
    const tags = ['Movimentações'];
    
    // 1. Rota para Registrar Entrada ou Saída
    fastify.post('/movimentacoes', { 
        preHandler: verificarLogado,
        schema: { 
            tags, 
            summary: 'Registrar entrada ou saída de estoque', 
            security,
            body: {
                type: 'object',
                required: ['produto_id', 'tipo', 'quantidade'],
                properties: {
                    produto_id: { type: 'integer', description: 'ID numérico do produto (ex: 5)' },
                    tipo: { 
                        type: 'string', 
                        enum: ['ENTRADA', 'SAIDA'], 
                        description: 'Tipo da operação' 
                    },
                    quantidade: { type: 'number', minimum: 0.1, description: 'Quantidade a ser movimentada' },
                    observacao: { type: 'string', description: 'Opcional: Motivo da movimentação' }
                }
            }
        }
    }, movimentacaoController.criarMovimentacao);

    // Rota para Auditoria (Apenas Admin)
    fastify.get('/movimentacoes', { 
        preHandler: verificarAdmin,
        schema: { 
            tags, 
            summary: 'Consultar histórico completo de auditoria', 
            security 
        }
    }, movimentacaoController.listarMovimentacoes);
}

module.exports = movimentacaoRoutes;