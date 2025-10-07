import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path ? { color: "#13a4ec" } : undefined;

  return (
    <header className="hdr">
      <div className="container hdr__inner">
        <div className="hdr__left">
          <Link className="brand" to="/">
            <svg className="brand__icon" viewBox="0 0 48 48" fill="none">
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
              <path d="M41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor"></path>
            </svg>
            <h2 className="brand__text">HOPPO</h2>
          </Link>

          <nav className="nav">
            <Link className="nav__link" style={isActive("/")} to="/">Inicio</Link>
            <Link className="nav__link" style={isActive("/productos")} to="/productos">Productos</Link>
            <Link className="nav__link" style={isActive("/contact")} to="/contact">Contacto</Link>
          </nav>
        </div>

        <div className="hdr__right">
          <div className="search">
            <span className="search__icon">🔍</span>
            <input className="search__input" placeholder="Buscar" />
          </div>
          <Link to="/profile" className="iconbtn" title="Cuenta">👤</Link>
          <Link to="/cart" className="iconbtn" title="Carrito">🛒</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
