import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) =>
    pathname === path ? { color: "#13a4ec" } : undefined;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="hdr">
      <div className="container hdr__inner">
        <div className="hdr__left">
          <Link className="brand" to="/" onClick={closeMobileMenu}>
            <svg className="brand__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <h2 className="brand__text">HOPPO</h2>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav">
            <Link className="nav__link" style={isActive("/")} to="/">Inicio</Link>
            <div className="nav__dropdown">
              <span className="nav__dropdown-trigger">Componentes</span>
              <div className="nav__dropdown-menu">
                <Link className="nav__dropdown-link" to="/productos?categoria=procesadores">Procesadores</Link>
                <Link className="nav__dropdown-link" to="/productos?categoria=graficas">Tarjetas Gráficas</Link>
                <Link className="nav__dropdown-link" to="/productos?categoria=memoria">Memoria RAM</Link>
                <Link className="nav__dropdown-link" to="/productos?categoria=almacenamiento">Almacenamiento</Link>
                <Link className="nav__dropdown-link" to="/productos?categoria=fuentes">Fuentes de Poder</Link>
              </div>
            </div>
            <div className="nav__dropdown">
              <span className="nav__dropdown-trigger">Periféricos</span>
              <div className="nav__dropdown-menu">
                <Link className="nav__dropdown-link" to="/productos?categoria=teclados">Teclados</Link>
                <Link className="nav__dropdown-link" to="/productos?categoria=mouses">Mouses</Link>
                <Link className="nav__dropdown-link" to="/productos?categoria=monitores">Monitores</Link>
                <Link className="nav__dropdown-link" to="/productos?categoria=auriculares">Auriculares</Link>
              </div>
            </div>
            <Link className="nav__link" style={isActive("/productos")} to="/productos">Todos los Productos</Link>
            <Link className="nav__link nav__link--sale" to="/productos?oferta=true">Ofertas</Link>
            <Link className="nav__link" style={isActive("/contact")} to="/contact">Contacto</Link>
          </nav>
        </div>

        <div className="hdr__right">
          <div className="search">
            <svg className="search__icon" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input className="search__input" placeholder="Buscar" />
          </div>
          <Link to="/profile" className="iconbtn" title="Cuenta">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </Link>
          <Link to="/cart" className="iconbtn" title="Carrito">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="21" r="1" fill="currentColor"/>
              <circle cx="20" cy="21" r="1" fill="currentColor"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className={`hamburger ${isMobileMenuOpen ? 'hamburger--active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__content">
          <Link 
            className="mobile-menu__link" 
            style={isActive("/")} 
            to="/" 
            onClick={closeMobileMenu}
          >
            🏠 Inicio
          </Link>
          
          <div className="mobile-menu__section">
            <h3 className="mobile-menu__section-title">💻 Componentes</h3>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=procesadores" 
              onClick={closeMobileMenu}
            >
              Procesadores
            </Link>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=graficas" 
              onClick={closeMobileMenu}
            >
              Tarjetas Gráficas
            </Link>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=memoria" 
              onClick={closeMobileMenu}
            >
              Memoria RAM
            </Link>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=almacenamiento" 
              onClick={closeMobileMenu}
            >
              Almacenamiento
            </Link>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=fuentes" 
              onClick={closeMobileMenu}
            >
              Fuentes de Poder
            </Link>
          </div>

          <div className="mobile-menu__section">
            <h3 className="mobile-menu__section-title">⌨️ Periféricos</h3>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=teclados" 
              onClick={closeMobileMenu}
            >
              Teclados
            </Link>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=mouses" 
              onClick={closeMobileMenu}
            >
              Mouses
            </Link>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=monitores" 
              onClick={closeMobileMenu}
            >
              Monitores
            </Link>
            <Link 
              className="mobile-menu__sublink" 
              to="/productos?categoria=auriculares" 
              onClick={closeMobileMenu}
            >
              Auriculares
            </Link>
          </div>

          <Link 
            className="mobile-menu__link" 
            style={isActive("/productos")} 
            to="/productos" 
            onClick={closeMobileMenu}
          >
            📦 Todos los Productos
          </Link>
          <Link 
            className="mobile-menu__link mobile-menu__link--sale" 
            to="/productos?oferta=true" 
            onClick={closeMobileMenu}
          >
            🔥 Ofertas
          </Link>
          <Link 
            className="mobile-menu__link" 
            style={isActive("/contact")} 
            to="/contact" 
            onClick={closeMobileMenu}
          >
            📞 Contacto
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
