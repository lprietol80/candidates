import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";
import Error from "./Error";

function ConsultaCongreso() {
  const [tipoEleccion, setTipoEleccion] = useState("");
  const [circunscripcion, setCircunscripcion] = useState("");
  const [candidatos, setCandidatos] = useState([]);
  const [circunscripciones, setCircunscripciones] = useState([]);
  const [tiposEleccion, setTiposEleccion] = useState([]);
  const [circunscripcionesFiltradas, setCircunscripcionesFiltradas] = useState([]);

  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const [circResponse, tiposResponse] = await Promise.all([
          axios.get("/api/circunscripciones"),
          axios.get("/api/tiposeleccion")
        ]);
        const tiposData = tiposResponse.data
        .filter((t)=>t.Elecciones ==="Cámara" || t.Elecciones ==="Senado")
        .map((t) =>({
          value:t.Elecciones,
          label:t.Elecciones,
        }));

        const circData = circResponse.data.map((c)=>({
          value:c.ID_Circunscripcion,
          label:`${c.Departamento}`,
          tipo:`${c.Tipo}`,
        }));
        setTiposEleccion(tiposData);
        setCircunscripciones(circData);
        // Inicializar circunscripciones filtradas como vacías
        setCircunscripcionesFiltradas([])
      } catch (error) {
        return <Error message={`Error al obtener datos: ${error}`}/>
      }

    };
    fetchData();
  },[]);

  useEffect(() => {
    if(!tipoEleccion){
      setCircunscripcionesFiltradas([]);
      setCircunscripcion("");// Resetear circunscripción al cambiar tipo
      return;
    }

    if (tipoEleccion ==="Cámara") {
      setCircunscripcionesFiltradas(
        circunscripciones.filter((c)=>c.label !=="Nacional")
      );
    }else if (tipoEleccion==="Senado"){
      setCircunscripcionesFiltradas(
        circunscripciones.filter((c)=> c.label==="Nacional")
      );
    }
    setCircunscripcion("")// Resetear circunscripción al cambiar tipo
  }, [tipoEleccion, circunscripciones]);

  useEffect(() => {
    const fetchCandidatos = async ()=>{
      if(!tipoEleccion) return;
      try {
        const response = await axios.get("/api/candidatos/congreso" ,{
          params:{tipoEleccion,idCircunscripcion:circunscripcion || ""},
        });
        setCandidatos(response.data);
      } catch (error) {
        <Error message={`Error al obtener candidatos: , ${error}`}/>
      }
    };
    fetchCandidatos()
  }, [tipoEleccion, circunscripcion]);

  return(
    <section aria-labelledby="congreso-title" className="candidatos">
      <h2 id="congreso-title">Consulta Candidatos al Congreso</h2>
      <form >
        <Select
          options={tiposEleccion}
          onChange={(option)=>setTipoEleccion(option ? option.value : "")}
          value={tiposEleccion.find((t)=> t.value === tipoEleccion) || null}
          placeholder="Selecciona Cámara o Senado"
          isClearable
          aria-label="Seleccionar tipo de elección"
          className="search-select"
        />
        <Select
          options={circunscripcionesFiltradas}
          onChange={(option)=>setCircunscripcion(option ? option.value :"")}
          value={
            circunscripcionesFiltradas.find((c)=>c.value===circunscripcion) || null
          }
          placeholder="Selecciona Circunscripción"
          isClearable
          isDisabled={!tipoEleccion} // Deshabilitar si no hay tipo seleccionado
          aria-label="Seleccionar circunscripción"
          className="search-select"
        />
      </form>
      <div className="candidato-grid">
        {candidatos.map((candidato)=>(
          <article key={candidato.ID_Candidato || selectedCandidato.value} className="candidato-card">
            <div className="candidato-img">
              <img src={candidato.foto} alt="" />
            </div>
            <h3>{candidato.Nombre}</h3>
            <p><strong>Partido:</strong> {candidato.Partido}</p>
            <p><strong>Corriente:</strong> {candidato.Corriente}</p>
            <p><strong>Candidato a:</strong> {candidato.Eleccion}</p>
            <p><strong>Circunscripción:</strong> {candidato.Circunscripcion}</p>
            <Link to={`/candidato/${candidato.ID_Candidato || selectedCandidato.value}`}>
              Ver Detalles
            </Link>
          </article>
        ))
        }
      </div>
    </section>
  )

}

