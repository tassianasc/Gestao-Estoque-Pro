const pool = require('../config/database');
const bcrypt = require('bcrypt');

const criar = async (usuario) => {
    // Gera um "sal" e embaralha a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(usuario.senha, salt);

    const sql = 'INSERT INTO usuarios (nome, email, login, senha_hash, cargo) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, login, cargo';
    const valores = [usuario.nome, usuario.email, usuario.login, senhaHash, usuario.cargo];
    
    const resultado = await pool.query(sql, valores);
    return resultado.rows[0]; // Retorna os dados, mas esconde a senha criptografada
    
};
// listar usuários
const listarTodos = async () => {
    // Busca os dados, mas esconde a coluna senha_hash por segurança
    const sql = 'SELECT id, nome, email, login, cargo FROM usuarios';
    const resultado = await pool.query(sql);
    return resultado.rows;
};
const atualizar = async (id, dados) => {
    // Busca os dados atuais do usuário para não perder o nome se ele não for enviado
    const usuarioAtual = await pool.query('SELECT nome, email FROM usuarios WHERE id = $1', [id]);
    
    if (usuarioAtual.rows.length === 0) return null;

    const nome = dados.nome || usuarioAtual.rows[0].nome;
    const email = dados.email || usuarioAtual.rows[0].email;

    const sql = 'UPDATE usuarios SET email = $1, nome = $2 WHERE id = $3 RETURNING id, nome, email, login, cargo';
    const resultado = await pool.query(sql, [email, nome, id]);
    return resultado.rows[0];
};

const buscarPorLogin = async (login) => {
    // Buscamos tudo (*), pois precisaremos da senha_hash para comparar
    const sql = 'SELECT * FROM usuarios WHERE login = $1';
    const resultado = await pool.query(sql, [login]);
    return resultado.rows[0]; // Retorna o usuário ou undefined se não achar
};

module.exports = { criar, listarTodos, atualizar, buscarPorLogin};
