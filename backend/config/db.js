import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Crear el pool de conexiones
const pool = mysql.createPool(poolConfig);

// Función para verificar y establecer la conexión inicial
async function initializeConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a MySQL establecida correctamente');
    connection.release();
  } catch (error) {
    console.error('Error al conectar con MySQL:', error.message);
    // Reintentar conexión después de 5 segundos
    setTimeout(initializeConnection, 5000);
  }
}

// Ejecutar verificación inicial
initializeConnection();

// Exportar función para obtener conexión
export async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error al obtener conexión:', error.message);
    throw new Error('No se pudo obtener una conexión a la base de datos');
  }
}

export default pool;