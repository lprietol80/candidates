import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ConsultaPresidencial from './components/ConsultaPresidencial';
import ConsultaCongreso from './components/ConsultaCongreso';
import DetalleCandidato from './components/DetalleCandidato';
import './css/reset.css'; // Primero, para normalizar estilos
import './css/colors.css'; // Segundo, para definir variables
import './css/buttons.css'; // Tercero, para estilos de botones
import './css/styles.css'; // Cuarto, para estilos generales
import Error from './components/Error';


function App() {
  return (
    <Router>
      <header>
        <Navbar/>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/presidencial" element={<ConsultaPresidencial />} />
          <Route path="/congreso" element={<ConsultaCongreso />} />
          <Route path="/candidato/:id" element={<DetalleCandidato />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;