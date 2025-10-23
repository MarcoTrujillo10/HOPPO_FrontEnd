import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../services/api";
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
      // Temporalmente usar productos con descuento hasta que el backend soporte showInCarousel
      const response = await productService.getProducts({ discount: { gt: 0 } });
      const productsWithDiscount = response.data.content || response.data || [];
      
      // Si no hay productos con descuento, usar los primeros productos disponibles
      if (productsWithDiscount.length === 0) {
        const allProductsResponse = await productService.getProducts();
        const allProducts = allProductsResponse.data.content || allProductsResponse.data || [];
        setProducts(allProducts.slice(0, 3)); // Tomar los primeros 3 productos
      } else {
        setProducts(productsWithDiscount.slice(0, 5)); // Máximo 5 productos
      }
    } catch (error) {
      console.error('Error loading carousel products:', error);
      setProducts(getDefaultProducts());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultProducts = () => [
    {
      id: "pc-gamer",
      name: "PC Gamer de Alto Rendimiento",
      description: "Sistema completo con RTX 4080, Intel i7 y 32GB RAM DDR5",
      price: 1599,
      discount: 20,
      images: [{
        imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&h=600&fit=crop&crop=center"
      }]
    },
    {
      id: "gpu-rtx",
      name: "NVIDIA RTX 4080",
      description: "16GB GDDR6X, ray tracing avanzado y DLSS 3.0",
      price: 1499,
      discount: 15,
      images: [{
        imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=600&fit=crop&crop=center"
      }]
    }
  ];

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
          <h2>No hay productos destacados</h2>
          <p>Los vendedores pueden agregar productos al carrusel desde el panel de administración.</p>
          <Link to="/productos" className="btn btn--primary">
            Ver todos los productos
          </Link>
        </div>
      </section>
    );
  }

  const currentProduct = products[currentSlide];
  const discountedPrice = calculateDiscountedPrice(currentProduct.price, currentProduct.discount || 0);
  
  return (
    <section className="hero">
      <div className="hero__carousel">
        <div 
          className="hero__slide active"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.5)), url("${currentProduct.images?.[0]?.imageUrl || '/placeholder-product.jpg'}")`
          }}
        >
          <div className="hero__content">
            {currentProduct.discount > 0 && (
              <div className="hero__badge">
                <span className="hero__discount">{currentProduct.discount}% OFF</span>
              </div>
            )}
            
            <h1 className="hero__title">{currentProduct.name}</h1>
            <p className="hero__subtitle">{currentProduct.category?.description || 'Producto destacado'}</p>
            <p className="hero__description">{currentProduct.description}</p>
            
            <div className="hero__price-section">
              <span className="hero__price">{formatPrice(discountedPrice)}</span>
              {currentProduct.discount > 0 && (
                <span className="hero__old-price">
                  {formatPrice(currentProduct.price)}
                </span>
              )}
            </div>
            
            <div className="hero__actions">
              <Link to={`/productos/${currentProduct.id}`} className="hero__btn hero__btn--primary">
                Ver producto
              </Link>
              <Link to="/productos" className="hero__btn hero__btn--secondary">
                Explorar todos
              </Link>
            </div>
          </div>
        </div>
        
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
