const knex = require('../../database/knex');

class DevService{
    async resetDatabase(){
        await knex.raw(`TRUNCATE TABLE users, items, orders, order_items RESTART IDENTITY CASCADE`);

        return { message : 'Database has been reset successfully.' };
    }
}

module.exports = new DevService();