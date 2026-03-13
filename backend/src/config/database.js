// Importa a biblioteca do PostgreSQL e o leitor de senhas
const { Pool } = require('pg');
require('dotenv').config();

// Cria a configuração de conexão puxando do arquivo .env
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

// Tenta fazer a conexão e avisa se deu certo ou errado
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar no banco de dados:', err.stack);
    } else {
        console.log('Conexão ESTABELECIDA COM SUCESSO! O motor está rodando. 🚀');
        release(); // Libera a conexão
    }
});

// Exporta essa configuração para usarmos no resto do sistema
module.exports = pool;