import mysql from 'mysql2/promise';

const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DATABASE || 'makeitdb'
};

export const connection = await mysql.createConnection(config);