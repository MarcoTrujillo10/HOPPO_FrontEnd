import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAN69ew-W4wENPT_BmQA2Dcs4so99bLpcbhvEIFGQgRr-DE5_0zy3hxvo682qWaYaEWzFxS9aa-MNbLjpDNU35bA0H7IihuNi4rd_CXkWcNpPyoubz7dd0O5D0kfhD32xskfUccK4i_nwQ7OJ69z_cZl9cirLqN2jDdSGzUOyZsMDRXheocDcsGNn0UcI70xo5q14GADb4rN0ry_exdFVlhgzCwowfWA_Jh9F3-3SqVQs_RIggsVm3nWC2wLcQg8B6vd-4N8cBFFSQ";
  
  return (
    <section className="hero" style={{ 
      backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.6)), url("${IMG}")`
    }}>
      <div className="hero__box">
        <h1 className="hero__title">Eleva tu experiencia digital</h1>
        <p className="hero__text">
          Descubre lo último en componentes y periféricos para PC. Construye la
          máquina de tus sueños con nuestra selección premium.
        </p>
        <Link to="/productos" className="hero__btn">
          Explorar productos
        </Link>
      </div>
    </section>
  );
};
export default Hero;
