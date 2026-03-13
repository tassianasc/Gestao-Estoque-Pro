const pool = require('../config/database');

const registrar = async (movimentacao) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Checagem de Saldo (Apenas para Saídas reais)
        if (movimentacao.tipo === 'SAIDA') {
            const estoqueCheck = await client.query('SELECT quantidade_atual FROM produtos WHERE id = $1', [movimentacao.produto_id]);
            const saldoAtual = estoqueCheck.rows[0].quantidade_atual;

            if (saldoAtual < movimentacao.quantidade) {
                throw new Error(`Saldo insuficiente. Disponível: ${saldoAtual}`);
            }
        }

        // 2. Registra a movimentação (Histórico de Auditoria)
        const sqlMov = `INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, observacao) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const resMov = await client.query(sqlMov, [movimentacao.produto_id, movimentacao.usuario_id, movimentacao.tipo, movimentacao.quantidade, movimentacao.observacao]);

        // 3. ATUALIZAÇÃO DE SALDO (Apenas para ENTRADA ou SAIDA)
        let novoSaldo;
        if (['ENTRADA', 'SAIDA'].includes(movimentacao.tipo)) {
            const operador = movimentacao.tipo === 'ENTRADA' ? '+' : '-';
            const sqlProd = `UPDATE produtos SET quantidade_atual = quantidade_atual ${operador} $1 WHERE id = $2 RETURNING quantidade_atual`;
            const resProd = await client.query(sqlProd, [movimentacao.quantidade, movimentacao.produto_id]);
            novoSaldo = resProd.rows[0].quantidade_atual;
        } else {
            // Se for ATIVACAO ou DESATIVACAO, apenas buscamos o saldo atual sem alterar nada
            const resProd = await client.query('SELECT quantidade_atual FROM produtos WHERE id = $1', [movimentacao.produto_id]);
            novoSaldo = resProd.rows[0].quantidade_atual;
        }

        await client.query('COMMIT');
        return { movimentacao: resMov.rows[0], novo_saldo: novoSaldo };
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

const listarTodas = async () => {
    // Note que mudei de data_hora para data_movimentacao aqui
    const sql = `
        SELECT 
            m.id,
            p.nome as produto,
            u.nome as usuario,
            m.tipo,
            m.quantidade,
            m.observacao,
            m.data_movimentacao 
        FROM movimentacoes m
        JOIN produtos p ON m.produto_id = p.id
        JOIN usuarios u ON m.usuario_id = u.id
        ORDER BY m.data_movimentacao DESC`; 
    
    const resultado = await pool.query(sql);
    return resultado.rows;
};

module.exports = { registrar, listarTodas };