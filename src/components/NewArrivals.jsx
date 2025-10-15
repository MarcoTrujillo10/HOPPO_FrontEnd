import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/api";
import "./NewArrivals.css";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({ limit: 4, offset: 4 }); // Skip first 4 to get different products
        setProducts(response.data.content || response.data || []);
      } catch (error) {
        console.error('Error loading new products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadNewProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (loading) {
    return (
      <section className="new">
        <h2 className="new__title">Nuevas incorporaciones</h2>
        <div className="new__grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="newcard loading">
              <div className="newcard__img loading-placeholder"></div>
              <div className="newcard__body">
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
      <section className="new">
        <h2 className="new__title">Nuevas incorporaciones</h2>
        <div className="empty-state">
          <p>No hay productos nuevos disponibles en este momento.</p>
          <p>Los vendedores pueden agregar productos desde el panel de administración.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="new">
      <h2 className="new__title">Nuevas incorporaciones</h2>
      <div className="new__grid">
        {products.map((product) => (
          <article key={product.id} className="newcard">
            <Link to={`/productos/${product.id}`} className="newcard__link">
              <div 
                className="newcard__img" 
                style={{ 
                  backgroundImage: `url("${product.images && product.images.length > 0 
                    ? product.images[0].url 
                    : 'https://via.placeholder.com/300x300?text=Sin+Imagen'}")` 
                }} 
              />
              <div className="newcard__body">
                <h3 className="newcard__h">{product.name}</h3>
                <p className="newcard__p">{product.description}</p>
                <div className="newcard__price">{formatPrice(product.price)}</div>
                {product.stock > 0 ? (
                  <div className="newcard__stock">Stock: {product.stock}</div>
                ) : (
                  <div className="newcard__stock out">Sin stock</div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
