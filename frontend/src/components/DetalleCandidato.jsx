import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';


function DetalleCandidato() {
  const { id } = useParams();
  const [candidato, setCandidato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidato = async ()=>{
      try {
        const response = await axios.get(`/api/candidatos/${id}`)
        setCandidato(response.data)
      } catch (error) {
        setError("Candidato no encontrado")
      }finally{
        setLoading(false)
      }
    }
    fetchCandidato()
  }, [id]);
  if (loading) return <p className="text-center pendiente">Cargando...</p>;
  if (error) return <p className="error text-center pendiente">{error}</p>

  return (
    <section aria-labelledby="detalle-candidato-title" className="pendiente">
      <h2 id="detalle-candidato-title">Detalles del Candidato</h2>
      <article className="candidato-card">
        <h3>{candidato.Nombre}</h3>
        <p><strong>Partido:</strong>{candidato.Partido}</p>
        <p><strong>Corriente:</strong>{candidato.Corriente}</p>
        <p><strong>Información Adicional:</strong> {candidato.InformacionAdicional}</p>
        <div>
          <Link to="/congreso" className="text-blue-600">Volver a Candidatos al Congreso</Link>
          <Link to="/presidencial" className="text-blue-600"> Ir a Candidatos Presidenciales</Link>

        </div>

      </article>

    </section>
  )



 
}

export default DetalleCandidato;