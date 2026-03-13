const produtoController = require('../controllers/produtoController');
const { verificarLogado, verificarAdmin } = require('../middlewares/authMiddleware');

async function produtoRoutes(fastify, options) {
    
    // Configuração padrão para o Swagger
    const security = [{ bearerAuth: [] }];
    const tags = ['Produtos'];

    // 1. Listagem com Busca Avançada
    fastify.get('/produtos', { 
        preHandler: verificarLogado,
        schema: {
            tags,
            summary: 'Listar produtos com filtros',
            description: 'Busca avançada por nome, ref, categoria, status e alerta.',
            security,
            querystring: {
                type: 'object',
                properties: {
                    nome: { type: 'string', description: 'Busca parcial por nome' },
                    ref: { type: 'string', description: 'Busca exata pela referência' },
                    categoria: { type: 'string', description: 'Filtrar por categoria' },
                    status: { type: 'string', enum: ['ativo', 'inativo', 'todos'], description: 'Filtrar por status' },
                    alerta: { type: 'string', enum: ['true', 'false'], description: 'Mostrar apenas itens em alerta' }
                }
            }
        }
    }, produtoController.listarProdutos);

    // 2. Cadastro
   fastify.post('/produtos', { 
        preHandler: verificarLogado,
        schema: { 
            tags, 
            summary: 'Cadastrar novo produto', 
            security,
            body: {
                type: 'object',
                required: ['nome', 'ref', 'categoria', 'quantidade_atual', 'limite_alerta'],
                properties: {
                    nome: { type: 'string', minLength: 3 },
                    ref: { type: 'string' },
                    categoria: { type: 'string' },
                    quantidade_atual: { type: 'number', minimum: 0 },
                    limite_alerta: { type: 'number', minimum: 0 }
                }
            }
        }
    }, produtoController.cadastrarProduto);
    // 3. Edição Geral
   fastify.patch('/produtos/:ref', { 
        preHandler: verificarLogado,
        schema: { 
            tags, 
            summary: 'Editar dados do produto', 
            security,
            params: {
                type: 'object',
                properties: {
                    ref: { type: 'string', description: 'Referência atual do produto' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    nome: { type: 'string', minLength: 3, description: 'Novo nome do material' },
                    categoria: { type: 'string', description: 'Nova categoria (ex: Chapas, Ferragens)' },
                    limite_alerta: { type: 'number', description: 'Novo estoque mínimo de segurança' },
                    ref: { type: 'string', description: 'Nova referência (se precisar mudar o código)' }
                }
                // Note que não incluímos 'quantidade_atual' aqui para respeitar a trava de auditoria!
            }
        }
    }, produtoController.editarProduto);

    // 4. Desativar (Soft Delete)
    fastify.patch('/produtos/:ref/desativar', { 
        preHandler: verificarLogado,
        schema: { tags, summary: 'Desativar produto (Ocultar)', security }
    }, produtoController.desativarProduto);

    // 5. Reativar
    fastify.patch('/produtos/:ref/reativar', { 
        preHandler: verificarLogado,
        schema: { tags, summary: 'Reativar produto', security }
    }, produtoController.reativarProduto);

    // 6. Excluir Permanentemente (Admin)
    fastify.delete('/produtos/:ref', { 
        preHandler: verificarAdmin,
        schema: { tags, summary: 'DELETAR permanentemente (Admin)', security }
    }, produtoController.deletarProduto);

    // 7. Alertas de Estoque
    fastify.get('/produtos/alertas', { 
        preHandler: verificarLogado,
        schema: { tags, summary: 'Listar produtos com estoque baixo', security }
    }, produtoController.listarAlertas);
}

module.exports = produtoRoutes;