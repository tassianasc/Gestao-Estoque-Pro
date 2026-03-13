// Importa a nossa ponte de conexão
const pool = require('./database');

// Função assíncrona para criar as tabelas passo a passo
const construirBanco = async () => {
    try {
        console.log('Iniciando a construção das tabelas...');

        await pool.query(`
            -- Tabela 1: Usuários do sistema (Login)
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                login TEXT UNIQUE NOT NULL,
                senha_hash TEXT NOT NULL,
                cargo TEXT CHECK (cargo IN ('ADMIN', 'OPERADOR')) DEFAULT 'OPERADOR',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabela 2: O Estoque de Produtos
            CREATE TABLE IF NOT EXISTS produtos (
                id SERIAL PRIMARY KEY,
                codigo_ref TEXT UNIQUE NOT NULL,
                nome TEXT NOT NULL,
                quantidade_atual INTEGER DEFAULT 0,
                limite_alerta INTEGER DEFAULT 5,
                ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Tabela 3: O Histórico de Retiradas e Entradas
            CREATE TABLE IF NOT EXISTS movimentacoes (
                id SERIAL PRIMARY KEY,
                produto_id INTEGER REFERENCES produtos(id),
                usuario_id INTEGER REFERENCES usuarios(id),
                funcionario_destino TEXT,
                quantidade INTEGER NOT NULL,
                tipo TEXT CHECK (tipo IN ('ENTRADA', 'SAIDA', 'AJUSTE')),
                data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Tudo pronto! Tabelas criadas com sucesso.');
    } catch (erro) {
        console.error('❌ Ops, deu um erro ao criar as tabelas:', erro);
    } finally {
        // Encerra a conexão quando terminar a obra
        pool.end(); 
    }
};

// Executa a função
construirBanco();