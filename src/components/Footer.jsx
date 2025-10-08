import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="ftr">
      <div className="container">
        <nav className="ftr__links">
          <Link to="/acerca-de-nosotros">Acerca de nosotros</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/politica-de-privacidad">Política de privacidad</Link>
          <Link to="/terminos-de-servicio">Términos de servicio</Link>
        </nav>

        <div className="ftr__social">
          <a href="#" aria-label="X/Twitter">🐦</a>
          <a href="#" aria-label="Instagram">📷</a>
          <a href="#" aria-label="LinkedIn">💼</a>
        </div>

        <p className="ftr__copy">© 2025 HOPPO. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
export default Footer;
