import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import pool from './config/db.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api', apiRoutes);


// Ruta raíz
app.get('/', (req, res) => {
  res.json({ message: 'API REST funcionando' });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de cierre limpio
process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  server.close(async () => {
    console.log('Servidor cerrado');
    try {
      await pool.end();
      console.log('Conexión a MySQL cerrada');
    } catch (error) {
      console.error('Error al cerrar conexión a MySQL:', error.message);
    }
    process.exit(0);
  });
});