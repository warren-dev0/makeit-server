import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'makeitdb'
};

export const connection = await mysql.createConnection(config);