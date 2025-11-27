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
    precioConDescuento: p.discountedPrice || p.price || 0,
    descuento: p.discount || 0,
    tieneDescuento: p.hasDiscount || false,
    stock: p.stock || 0,
    images: p.images || []
  };
  // Obtener imagen principal
  const imagenPrincipal = productData.images.length > 0 
    ? productData.images[0].imageUrl 
    : 'https://via.placeholder.com/300x300?text=Sin+Imagen';
  return (
    <article className="product">
      <Link to={`/productos/${productData.id}`} className="product__link">
        <div className="product__image-container">
          <div
            className="product__img"
            style={{ backgroundImage: `url("${imagenPrincipal}")` }}
          />
          {productData.images.length > 1 && (
            <div className="product__image-count">
              +{productData.images.length - 1}
            </div>
          )}
          {productData.tieneDescuento && (
            <div className="product__discount-badge">
              -{productData.descuento}%
            </div>
          )}
        </div>
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
          <div className="product__pricing">
            {productData.tieneDescuento && (
              <span className="product__price-original">
                ${productData.precio.toFixed(2)}
              </span>
            )}
            <p className="product__price">${productData.precioConDescuento.toFixed(2)}</p>
          </div>
        </div>
      </Link>
    </article>
  );
};
export default ProductCard;
