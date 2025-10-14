import { Link, useLocation } from "react-router-dom";
import hoppoLogo from "../assets/image.png";
import "./Header.css";
import { useAuth } from "../context/AuthContext.jsx";

const isActive = (path, current) =>
  current.pathname === path ? { color: "var(--link-active, #13a4ec)" } : {};

export default function Header() {
  const location = useLocation();
  const { user } = useAuth(); 

  return (
    <header className="hdr">
      <div className="hdr__inner">
        <Link to="/home" className="hdr__brand" title="Ir a inicio">
          <img className="hdr__logo" src={hoppoLogo} alt="HOPPO" />
          <span className="hdr__title">HOPPO</span>
        </Link>

        <nav className="hdr__nav">
          <Link style={isActive("/home", location)} to="/home">Inicio</Link>
          <Link style={isActive("/productos", location)} to="/productos">Productos</Link>
          <Link style={isActive("/armador", location)} to="/armador">Armador</Link>
        </nav>

        <div className="hdr__right">
          {!user ? (
            <Link className="hdr__login" to="/login">Iniciar sesión</Link>
          ) : (
            <Link className="hdr__profile" to="/perfil" title="Ver mi perfil">
              <img className="hdr__avatar" src={user.avatarUrl} alt={user.name} />
              <span className="hdr__name">{user.name}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
