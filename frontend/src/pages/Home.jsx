import { Link } from 'react-router-dom';

function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Consulta Información de Candidatos</h1>
        <p>Descubre información detallada sobre los candidatos presidenciales y al Congreso de Colombia.</p>
        <div className="hero-buttons">
          <Link to="/presidencial" role="button" aria-label="Consultar candidatos presidenciales">Candidatos Presidenciales</Link>
          <Link to="/congreso" role="button" aria-label="Consultar candidatos al Congreso">Candidatos al Congreso</Link>
        </div>
      </section>
      <section aria-labelledby="welcome-title" className='welcome-title'>
        <h2 id="welcome-title">Bienvenido</h2>
        <p>
          Nuestra plataforma te permite explorar datos actualizados sobre los candidatos a las elecciones en Colombia. 
          Conoce sus partidos, corrientes políticas y trayectorias, y toma decisiones informadas para el futuro del país.
        </p>

      </section>
    </main>
  );
}


export default Home;