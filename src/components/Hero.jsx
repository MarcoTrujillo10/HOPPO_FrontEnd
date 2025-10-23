import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bannerService } from "../services/api";
import "./Hero.css";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerService.getActiveBanners();
      const activeBanners = response.data
        .filter(banner => banner.isActive)
        .sort((a, b) => a.order - b.order);
      setBanners(activeBanners);
    } catch (error) {
      console.error('Error loading banners:', error);
      setBanners(getDefaultBanners());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultBanners = () => [
    {
      id: "pc-gamer",
      title: "PC Gamer de Alto Rendimiento",
      subtitle: "Experimenta el máximo rendimiento",
      description: "Sistema completo con RTX 4080, Intel i7 y 32GB RAM DDR5",
      price: "$1,599",
      discount: "20% OFF",
      imageUrl: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&h=600&fit=crop&crop=center",
      link: "/productos/pc-gamer"
    },
    {
      id: "gpu-rtx",
      title: "NVIDIA RTX 4080",
      subtitle: "Potencia gráfica de nueva generación",
      description: "16GB GDDR6X, ray tracing avanzado y DLSS 3.0",
      price: "$1,499",
      discount: "15% OFF",
      imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=600&fit=crop&crop=center",
      link: "/productos/gpu-rtx"
    }
  ];

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <section className="hero">
        <div className="hero__loading">
          <div className="hero__loading-spinner"></div>
          <p>Cargando promociones...</p>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="hero">
        <div className="hero__empty">
          <h2>No hay promociones disponibles</h2>
          <Link to="/productos" className="btn btn--primary">
            Ver todos los productos
          </Link>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentSlide];
  
  return (
    <section className="hero">
      <div className="hero__carousel">
        <div 
          className="hero__slide active"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.5)), url("${currentBanner.imageUrl}")`
          }}
        >
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__discount">{currentBanner.discount}</span>
            </div>
            
            <h1 className="hero__title">{currentBanner.title}</h1>
            <p className="hero__subtitle">{currentBanner.subtitle}</p>
            <p className="hero__description">{currentBanner.description}</p>
            
            <div className="hero__price-section">
              <span className="hero__price">{currentBanner.price}</span>
              <span className="hero__old-price">
                ${Math.round(parseFloat(currentBanner.price.replace('$', '').replace(',', '')) * 1.25).toLocaleString()}
              </span>
            </div>
            
            <div className="hero__actions">
              <Link to={currentBanner.link} className="hero__btn hero__btn--primary">
                Ver producto
              </Link>
              <Link to="/productos" className="hero__btn hero__btn--secondary">
                Explorar todos
              </Link>
            </div>
          </div>
        </div>
        
        {banners.length > 1 && (
          <>
            <button className="hero__nav hero__nav--prev" onClick={goToPrevSlide}>
              ‹
            </button>
            <button className="hero__nav hero__nav--next" onClick={goToNextSlide}>
              ›
            </button>
            
            <div className="hero__dots">
              {banners.map((_, index) => (
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
