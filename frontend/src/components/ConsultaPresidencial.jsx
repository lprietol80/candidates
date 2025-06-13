
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";

function ConsultaPresidencial() {
  const [candidatos, setCandidatos] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [error, setError] = useState('');

  useEffect(()=>{
    const fetchCandidates = async ()=>{
      try {
        const response = await axios.get("/api/candidatos/presidenciales")
        setCandidatos(response.data)
        setSearchOptions(
          response.data.map((c)=> ({
            value:c.ID_Candidato,
            label:c.Nombre
          }))
        );
        
      } catch (error) {
        console.log("Error al obtener candidatos: ", error)
        
      }

    };
    fetchCandidates()

  },[])

  //Buscar candidato por nombre
  const handleSearch = async (selectedOption)=>{
    setSelectedCandidate(searchOption);
    setError("");
    if (!selectedOption) {
      setCandidatos([]);
      return
    }
    try {
      const response = await axios.get(`/api/candidatos/${selectedCandidate.value}`);
      setCandidatos([response.data]);
    } catch (error) {
      setError('Candidato no encontrado');
      setCandidatos([])
    }
  }

  return (
    <section>
      <h2>Consulta Candidatos a la Presidencia</h2>
      <div>
        <Select
        options={searchOptions}
        onChange={handleSearch}
        placeholder="Buscar candidato por nombre o apellido"
        isClearable
        className=""
        />

      </div>

      
    </section>
  )
}

export default ConsultaPresidencial