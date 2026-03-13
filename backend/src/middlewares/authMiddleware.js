const verificarLogado = async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.code(401).send({ erro: 'Token inválido ou ausente.' });
    }
};

const verificarAdmin = async (request, reply) => {
    try {
        // Primeiro valida se está logado
        await request.jwtVerify();
        
        // Depois valida se é admin
        if (request.user.cargo !== 'ADMIN') {
            return reply.code(403).send({ 
                erro: 'Acesso Negado: Esta operação exige privilégios de administrador.' 
            });
        }
    } catch (err) {
        return reply.code(401).send({ erro: 'Token inválido ou ausente.' });
    }
};

module.exports = { verificarLogado, verificarAdmin };