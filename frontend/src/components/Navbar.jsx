import { Link, Navigate } from "react-router-dom";
import { useState } from "react";



function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu =()=> {
    setMenuOpen(!menuOpen)
  }



  return (
        <nav aria-label="Navegación principal">

            <Link to="/" role="button">
            Información de candidatos
            </Link>
          <button className="menu-btn" onClick={toggleMenu}>
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--primary)" viewBox="0 0 24 24">
              <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z"/>
              </svg>

            ):(
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z" fill="var(--primary)"/></svg>
            ) }
          </button>
          <ul className={`menu ${menuOpen ? "open" : ""}`}>
            <Link to="/" aria-current="page">Inicio</Link>
            <Link to="/presidencial">Candidatos Presidenciales</Link>
            <Link to="/congreso">Candidatos al Congreso</Link>
          </ul>
        </nav>
  );
}

export default Navbar;
