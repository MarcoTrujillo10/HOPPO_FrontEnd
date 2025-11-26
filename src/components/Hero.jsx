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
      } else if (Array.isArray(response)) {
        carouselItems = response;
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
      const processedProducts = carouselItems
        .filter(item => item && item.product)
        .map(item => {
          const product = item.product || {};
          const images = (product.images || []).map(img => {
            let imageUrl = img.imageUrl || img.url || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
              imageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
              imageUrl = `${API_BASE_URL}${imageUrl}`;
            }
            return {
              ...img,
              imageUrl: imageUrl
            };
          });

          return {
            ...product,
            id: product.id,
            name: product.name || 'Producto',
            images: images
          };
        });
      
      setProducts(processedProducts);
      if (processedProducts.length > 0) {
        setCurrentSlide(0);
      }
    } catch (error) {
      console.error('Error loading carousel:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(timer);
    } else if (products.length === 1) {
      setCurrentSlide(0);
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
    if (!price && price !== 0) return '$0';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const getImageUrl = (product) => {
    if (!product || !product.images || product.images.length === 0) {
      return null;
    }
    
    const firstImage = product.images[0];
    let imageUrl = firstImage.imageUrl || firstImage.url || '';
    
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
    imageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${API_BASE_URL}${imageUrl}`;
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
        <div className="hero__banner">
          <div className="hero__content">
            <h1 className="hero__title">Bienvenido a HOPPO</h1>
            <p className="hero__subtitle">Tu tienda de componentes y periféricos</p>
            <div className="hero__actions">
              <Link to="/productos" className="hero__btn hero__btn--primary">
                Ver productos
              </Link>
              <Link to="/pc-builder" className="hero__btn hero__btn--secondary">
                Construir PC
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="hero">
      <div className="hero__carousel">
        {products.map((product, index) => {
          const productImageUrl = getImageUrl(product);
          const isActive = index === currentSlide;
          
          return (
            <div 
              key={product.id || `product-${index}`}
              className={`hero__slide ${isActive ? 'active' : ''}`}
              style={{ 
                backgroundImage: productImageUrl 
                  ? `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.6)), url("${productImageUrl}")`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <div className="hero__content">
                {product.hasDiscount && (
                  <div className="hero__badge">
                    <span className="hero__discount">-{product.discount}% OFF</span>
                  </div>
                )}
                <h1 className="hero__title">{product.name}</h1>
                <div className="hero__price-section">
                  {product.hasDiscount && (
                    <span className="hero__old-price">{formatPrice(product.price || 0)}</span>
                  )}
                  <span className="hero__price">
                    {formatPrice(product.discountedPrice || product.price || 0)}
                  </span>
                </div>
                <div className="hero__actions">
                  <Link to={`/productos/${product.id}`} className="hero__btn hero__btn--primary">
                    Ver producto
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
