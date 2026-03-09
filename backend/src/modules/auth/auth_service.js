const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthRepository = require('./auth_repository');

/**
 * Service responsável por gerenciar a autenticação dos usuários.
 * 
 * Aqui ficam as regras relacionadas a:
 * - Login de usuários
 * - Registro de novos usuários
 * - Consulta de dados do usuário autenticado
 * 
 * Este service utiliza:
 * - bcrypt para verificação e hash de senha
 * - jsonwebtoken para geração de tokens JWT
 * - AuthRepository para comunicação com o banco de dados
 */
class AuthService {

    /**
     * Realiza o login do usuário no sistema.
     * 
     * O processo consiste em:
     * 1. Buscar o usuário pelo email
     * 2. Comparar a senha enviada com a senha armazenada (hash)
     * 3. Gerar um token JWT caso a autenticação seja válida
     * 
     * @param {Object} params
     * @param {string} params.email - Email do usuário
     * @param {string} params.password - Senha enviada pelo usuário
     * 
     * @returns {Object} Dados do usuário autenticado e token JWT
     */
    async login({email, password}){

        // Temporário para testes
        // Busca o usuário no banco de dados através do email
        const user = await AuthRepository.findByEmail(email);

        // Caso o usuário não exista, retorna erro
        if(!user){
            throw new Error("User not found")
        }

        // Compara a senha enviada com o hash armazenado no banco
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        // Caso a senha não seja válida, retorna erro
        if(!passwordMatch){
            throw new Error("Invalid password")
        }

        // Gera um token JWT contendo o ID do usuário no campo "sub"
        const token = jwt.sign({
            sub : user.id
        }, 
        process.env.JWT_SECRET,
        {
            // Define o tempo de expiração do token
            expiresIn : '1d'
        })

        // Retorna o token e algumas informações básicas do usuário
        return {
            token,
            name : user.name,
            email : user.email
        };
    }

    /**
     * Retorna os dados do usuário autenticado.
     * 
     * Normalmente este método é utilizado após a validação
     * do token JWT em um middleware de autenticação.
     * 
     * @param {number|string} userId - ID do usuário autenticado
     * 
     * @returns {Object} Dados básicos do usuário
     */
    async me(userId){

        // Busca o usuário no banco de dados pelo ID
        const user = await AuthRepository.findById(userId);

        // Caso o usuário não exista, retorna erro
        if(!user){
            throw new Error("User not found");
        }

        // Retorna apenas informações públicas do usuário
        return {
            id : user.id,
            name : user.name,
            email : user.email
        }
    }

    /**
     * Realiza o registro de um novo usuário no sistema.
     * 
     * O processo consiste em:
     * 1. Gerar um hash da senha enviada
     * 2. Criar o usuário no banco de dados
     * 
     * @param {Object} params
     * @param {string} params.name - Nome do usuário
     * @param {string} params.email - Email do usuário
     * @param {string} params.password - Senha em texto puro
     * 
     * @returns {boolean} true indicando que o cadastro foi realizado
     */
    async register({
        name,
        email,
        password
    }){

        // Gera o hash da senha utilizando bcrypt
        const passwordHashed = await bcrypt.hash(password, 10);

        // Cria o usuário no banco de dados através do repository
        const user = await AuthRepository.create({
            name : name,
            email : email,
            password : passwordHashed
        })

        // Retorna true indicando que o cadastro foi realizado com sucesso
        return true;
    }
}

module.exports = new AuthService();