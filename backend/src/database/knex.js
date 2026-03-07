const knex = require('knex');

const database = knex({
    client : 'pg',
    connection : process.env.DATABASE_URL,
    pool : {
        min : 2,
        max : 10
    }
});

database.raw('select 1')
    .then(()=>{
        console.log('Database connection successful');
    })
    .catch((err)=>{
        console.log('Database connection failed:', err);
    })

module.exports = database;