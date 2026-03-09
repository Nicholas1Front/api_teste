const knex = require('knex');

/* 
    Arquivo responsável por configurar a conexão com o banco de dados utilizando Knex.
    Aqui definimos o cliente (PostgreSQL), a string de conexão (DATABASE_URL) e as configurações de pool.
    O Knex é uma query builder que facilita a construção de consultas SQL de forma programática,
    além de gerenciar a conexão com o banco de dados.
*/

// Configura a conexão com o banco de dados PostgreSQL utilizando Knex
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