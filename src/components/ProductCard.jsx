import { Link } from "react-router-dom";

const ProductCard = ({ p }) => {
  return (
    <article className="product">
      <div
        className="product__img"
        style={{ backgroundImage: `url("${p.img}")` }}
      />

      <div className="product__body">
        <div>
          <Link to={`/productos/${p.id}`} className="product__title">
            {p.nombre}
          </Link>

          <p className="product__desc">{p.detalle}</p>
          <small className="product__meta">
            {p.categoria} · {p.marca}
          </small>
        </div>

        <p className="product__price">${p.precio.toFixed(2)}</p>
      </div>
    </article>
  );
};

export default ProductCard;
