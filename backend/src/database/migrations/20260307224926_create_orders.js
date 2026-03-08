/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', table =>{
        table.bigIncrements('id').primary();
        table.bigInteger('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('name').notNullable();
        table.integer('total_price').notNullable();
        table.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('orders');
};
