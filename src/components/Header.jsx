import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import hoppoLogo from "../assets/image.png"; 

const Header = () => {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path ? { color: "#13a4ec" } : undefined;

  return (
    <header className="hdr">
      <div className="container hdr__inner">
        <div className="hdr__left">
          <Link className="brand" to="/">
            <img
              src={hoppoLogo}
              alt="HOPPO logo"
              className="brand__icon"
              width={32}
              height={32}
              loading="eager"
              decoding="async"
            />
            <h2 className="brand__text">HOPPO</h2>
          </Link>

          <nav className="nav">
            <Link className="nav__link" style={isActive("/")} to="/">
              Inicio
            </Link>
            <Link className="nav__link" style={isActive("/productos")} to="/productos">
              Productos
            </Link>
            <Link className="nav__link" style={isActive("/Offers")} to="/Offers">
              Ofertas
            </Link>
            <Link className="nav__link" style={isActive("/Soporte")} to="/Soporte">
              Soporte
            </Link>
            <Link className="nav__link" style={isActive("/Contact")} to="/Contact">
              Contacto
            </Link>
          </nav>
        </div>

        <div className="hdr__right">
          <div className="search">
            <svg className="search__icon" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input className="search__input" placeholder="Buscar" />
          </div>

          <Link to="/Login" className="btn-login">Iniciar sesión</Link>

          <Link to="/Profile" className="iconbtn" title="Cuenta">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Link>

          <Link to="/cart" className="iconbtn" title="Carrito">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="21" r="1" fill="currentColor" />
              <circle cx="20" cy="21" r="1" fill="currentColor" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
