const usuarioController = require('../controllers/usuarioController');
const { verificarAdmin } = require('../middlewares/authMiddleware');

async function usuarioRoutes(fastify, options) {
    const security = [{ bearerAuth: [] }];
    const tags = ['Usuários'];

    // 1. Esquema para Criar Usuário
    const cadastroSchema = {
        schema: {
            tags,
            summary: 'Cadastrar novo usuário (Admin)',
            security,
            body: {
                type: 'object',
                required: ['nome', 'email', 'login', 'senha', 'cargo'],
                properties: {
                    nome: { type: 'string', minLength: 2 },
                    email: { type: 'string', format: 'email' },
                    login: { type: 'string', minLength: 3 },
                    senha: { type: 'string', minLength: 6 },
                    cargo: { type: 'string', enum: ['ADMIN', 'ESTOQUISTA'] }
                }
            }
        },
        preHandler: verificarAdmin
    };

    // 2. Esquema para Login
    const loginSchema = {
        schema: {
            tags,
            summary: 'Realizar login',
            body: {
                type: 'object',
                required: ['login', 'senha'],
                properties: {
                    login: { type: 'string' },
                    senha: { type: 'string' }
                }
            }
        }
    };

    // Login
    fastify.post('/login', loginSchema, usuarioController.login);

    // Listar usuários
    fastify.get('/usuarios', { 
        preHandler: verificarAdmin,
        schema: { tags, summary: 'Listar todos os usuários (Admin)', security }
    }, usuarioController.listarUsuarios);

    // Cadastrar usuário
    fastify.post('/usuarios', cadastroSchema, usuarioController.cadastrarUsuario);

    fastify.patch('/usuarios/:id', { 
        preHandler: verificarAdmin,
        schema: { 
            tags, 
            summary: 'Editar dados de um usuário (Admin)', 
            security,
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'ID do usuário' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    nome: { type: 'string', minLength: 2 },
                    email: { type: 'string', format: 'email' },
                    login: { type: 'string', minLength: 3 },
                    senha: { type: 'string', minLength: 6 },
                    cargo: { type: 'string', enum: ['ADMIN', 'ESTOQUISTA'] }
                }
            }
        }
    }, usuarioController.editarUsuario);
}

module.exports = usuarioRoutes;