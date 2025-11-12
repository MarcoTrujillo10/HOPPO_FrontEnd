import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { carouselService } from "../services/api";
import "./Hero.css";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCarouselProducts();
  }, []);

  const loadCarouselProducts = async () => {
    try {
      setLoading(true);
      
      const response = await carouselService.getActiveCarousel();
      
      let carouselItems = [];
      
      if (response && response.data) {
        carouselItems = Array.isArray(response.data) ? response.data : [];
      }
      
      // Convertir items del carrusel a productos para el componente
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
      const processedProducts = carouselItems.map(item => {
        const product = item.product || {};
        const images = (product.images || []).map(img => ({
          ...img,
          imageUrl: img.imageUrl?.startsWith('http') 
            ? img.imageUrl 
            : `${API_BASE_URL}${img.imageUrl}`
        }));

        return {
          ...product,
          id: product.id,
          name: item.customTitle || product.name,
          category: {
            ...product.category,
            description: item.customSubtitle || product.category?.description || 'Producto destacado'
          },
          images: images
        };
      });
      
      setProducts(processedProducts);
    } catch (error) {
      console.error('Error loading carousel:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [products.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  if (loading) {
    return (
      <section className="hero">
        <div className="hero__loading">
          <div className="hero__loading-spinner"></div>
          <p>Cargando productos destacados...</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="hero">
        <div className="hero__empty">
          <h2>No hay productos en el carrusel</h2>
          <p>Para mostrar productos en el carrusel:</p>
          <ol style={{ textAlign: 'left', display: 'inline-block', marginTop: '1rem' }}>
            <li>Ve al Panel de Administración</li>
            <li>Selecciona la pestaña "Carrusel" 🎠</li>
            <li>Agrega productos al carrusel</li>
            <li>Asegúrate de que los productos tengan imágenes</li>
          </ol>
          <Link to="/productos" className="btn btn--primary" style={{ marginTop: '1rem' }}>
            Ver todos los productos
          </Link>
        </div>
      </section>
    );
  }

  // Asegurar que tenemos una URL válida para la imagen
  const getImageUrl = (product) => {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    const imageUrl = product.images[0].imageUrl;
    if (!imageUrl) return null;
    
    // Si ya es una URL completa, retornarla
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Construir URL completa
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
    return `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };
  
  return (
    <section className="hero">
      <div className="hero__carousel">
        {products.map((product, index) => {
          const productImageUrl = getImageUrl(product);
          const productDiscountedPrice = calculateDiscountedPrice(product.price, product.discount || 0);
          const isActive = index === currentSlide;
          
          return (
            <div 
              key={product.id}
              className={`hero__slide ${isActive ? 'active' : ''}`}
              style={{ 
                backgroundImage: productImageUrl 
                  ? `linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.5)), url("${productImageUrl}")`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <div className="hero__content">
                {product.discount > 0 && (
                  <div className="hero__badge">
                    <span className="hero__discount">{product.discount}% OFF</span>
                  </div>
                )}
                
                <h1 className="hero__title">{product.name}</h1>
                <p className="hero__subtitle">{product.category?.description || 'Producto destacado'}</p>
                
                <div className="hero__price-section">
                  <span className="hero__price">{formatPrice(productDiscountedPrice)}</span>
                  {product.discount > 0 && (
                    <span className="hero__old-price">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                
                <div className="hero__actions">
                  <Link to={`/productos/${product.id}`} className="hero__btn hero__btn--primary">
                    Ver producto
                  </Link>
                  <Link to="/productos" className="hero__btn hero__btn--secondary">
                    Explorar todos
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        
        {products.length > 1 && (
          <>
            <button className="hero__nav hero__nav--prev" onClick={goToPrevSlide}>
              ‹
            </button>
            <button className="hero__nav hero__nav--next" onClick={goToNextSlide}>
              ›
            </button>
            
            <div className="hero__dots">
              {products.map((_, index) => (
                <button
                  key={index}
                  className={`hero__dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
  
export default Hero;
