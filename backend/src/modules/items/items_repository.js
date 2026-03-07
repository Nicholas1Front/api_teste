const knex = require('../../database/knex');

class ItemsRepository{
    async create({
        name,
        description,
        price,
        quantity
    }){
        const item = await knex('items').insert({
            name : name,
            description : description,
            price : price,
            quantity : quantity
        }).returning('*');

        return item[0];
    }

    async update({
        id,
        itemData
    }){
        const item = await knex('items').where({id}).update(itemData).returning('*');

        return item[0];
    }

    async delete(id){
        await knex('items').where({id}).del();

        return true;
    }

    async find({
        id,
        name,
        description,
        price
    }){
        const query = knex('items');

        if(id !== undefined){
            query.where({id});
        }

        if(name !== undefined){
            query.where({name});
        }

        if(description !== undefined){
            query.where({description});
        }

        if(price !== undefined){
            query.where({price});
        }

        return query.orderBy('id', 'asc');
    }

    async findAll(){
        const items = await knex('items').orderBy('id', 'asc');

        return items;
    }
}

module.exports = new ItemsRepository();