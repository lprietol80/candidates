import { useEffect,useState } from "react";
import api from "../services/api";

 function MiComponente() {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        api.get("http://localhost:3001/api/partidos")
            .then((response) => setDatos(response.data))
            .catch((error) => console.error("Error al obtener datos", error));
    }, []);

    return (
        <div>
          <h1>Luis</h1>
            {datos.map((item) => (
                <p key={item.id}>{item.nombre}</p>
            ))}
        </div>
    );
}

export default MiComponente;