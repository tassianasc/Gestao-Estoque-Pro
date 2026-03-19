const usuarioModel = require('../models/usuarioModel');

/**
 * Função de inicialização automática (Bootstrap).
 * Agora com lógica de "Retry" para esperar o banco de dados ligar.
 */
const inicializarAdmin = async (tentativas = 5) => {
    console.log(`🔍 [Bootstrap] Tentando conectar ao banco... (Tentativas restantes: ${tentativas})`);
    
    try {
        // 1. Tenta listar os usuários
        const usuariosExistentes = await usuarioModel.listarTodos();
        
        if (usuariosExistentes.length === 0) {
            console.log('🛡️ [Bootstrap] Banco vazio detectado. Criando administrador inicial...');
            
            const dadosAdmin = {
                nome: 'Administrador Alpha Tech',
                email: process.env.ADMIN_EMAIL || 'admin@alphatech.com',
                login: process.env.ADMIN_LOGIN || 'admin',
                senha: process.env.ADMIN_PASS || 'admin123',
                cargo: 'ADMIN'
            };

            await usuarioModel.criar(dadosAdmin);
            console.log('✅ [Bootstrap] Administrador criado com sucesso!');
        } else {
            console.log('ℹ️ [Bootstrap] Usuários já configurados. Pronto para uso.');
        }
    } catch (erro) {
        if (tentativas > 0) {
            console.log('⏳ [Bootstrap] Banco ainda não está pronto. Aguardando 3 segundos...');
            // Espera 3 segundos antes de tentar de novo
            await new Promise(resolve => setTimeout(resolve, 3000));
            return inicializarAdmin(tentativas - 1);
        } else {
            console.error('❌ [Bootstrap] Erro definitivo após várias tentativas:', erro.message);
        }
    }
};

module.exports = { inicializarAdmin };