export default ConsultaCongreso;










// import { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { Link } from "react-router-dom";

// function ConsultaCongreso() {
//   const [tipoEleccion, setTipoEleccion] = useState("");
//   const [circunscripcion, setCircunscripcion] = useState("");
//   const [candidatos, setCandidatos] = useState([]);
//   const [circunscripciones, setCircunscripciones] = useState([]);
//   const [tiposEleccion, setTiposEleccion] = useState([]);
//   const [circunscripcionesFiltradas, setCircunscripcionesFiltradas] = useState([])
  


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [circResponse, tiposResponse] = await Promise.all([
//           axios.get("/api/circunscripciones"),
//           axios.get("/api/tiposeleccion"),
//         ]);

//         setTiposEleccion(
//           tiposResponse.data
//             .filter(
//               (t) => t.Elecciones === "Cámara" || t.Elecciones === "Senado"
//             )
//             .map((t) => ({
//               value: t.Elecciones,
//               label: t.Elecciones,
//             }))
//         );
//         setCircunscripciones(
//           circResponse.data.map((c) => ({
//             value: c.ID_Circunscripcion,
//             label: `${c.Departamento}`,
//             tipo:`${c.Tipo}`
//           }))
//         );
//       } catch (error) {
//         console.error("Error al obtener datos:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchCandidatos = async () => {
//       if (!tipoEleccion) return;
//       try {
//         const response = await axios.get("/api/candidatos/congreso", {
//           params: { tipoEleccion, idCircunscripcion: circunscripcion || "" },
//         });
//         setCandidatos(response.data);
//       } catch (error) {
//         console.error("Error al obtener candidatos:", error);
//       }
//     };
//     fetchCandidatos();
//   }, [tipoEleccion, circunscripcion]);

//   return (
//     <section aria-labelledby="congreso-title" className="pendiente">
//           {console.log("tipos eleccionnnnn",tiposEleccion)}
//           {console.log("circunscripciones",circunscripciones)}
  
//       <h2 id="congreso-title">Consulta Candidatos al Congreso</h2>
//       <form>
//         <Select
//           options={tiposEleccion}
//           onChange={
//             (option) => setTipoEleccion(option ? option.value : '')
//           }
//           placeholder="Selecciona Cámara o Senado"
//           isClearable
//           aria-label="Seleccionar tipo de elección"
//         />
//         <Select
//           options={circunscripciones}
//           onChange={(option) => setCircunscripcion(option ? option.value : '')}
//           placeholder="Selecciona Circunscripción"
//           isClearable
//           aria-label="Seleccionar circunscripción"
//         />
//       </form>
//       <div className="candidato-grid">
//         {candidatos.map((candidato) => (
//           <article key={candidato.ID_Candidato} className="candidato-card">
//             <h3>{candidato.Nombre}</h3>
//             <p>
//               <strong>Partido:</strong> {candidato.Partido}
//             </p>
//             <p>
//               <strong>Corriente:</strong> {candidato.Corriente}
//             </p>
//             <p>
//               <strong>Circunscripción:</strong> {candidato.Circunscripcion}
//             </p>
//             <Link to={`/candidato/${candidato.ID_Candidato}`}>
//               Ver Detalles
//             </Link>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default ConsultaCongreso;






// import { useState, useEffect } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { Link } from "react-router-dom";

// function ConsultaCongreso() {
//   const [tipoEleccion, setTipoEleccion] = useState("");
//   const [circunscripcion, setCircunscripcion] = useState("");
//   const [candidatos, setCandidatos] = useState([]);
//   const [circunscripciones, setCircunscripciones] = useState([]);
//   const [tiposEleccion, setTiposEleccion] = useState([]);
//   const [circunscripcionesFiltradas, setCircunscripcionesFiltradas] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [circResponse, tiposResponse] = await Promise.all([
//           axios.get("/api/circunscripciones"),
//           axios.get("/api/tiposeleccion"),
//         ]);

//         const tiposData = tiposResponse.data
//           .filter((t) => t.Elecciones === "Cámara" || t.Elecciones === "Senado")
//           .map((t) => ({
//             value: t.Elecciones,
//             label: t.Elecciones,
//           }));
//         const circData = circResponse.data.map((c) => ({
//           value: c.ID_Circunscripcion,
//           label: `${c.Departamento}`,
//           tipo: `${c.Tipo}`,
//         }));

//         setTiposEleccion(tiposData);
//         setCircunscripciones(circData);
//         // Inicializar circunscripciones filtradas como vacías
//         setCircunscripcionesFiltradas([]);
//       } catch (error) {
//         console.error("Error al obtener datos:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     // Filtrar circunscripciones según tipoEleccion
//     if (!tipoEleccion) {
//       setCircunscripcionesFiltradas([]);
//       setCircunscripcion(""); // Resetear circunscripción al cambiar tipo
//       return;
//     }

//     if (tipoEleccion === "Cámara") {
//       setCircunscripcionesFiltradas(
//         circunscripciones.filter((c) => c.label !== "Nacional")
//       );
//     } else if (tipoEleccion === "Senado") {
//       setCircunscripcionesFiltradas(
//         circunscripciones.filter((c) => c.label === "Nacional")
//       );
//     }
//     setCircunscripcion(""); // Resetear circunscripción al cambiar tipo
//   }, [tipoEleccion, circunscripciones]);

//   useEffect(() => {
//     const fetchCandidatos = async () => {
//       if (!tipoEleccion) return;
//       try {
//         const response = await axios.get("/api/candidatos/congreso", {
//           params: { tipoEleccion, idCircunscripcion: circunscripcion || "" },
//         });
//         setCandidatos(response.data);
//       } catch (error) {
//         console.error("Error al obtener candidatos:", error);
//       }
//     };
//     fetchCandidatos();
//   }, [tipoEleccion, circunscripcion]);

//   return (
//     <section aria-labelledby="congreso-title" className="pendiente">
//       <h2 id="congreso-title">Consulta Candidatos al Congreso</h2>
//       <form>
//         <Select
//           options={tiposEleccion}
//           onChange={(option) => setTipoEleccion(option ? option.value : "")}
//           value={tiposEleccion.find((t) => t.value === tipoEleccion) || null}
//           placeholder="Selecciona Cámara o Senado"
//           isClearable
//           aria-label="Seleccionar tipo de elección"
//         />
//         <Select
//           options={circunscripcionesFiltradas}
//           onChange={(option) => setCircunscripcion(option ? option.value : "")}
//           value={
//             circunscripcionesFiltradas.find((c) => c.value === circunscripcion) ||
//             null
//           }
//           placeholder="Selecciona Circunscripción"
//           isClearable
//           isDisabled={!tipoEleccion} // Deshabilitar si no hay tipo seleccionado
//           aria-label="Seleccionar circunscripción"
//         />
//       </form>
//       <div className="candidato-grid">
//         {candidatos.map((candidato) => (
//           <article key={candidato.ID_Candidato} className="candidato-card">
//             <h3>{candidato.Nombre}</h3>
//             <p>
//               <strong>Partido:</strong> {candidato.Partido}
//             </p>
//             <p>
//               <strong>Corriente:</strong> {candidato.Corriente}
//             </p>
//             <p>
//               <strong>Circunscripción:</strong> {candidato.Circunscripcion}
//             </p>
//             <Link to={`/candidato/${candidato.ID_Candidato}`}>
//               Ver Detalles
//             </Link>
//           </article>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default ConsultaCongreso;