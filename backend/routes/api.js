import express from "express";
import { getConnection } from '../config/db.js';
import { getGrokinfo } from "../config/llmService.js"
import axios from "axios";
import dotenv from "dotenv";

dotenv.config()


const router = express.Router()

// --- Obtener candidatos presidenciales ---

router.get('/candidatos/presidenciales', async(req,res)=>{
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.query(`
      select c.ID_candidato,c.Nombre,p.Nombre as Partido,cp.Nombre as Corriente
      from candidatos c
      join partidospoliticos p on c.ID_Partido = p.ID_Partido
      join corrientespoliticas cp on p.ID_Corriente  =cp.ID_Corriente
      join tiposeleccion te on c.ID_TipoEleccion = te.ID_TipoEleccion
      where te.Nombre = 'Presidente';
      `
    )
    res.json(rows)
  } catch (error) {
    console.log('Error al obtener candidatos presidenciales:',error.message)
    res.status(500).json({error: 'Error en el servidor' });    
  }finally{
    if(connection) connection.release()
  }
})

// --- Obtener candidatos al Congreso por tipo y circunscripción ---
router.get('/candidatos/congreso',async (req,res)=>{
  let connection;
  try {
    const {tipoEleccion,idCircunscripcion}=req.query;
    if(!tipoEleccion){
      return res.status(400).json({error:'Tipo de elección es requerido'})
    }
    connection = await getConnection();
    const query = `
    SELECT c.ID_Candidato, c.Nombre, p.Nombre AS Partido, cp.Nombre AS Corriente, cir.Nombre AS Circunscripcion
    FROM Candidatos c
    JOIN PartidosPoliticos p ON c.ID_Partido = p.ID_Partido
    JOIN CorrientesPoliticas cp ON p.ID_Corriente = cp.ID_Corriente
    JOIN Circunscripciones cir ON c.ID_Circunscripcion = cir.ID_Circunscripcion
    JOIN TiposEleccion te ON c.ID_TipoEleccion = te.ID_TipoEleccion
      WHERE te.Nombre = ? ${idCircunscripcion ? 'AND c.ID_Circunscripcion = ?' : ''}
    `;
    const params = idCircunscripcion ? [tipoEleccion,idCircunscripcion] : [tipoEleccion];
    const [rows] = await connection.query(query,params);
    res.json(rows);
  } catch (error) {
    console.log('Error al obtener candidatos al congreso:',error.message)
    res.status(500).json({error: 'Error en el servidor' });
    
  }finally{
    if(connection) connection.release();
  }
});

// --- Búsqueda de candidatos por nombre (para autocompletado) ---

