import { Link } from "react-router-dom";
import "./Footer.css";
const Footer = () => {
  return (
    <footer className="ftr">
      <div className="container">
        <nav className="ftr__links">
          {["Acerca de nosotros","Contacto","Política de privacidad","Términos de servicio"].map((t)=>(
            <a key={t} href="#">{t}</a>
          ))}
        </nav>
        <div className="ftr__social">
          <a href="#" aria-label="X/Twitter">🐦</a>
          <a href="#" aria-label="Instagram">📷</a>
          <a href="#" aria-label="LinkedIn">💼</a>
        </div>
        <p className="ftr__copy">©   Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
export default Footer;
