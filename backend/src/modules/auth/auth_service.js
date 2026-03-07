const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthRepository = require('./auth_repository');

class AuthService {
    async login({email, password}){
        // Temporário para testes
        const user = await AuthRepository.findByEmail(email);

        if(!user){
            throw new Error("User not found")
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if(!passwordMatch){
            throw new Error("Invalid password")
        }

        const token = jwt.sign({
            sub : user.id
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn : '1d'
        })

        return {
            token,
            name : user.name,
            email : user.email
        };
    }
    async me(userId){
        const user = await AuthRepository.findById(userId);

        if(!user){
            throw new Error("User not found");
        }

        return {
            id : user.id,
            name : user.name,
            email : user.email
        }
    }

    async register({
        name,
        email,
        password
    }){
        const passwordHashed = await bcrypt.hash(password, 10);

        const user = await AuthRepository.create({
            name : name,
            email : email,
            password : passwordHashed
        })

        return true;
    }
}

module.exports = new AuthService();