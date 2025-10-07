import { Link } from "react-router-dom";

const ProductCard = ({ p }) => {
  return (
    <article className="product">
      <Link to={`/productos/${p.id}`} className="product__link">
        <div
          className="product__img"
          style={{ backgroundImage: `url("${p.img}")` }}
        />

        <div className="product__body">
          <div>
            <h3 className="product__title">
              {p.nombre}
            </h3>

            <p className="product__desc">{p.detalle}</p>
            <small className="product__meta">
              {p.categoria} · {p.marca}
            </small>
          </div>

          <p className="product__price">${p.precio.toFixed(2)}</p>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
