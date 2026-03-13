require('dotenv').config();

// 1. Instância do servidor
const fastify = require('fastify')({ logger: true });

// 2. Plugins de Segurança e Autenticação
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: '12h'
  }
});

// 3. Documentação Automática (Swagger)
// Importante: Registrar ANTES das rotas para que ele possa mapeá-las corretamente
fastify.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'Gestão de Estoque',
      description: 'Solução robusta para controle de inventário, auditoria de movimentações e gestão de acessos.',
      version: '1.0.0',
      contact: {
        name: 'Suporte Técnico',
        email: 'tassia.eng@exemplo.com'
      }
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
    title: 'Alpha Tech - Gestão de Estoque',
    //  Escondendo a logo original via CSS
    css: [
      {
        content: '.swagger-ui .topbar .link img { display: none; }' 
      }
    ]
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
        projeto: 'Controle de Estoque Operacional',
        documentacao: '/documentacao'
    };
});

// 6. Inicialização (O motor)
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.clear(); // Limpa a sujeira do terminal
        console.log('=========================================');
        console.log('   SISTEMA DE GESTÃO DE ESTOQUE PRO    ');
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