import mysql from 'mysql2/promise';
import dotenv from 'dotenv/config';

// MySQL connection
const config = {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_POR,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    waitForConnections: true,
}


export const connection = await mysql.createConnection(config);