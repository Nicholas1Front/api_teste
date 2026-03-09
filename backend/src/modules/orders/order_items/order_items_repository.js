const knex = require('../../../database/knex');

class OrderItemsRepository {
    async create({
        item_id,
        order_id,
        quantity,
        price
    }){
        const order_item = await knex('order_items').insert({
            order_id : order_id,
            item_id : item_id,
            quantity : quantity,
            price : price
        }).returning('*');

        return order_item[0];
    }

    async update({
        id,
        item_id,
        order_id,
        quantity,
        price
    }){
        const order_item = await knex('order_items').where({ id }).update({
            order_id : order_id,
            item_id : item_id,
            quantity : quantity,
            price : price,
            updated_at : knex.fn.now()
        }).returning('*');

        return order_item[0];
    }

    async deleteByOrderId(order_id){
        await knex('order_items').where({ order_id }).del();

        return true;
    }

    async findByOrderId(order_id){
        const query = knex('order_items').select('*').where({ order_id });

        const order_items = query.orderBy('id', 'asc');

        return order_items;
    }
}

module.exports = new OrderItemsRepository();