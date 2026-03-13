const pool = require('../config/database');

const criar = async (produto) => {
    const { nome, ref, categoria, quantidade_atual, limite_alerta } = produto;
    
    const sql = `
        INSERT INTO produtos (nome, ref, categoria, quantidade_atual, limite_alerta) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`;
    
    const resultado = await pool.query(sql, [nome, ref, categoria, quantidade_atual, limite_alerta]);
    return resultado.rows[0];
};

const listarTodos = async (filtros = {}) => {
    const { nome, ref, status, categoria, alerta } = filtros;
    
    let sql = 'SELECT * FROM produtos WHERE 1=1';
    const valores = [];

    // Filtro por Referência Exata
    if (ref) {
        valores.push(ref);
        sql += ` AND ref = $${valores.length}`;
    }

    // Filtro por Nome (Busca Parcial)
    if (nome) {
        valores.push(`%${nome}%`);
        sql += ` AND nome ILIKE $${valores.length}`;
    }

    // Filtro por Categoria
    if (categoria) {
        valores.push(categoria);
        sql += ` AND categoria = $${valores.length}`;
    }

    // Soft Delete: Se status for inativo, mostra só os falsos
    if (status === 'inativo') {
        sql += ' AND ativo = FALSE';
    } else if (status !== 'todos') {
        sql += ' AND ativo = TRUE'; // Por padrão, só mostra ativos
    }

    // Filtro de Alerta
    if (alerta === 'true') {
        sql += ' AND quantidade_atual <= limite_alerta';
    }

    sql += ' ORDER BY nome ASC';

    const resultado = await pool.query(sql, valores);
    return resultado.rows;
};

const atualizarPorRef = async (ref, dados) => {
    // 1. Desestruturamos os dados que o Controller enviou
    const { nome, categoria, limite_alerta } = dados;

    // 2. O SQL precisa usar 'ref' no WHERE e 'limite_alerta' no SET
    const sql = `
        UPDATE produtos 
        SET nome = $1, categoria = $2, limite_alerta = $3 
        WHERE ref = $4 
        RETURNING *`;

    const resultado = await pool.query(sql, [nome, categoria, limite_alerta, ref]);
    
    return resultado.rows[0];
};

const deletarPorRef = async (ref) => {
    const sql = 'DELETE FROM produtos WHERE ref = $1 RETURNING *';
    const resultado = await pool.query(sql, [ref]);
    
    // Retorna o produto deletado (útil para mostrar na mensagem de confirmação)
    return resultado.rows[0]; 
};

const buscarAlertas = async () => {
    // A mágica acontece neste WHERE: onde o estoque é menor ou igual ao limite
    const sql = `
        SELECT id, ref, nome, quantidade_atual, limite_alerta 
        FROM produtos 
        WHERE quantidade_atual <= limite_alerta
        ORDER BY (limite_alerta - quantidade_atual) DESC`; 
    
    const resultado = await pool.query(sql);
    return resultado.rows;
};

const mudarStatusAtivo = async (ref, status) => {
    const sql = `
        UPDATE produtos 
        SET ativo = $1 
        WHERE ref = $2 
        RETURNING *`;
    
    const resultado = await pool.query(sql, [status, ref]);
    return resultado.rows[0];
};

module.exports = { criar, listarTodos, deletarPorRef, atualizarPorRef, buscarAlertas, mudarStatusAtivo};
