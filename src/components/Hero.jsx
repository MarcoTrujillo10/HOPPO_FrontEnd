import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const promotionalProducts = [
    {
      id: "pc-gamer",
      title: "PC Gamer de Alto Rendimiento",
      subtitle: "Experimenta el máximo rendimiento",
      description: "Sistema completo con RTX 4080, Intel i7 y 32GB RAM DDR5",
      price: "$1,599",
      discount: "20% OFF",
      img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&h=600&fit=crop&crop=center",
      link: "/productos/pc-gamer"
    },
    {
      id: "gpu-rtx",
      title: "NVIDIA RTX 4080",
      subtitle: "Potencia gráfica de nueva generación",
      description: "16GB GDDR6X, ray tracing avanzado y DLSS 3.0",
      price: "$1,499",
      discount: "15% OFF",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=600&fit=crop&crop=center",
      link: "/productos/gpu-rtx"
    },
    {
      id: "ram-ddr5",
      title: "Memoria RAM DDR5 32GB",
      subtitle: "Velocidad de nueva generación",
      description: "5600MHz, latencia CL36, ideal para gaming y productividad",
      price: "$249",
      discount: "10% OFF",
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&h=600&fit=crop&crop=center",
      link: "/productos/ram-ddr5"
    },
    {
      id: "teclado-mecanico",
      title: "Teclado Mecánico Gaming",
      subtitle: "Precisión y comodidad",
      description: "Interruptores Cherry MX, retroiluminación RGB y diseño ergonómico",
      price: "$199",
      discount: "25% OFF",
      img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=1200&h=600&fit=crop&crop=center",
      link: "/productos/teclado-mecanico"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotionalProducts.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, [promotionalProducts.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? promotionalProducts.length - 1 : prev - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotionalProducts.length);
  };

  const currentProduct = promotionalProducts[currentSlide];
  
  return (
    <section className="hero">
      <div className="hero__carousel">
        <div 
          className="hero__slide active"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.5)), url("${currentProduct.img}")`
          }}
        >
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__discount">{currentProduct.discount}</span>
            </div>
            
            <h1 className="hero__title">{currentProduct.title}</h1>
            <p className="hero__subtitle">{currentProduct.subtitle}</p>
            <p className="hero__description">{currentProduct.description}</p>
            
            <div className="hero__price-section">
              <span className="hero__price">{currentProduct.price}</span>
              <span className="hero__old-price">
                ${Math.round(parseFloat(currentProduct.price.replace('$', '').replace(',', '')) * 1.25).toLocaleString()}
              </span>
            </div>
            
            <div className="hero__actions">
              <Link to={currentProduct.link} className="hero__btn hero__btn--primary">
                Ver producto
              </Link>
              <Link to="/productos" className="hero__btn hero__btn--secondary">
                Explorar todos
              </Link>
            </div>
          </div>
        </div>

        <button className="hero__nav hero__nav--prev" onClick={goToPrevSlide}>
          ‹
        </button>
        <button className="hero__nav hero__nav--next" onClick={goToNextSlide}>
          ›
        </button>

        <div className="hero__dots">
          {promotionalProducts.map((_, index) => (
            <button
              key={index}
              className={`hero__dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Hero;
