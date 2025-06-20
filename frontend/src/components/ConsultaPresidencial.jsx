import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import Error from './Error';

function ConsultaPresidencial() {
  const [candidatos, setCandidatos] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const response = await axios.get("/api/candidatos/presidenciales");
        setCandidatos(response.data);
        setSearchOptions(
          response.data.map((c) => ({
            value: c.ID_Candidato,
            label: c.Nombre,
          }))
        );
      } catch (error) {
        setError(`Error al obtener los candidatos: ${error.message}`);
      }
    };
    fetchCandidatos();

  }, []);

  const handleSearch = async (selectedOption) => {
    setSelectedCandidato(selectedOption);
    setError('');
    if (!selectedOption) {
      setCandidatos([]);
      return;
    }
    try {
      const response = await axios.get(`/api/candidatos/${selectedOption.value}`);
      setCandidatos([response.data]);
    } catch (error) {
      setError('Candidato no encontrado');
      setCandidatos([]);
    }
  };

  return (
    <section aria-labelledby="presidencial-title" className='candidatos'>
      <h2 id="presidencial-title">Consulta Candidatos Presidenciales</h2>
      <form className="presidenciales">
        <Select
          options={searchOptions}
          onChange={handleSearch}
          placeholder="Buscar candidato por nombre..."
          isClearable
          aria-label="Buscar candidato presidencial"
          className="search-select"
        />
      </form>

      {error && <Error message ={error}/>}
      
      <div className="candidato-grid">
        {candidatos.map((candidato) => (
          <article key={candidato.ID_Candidato || selectedCandidato.value} className="candidato-card">
            <div className="candidato-img">
              <img src={candidato.foto} alt="" />
            </div>
            <h3>{candidato.Nombre}</h3>
            <p><strong>Partido:</strong> {candidato.Partido}</p>
            <p><strong>Corriente:</strong> {candidato.Corriente}</p>
            <p><strong>Candidato a:</strong> {candidato.Eleccion}</p>
            
            <Link to={`/candidato/${candidato.ID_Candidato || selectedCandidato.value}`}>Ver Detalles</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ConsultaPresidencial;