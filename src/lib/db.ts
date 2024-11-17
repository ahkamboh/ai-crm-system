import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST,  
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,  
  password: process.env.DB_PASS,  
  database: process.env.DB_NAME,  
  ssl: { rejectUnauthorized: false }, 
});

export default connection;
