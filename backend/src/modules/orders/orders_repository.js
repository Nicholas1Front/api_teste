const knex = require('../../database/knex');

class OrdersRepository{
    async create({
        user_id,
        name,
        total_price
    }){
        const order = await knex('orders').insert({
            user_id : user_id,
            name : name,
            total_price : total_price
        }).returning('*');

        return order[0];
    }

    async update({
        id,
        user_id,
        name,
        total_price
    }){
        const order = await knex('orders').where({ id }).update({
            user_id : user_id,
            name : name,
            total_price : total_price,
            updated_at : knex.fn.now()
        }).returning('*');

        return order[0];
    }

    async delete(id){
        await knex('orders').where({ id }).del();

        return true;
    }

    async findAll(){
        const orders = await knex('orders').select('*');

        return orders;
    }

    async find({
        id,
        user_id,
        name,
        total_price
     }){
        const query = knex('orders').select('*');

        if(id !== undefined){
            query.where({ id });
        }

        if(user_id !== undefined){
            query.where({ user_id });
        }

        if(name !== undefined){
            query.where({ name });
        }

        if(total_price !== undefined){
            query.where({ total_price });
        }

        return query.orderBy('id', 'desc');
    }
}

module.exports = new OrdersRepository();