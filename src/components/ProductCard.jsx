import { Link } from "react-router-dom";

const ProductCard = ({ p }) => {
  // Mapear datos del backend a la estructura esperada
  const productData = {
    id: p.id,
    nombre: p.name,
    detalle: p.description || p.detail || '',
    categoria: p.category?.description || 'Sin categoría',
    marca: p.brand?.name || 'Sin marca',
    precio: p.price || 0,
    img: p.images && p.images.length > 0 
      ? p.images[0].url 
      : 'https://via.placeholder.com/300x300?text=Sin+Imagen',
    stock: p.stock || 0
  };

  return (
    <article className="product">
      <Link to={`/productos/${productData.id}`} className="product__link">
        <div
          className="product__img"
          style={{ backgroundImage: `url("${productData.img}")` }}
        />

        <div className="product__body">
          <div>
            <h3 className="product__title">
              {productData.nombre}
            </h3>

            <p className="product__desc">{productData.detalle}</p>
            <small className="product__meta">
              {productData.categoria} · {productData.marca}
            </small>
            {productData.stock > 0 && (
              <small className="product__stock">
                Stock: {productData.stock}
              </small>
            )}
          </div>

          <p className="product__price">${productData.precio.toFixed(2)}</p>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
