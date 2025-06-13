import { Link } from 'react-router-dom';

function Home() {
  return (
    <section aria-labelledby="home-title">
      <h2 id="home-title">Bienvenido</h2>
      <h2>Consulta información de tu candidato</h2>
      <p>Selecciona una opción para consultar información sobre los candidatos:</p>
      <div>
        <Link to="/presidencial" role="button">Candidatos Presidenciales</Link>
        <Link to="/congreso" role="button">Candidatos al Congreso</Link>
      </div>
    </section>
  );
}


export default Home;