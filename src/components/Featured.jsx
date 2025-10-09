import { Link } from "react-router-dom";
import "./Featured.css";

const ITEMS = [
  {
    id: "pc-gamer",
    title: "PC Gamer de Alto Rendimiento",
    desc: "Experimenta el máximo rendimiento.",
    img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&h=500&fit=crop&crop=center",
  },
  {
    id: "teclado-mecanico",
    title: "Teclado Mecánico Ergonómico",
    desc: "Mejora tu productividad y comodidad.",
    img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&crop=center",
  },
  {
    id: "mouse-gaming",
    title: "Mouse Inalámbrico para Gaming",
    desc: "Precisión y libertad de movimiento.",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&crop=center",
  },
  {
    id: "monitor-curvo",
    title: "Monitor Curvo para Gaming",
    desc: "Sumérgete en tus juegos favoritos.",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop&crop=center",
  },
];

const Featured = () =>{
  return (
    <section className="feat">
      <h2 className="feat__title">Productos destacados</h2>
      <div className="feat__grid">
        {ITEMS.map((it) => (
          <article key={it.id} className="card">
            <Link to={`/productos/${it.id}`} className="card__link">
              <div className="card__img" style={{ backgroundImage: `url("${it.img}")` }} />
              <div className="card__body">
                <h3 className="card__h">{it.title}</h3>
                <p className="card__p">{it.desc}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
export default Featured;
