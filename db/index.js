const { Pool } = require('pg')

const client = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'express',
    password: '123456',
    port: 5432,
})

module.exports = client;
