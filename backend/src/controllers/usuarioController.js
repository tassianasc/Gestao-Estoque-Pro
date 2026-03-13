const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (request, reply) => {
    try {
        const novoUsuario = await usuarioModel.criar(request.body);
        return reply.code(201).send(novoUsuario);
    } catch (erro) {
        request.log.error(erro);
        return reply.code(500).send({ erro: 'Falha ao cadastrar. O login pode já existir.' });
    }
};
// Listar usuários
const listarUsuarios = async (request, reply) => {
    try {
        const usuarios = await usuarioModel.listarTodos();
        return reply.send(usuarios);
    } catch (erro) {
        request.log.error(erro);
        return reply.code(500).send({ erro: 'Falha ao buscar usuários.' });
    }
};

const editarUsuario = async (request, reply) => {
    try {
        const { id } = request.params;
        const usuarioAtualizado = await usuarioModel.atualizar(id, request.body);
        return reply.send(usuarioAtualizado);
    } catch (erro) {
        return reply.code(500).send({ erro: 'Falha ao atualizar usuário.' });
    }
};

const login = async (request, reply) => {
    const { login, senha } = request.body;

    // 1. Tenta achar o usuário
    const usuario = await usuarioModel.buscarPorLogin(login);

    if (!usuario) {
        return reply.code(401).send({ erro: 'Usuário ou senha inválidos.' });
    }

    // 2. Compara a senha digitada com o "embaralhado" (Hash) do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
        return reply.code(401).send({ erro: 'Usuário ou senha inválidos.' });
    }

    const token = request.server.jwt.sign({ 
        id: usuario.id, 
        cargo: usuario.cargo 
    });

    return reply.send({ token });
};

module.exports = { cadastrarUsuario, listarUsuarios, editarUsuario, login};