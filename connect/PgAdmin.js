// connect postgresql with nodejs
require('dotenv').config();
const { Pool } = require('pg');

const {
    DB_Postgres_HOST,
    DB_Postgres_USER,
    DB_Postgres_DATABASE,
    DB_Postgres_PASSWORD,
    DB_Postgres_PORT,
    DB_Postgres_SCHEMA,
    DB_Postgres_CONFIG_SCHEMA
} = process.env;

const client  = new Pool({
    host: DB_Postgres_HOST,
    user: DB_Postgres_USER,
    database: DB_Postgres_DATABASE,
    password: DB_Postgres_PASSWORD,
    port: DB_Postgres_PORT,
    schema: DB_Postgres_SCHEMA,
    configSchema: DB_Postgres_CONFIG_SCHEMA
});


module.exports = client;


    