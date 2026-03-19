const pool = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * Cria um novo usuário com senha criptografada.
 * Esta função é usada tanto pela API quanto pelo processo de Bootstrap.
 */
const criar = async (usuario) => {
    // 1. Criptografia da senha (Salt + Hash)
    // Usamos o padrão $2b$ do bcrypt (10 rounds), o mais seguro para Node.js
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(usuario.senha, salt);

    const sql = `
        INSERT INTO usuarios (nome, email, login, senha_hash, cargo) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, nome, email, login, cargo, criado_em
    `;
    
    const valores = [
        usuario.nome, 
        usuario.email, 
        usuario.login, 
        senhaHash, 
        usuario.cargo || 'OPERADOR'
    ];
    
    const resultado = await pool.query(sql, valores);
    return resultado.rows[0];
};

/**
 * Lista todos os usuários (exceto as senhas)
 */
const listarTodos = async () => {
    const sql = 'SELECT id, nome, email, login, cargo, criado_em FROM usuarios ORDER BY id ASC';
    const resultado = await pool.query(sql);
    return resultado.rows;
};

/**
 * Atualiza dados básicos de um usuário
 */
const atualizar = async (id, dados) => {
    // Busca dados atuais para persistência caso campos venham vazios
    const consultaAtual = await pool.query('SELECT nome, email, cargo FROM usuarios WHERE id = $1', [id]);
    
    if (consultaAtual.rows.length === 0) return null;

    const nome = dados.nome || consultaAtual.rows[0].nome;
    const email = dados.email || consultaAtual.rows[0].email;
    const cargo = dados.cargo || consultaAtual.rows[0].cargo;

    const sql = `
        UPDATE usuarios 
        SET email = $1, nome = $2, cargo = $3 
        WHERE id = $4 
        RETURNING id, nome, email, login, cargo
    `;
    
    const resultado = await pool.query(sql, [email, nome, cargo, id]);
    return resultado.rows[0];
};

/**
 * Busca um usuário pelo login (usado no processo de Autenticação)
 */
const buscarPorLogin = async (login) => {
    // Aqui selecionamos TUDO (*) porque o Controller precisa da senha_hash para comparar
    const sql = 'SELECT * FROM usuarios WHERE login = $1';
    const resultado = await pool.query(sql, [login]);
    return resultado.rows[0];
};

module.exports = { 
    criar, 
    listarTodos, 
    atualizar, 
    buscarPorLogin 
};