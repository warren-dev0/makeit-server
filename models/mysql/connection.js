import mysql from 'mysql2/promise';
import dotenv from 'dotenv/config';

// MySQL connection
const config = {
    host: process.env.MYSQL_ADDON_HOST || 'localhost',
    port: process.env.MYSQL_ADDON_POR || 3306,
    user: process.env.MYSQL_ADDON_USER || 'root',
    password: process.env.MYSQL_ADDON_PASSWORD || 'root',
    database: process.env.MYSQL_ADDON_DB || 'makeitdb',
}


export const connection = await mysql.createConnection(config);