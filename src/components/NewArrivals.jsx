import { Link } from "react-router-dom";
import "./NewArrivals.css";

const ITEMS = [
  {
    id: "gpu-rtx",
    title: "Tarjeta Gráfica",
    desc: "Potencia gráfica sin igual.",
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop&crop=center",
  },
  {
    id: "ram-ddr5",
    title: "Memoria RAM",
    desc: "Aumenta la velocidad de tu sistema.",
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center",
  },
  {
    id: "ssd-nvme",
    title: "SSD NVMe",
    desc: "Almacenamiento ultrarrápido.",
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop&crop=center",
  },
  {
    id: "psu-modular",
    title: "Fuente de Alimentación",
    desc: "Eficiencia y estabilidad.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
  },
];

const NewArrivals = () => {
  return (
    <section className="new">
      <h2 className="new__title">Nuevas incorporaciones</h2>
      <div className="new__grid">
        {ITEMS.map((it) => (
          <article key={it.id} className="newcard">
            <Link to={`/productos/${it.id}`} className="newcard__link">
              <div className="newcard__img" style={{ backgroundImage: `url("${it.img}")` }} />
              <div className="newcard__body">
                <h3 className="newcard__h">{it.title}</h3>
                <p className="newcard__p">{it.desc}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
export default NewArrivals;