router.get('/candidatos/buscar', async (req,res)=>{
  let connection;
  try {
    const {nombre } = req.query;
    if(!nombre){
      return res.status(400).json({error: 'Nombre es requerido'})
    }
    connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT c.ID_Candidato, c.Nombre, p.Nombre AS Partido, cp.Nombre AS Corriente
      FROM Candidatos c
      JOIN PartidosPoliticos p ON c.ID_Partido = p.ID_Partido
      JOIN CorrientesPoliticas cp ON p.ID_Corriente = cp.ID_Corriente
      WHERE c.Nombre LIKE ?
      LIMIT 10
      `,[`%${nombre}%`]);
      res.json(rows)
  } catch (error) {
    console.error('Error al buscar candidatos:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }finally{
    if (connection) connection.release();
  }
})

// --- Detalles de un candidato (con LLM ycaché) ---
router.get('/candidatos/:id', async (req,res)=>{
  let connection;
  try {
    const {id } = req.params;
    connection= await getConnection();

    // Obtener información del candidato
    const [rows] = await connection.query(`
      select c.Nombre,p.Nombre as Partido,cp.Nombre as Corriente,ll.InformacionAdicional
      from candidatos c
      join partidospoliticos p on c.ID_Partido = p.ID_Partido
      join corrientespoliticas cp on p.ID_Corriente  =cp.ID_Corriente
      join llmcache ll on c.ID_Candidato = ll.ID_Candidato
      where c.ID_Candidato = ?`, [id]);

      if (rows.length===0) {
        return res.status(404).json({error: "Candidato no encontrado"});
      }

      const candidato = rows[0];

      // Verificar caché
      const cacheExpirationHours = process.env.CACHE_EXPIRATION_HOURS || 24;// Tiempo de expiración del caché (24 horas)
      const [cacheRows] = await connection.query(`
        SELECT InformacionAdicional, FechaActualizacion
        FROM LlmCache
        WHERE ID_Candidato = ?
        AND FechaActualizacion >= DATE_SUB(NOW(), INTERVAL ? HOUR)
        `,[id,cacheExpirationHours]);

        let llmInfo;
        if (cacheRows.length > 0) {
          // Usar información cacheada
          llmInfo = cacheRows[0].InformacionAndicional;
        } else {
          try {
            // Llamar al LLM
            llmInfo = await getGrokinfo(candidato.Nombre)
            console.log("Luis,respuesta del LLM ==>", llmInfo)
            //Guardar en caché (usar transacción para consistencia)
            await connection.beginTransaction();
            await connection.query(`
              INSERT INTO llmcache (ID_Candidato, 
              InformacionAdicional, FechaActualizacion)
              VALUES (?, ?, NOW())
              ON DUPLICATE KEY UPDATE InformacionAdicional = ?,
              FechaActualizacion = NOW()
              `,[id,llmInfo,llmInfo]);
              await connection.commit();
          } catch (llmError) {
            console.error('Error al consultar LLM:', llmError.message);
            llmInfo = "Información no disponible"
            if (connection) await connection.rollback();
          }
        }
        res.json({...candidato,InformacionAndicional:llmInfo});
  } catch (error) {
    console.error("Error al obtener detalles del candidato:", error.message);
    res.status(500).json({ error: "Error en el servidor" });
  }finally{
    if (connection) connection.release();
  }
});

// --- Obtener circunscripciones ---

router.get('/circunscripciones',async (req,res)=>{
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT ID_Circunscripcion, Nombre as Departamento, Tipo FROM Circunscripciones
      `);
      res.json(rows);
  } catch (error) {
    console.error('Error al obtener circunscripciones:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }

})

// --- Obtener tipos de elección ---
router.get('/tiposeleccion', async (req,res)=>{
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      "SELECT ID_TipoEleccion, Nombre As Elecciones FROM TiposEleccion");
    res.json(rows)
    
  } catch (error) {
    console.error('Error al obtener tipos de elección:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
    
  }finally{
    if (connection) connection.release();

  }

})


// --- Partidos Políticos ---
// Obtener todos los partidos políticos
router.get('/partidos', async (req,res)=>{
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT p.ID_Partido, p.Nombre, c.Nombre AS Corriente
      FROM PartidosPoliticos p
      LEFT JOIN CorrientesPoliticas c ON p.ID_Corriente = c.ID_Corriente;
      `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener partidos:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }finally{
    if(connection) connection.release();

  }
})

router.get('/partidos/:id', async (req,res)=>{
  let connection;
  try {
    const {id } = req.params;
    connection= await getConnection();
    const [rows] = await connection.query(`
      select p2.ID_Partido, p2.Nombre as Partido,cp.Nombre as Corriente
      from partidospoliticos p2
      join corrientespoliticas cp on p2.ID_Corriente  =cp.ID_Corriente
      where p2.ID_Partido= ?`, [id]);
      res.json(rows)
  }catch (error) {
    console.error('Error al obtener el partido:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });    
  }finally{
    if(connection) connection.release();
  }
})

// Obtener candidatos por partidos políticos
router.get('/partidos/candidatos/:id', async (req,res)=>{
  let connection;
  try {
    const {id } = req.params;
    connection= await getConnection();
    const [rows] = await connection.query(`
      select c.Nombre,p.Nombre as Partido,cp.Nombre as Corriente
      from candidatos c
      join partidospoliticos p on c.ID_Partido = p.ID_Partido
      join corrientespoliticas cp on p.ID_Corriente  =cp.ID_Corriente
      where p.ID_Partido = ?`, [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener partidos:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });    
  }finally{
    if(connection) connection.release();

  }
})

export default router