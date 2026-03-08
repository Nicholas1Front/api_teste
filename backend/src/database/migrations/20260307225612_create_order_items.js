/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('order_items', table =>{
        table.bigIncrements('id').primary();
        table.bigInteger('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE');
        table.bigInteger('item_id').unsigned().references('id').inTable('items').onDelete('CASCADE');
        table.integer('quantity').notNullable();
        table.integer('price').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('order_items');
};
