const { Pool } = require('pg')

const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database:'db',
    password:'41938516amr',
    port:5432,
})

module.exports = pool