const knex = require('../../database/knex');

class AuthRepository {

    async create({
        name,
        email,
        password
    }){
        const user = await knex('users').insert({
            name,
            email,
            password_hash : password
        }).returning('*');

        return user[0];
    }

    async findById(id){
        const user = await knex('users')
        .where({id})
        .first();

        return user;
    }
    async findByEmail(email){
        const user = await knex('users')
        .where({email})
        .first();

        return user;
    }
}

module.exports = new AuthRepository();