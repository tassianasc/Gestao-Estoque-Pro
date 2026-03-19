require('dotenv').config();

// 1. Instância do servidor
const fastify = require('fastify')({ logger: true });
// lógica de inicialização automática
const { inicializarAdmin } = require('./src/config/bootstrap');

// 2. Plugins de Segurança e Autenticação
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || 'chave_secreta_padrao',
  sign: {
    expiresIn: '12h'
  }
});

// 3. Documentação Automática (Swagger)
fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'Alpha Tech - Gestão de Estoque',
      description: 'Solução robusta para controle de inventário e gestão de acessos.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
});

fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/documentacao',
  theme: {
    title: 'Alpha Tech - API Docs',
    css: [{ content: '.swagger-ui .topbar .link img { display: none; }' }]
  },
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
});

// 4. Registro das Rotas do Sistema
fastify.register(require('./src/routes/produtoRoutes'));
fastify.register(require('./src/routes/usuarioRoutes'));
fastify.register(require('./src/routes/movimentacaoRoutes'));

// 5. Rota de Saúde (Health Check)
fastify.get('/', async (request, reply) => {
    return { 
        status: 'API Online',
        projeto: 'Alpha Tech Operacional',
        documentacao: '/documentacao'
    };
});

// 6. Inicialização (O motor)
const start = async () => {
    try {
        // Liga o servidor na porta 3000
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        
        // Assim que o servidor liga, verificamos se precisamos criar o Admin
        await inicializarAdmin();

        console.clear();
        console.log('=========================================');
        console.log('    SISTEMA DE GESTÃO DE ESTOQUE PRO    ');
        console.log('=========================================');
        console.log('🚀 Status: ONLINE');
        console.log('📖 Documentação: http://localhost:3000/documentacao');
        console.log('=========================================');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();