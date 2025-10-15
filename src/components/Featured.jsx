import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/api";
import "./Featured.css";

const Featured = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({ limit: 4 });
        setProducts(response.data.content || response.data || []);
      } catch (error) {
        console.error('Error loading featured products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <section className="feat">
        <h2 className="feat__title">Productos destacados</h2>
        <div className="feat__grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card loading">
              <div className="card__img loading-placeholder"></div>
              <div className="card__body">
                <div className="loading-text"></div>
                <div className="loading-text short"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="feat">
        <h2 className="feat__title">Productos destacados</h2>
        <div className="empty-state">
          <p>No hay productos disponibles en este momento.</p>
          <p>Los vendedores pueden agregar productos desde el panel de administración.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="feat">
      <h2 className="feat__title">Productos destacados</h2>
      <div className="feat__grid">
        {products.map((product) => (
          <article key={product.id} className="card">
            <Link to={`/productos/${product.id}`} className="card__link">
              <div 
                className="card__img" 
                style={{ 
                  backgroundImage: `url("${product.images && product.images.length > 0 
                    ? product.images[0].url 
                    : 'https://via.placeholder.com/300x300?text=Sin+Imagen'}")` 
                }} 
              />
              <div className="card__body">
                <h3 className="card__h">{product.name}</h3>
                <p className="card__p">{product.description}</p>
                <div className="card__price">{formatPrice(product.price)}</div>
                {product.stock > 0 ? (
                  <div className="card__stock">Stock: {product.stock}</div>
                ) : (
                  <div className="card__stock out">Sin stock</div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Featured;
