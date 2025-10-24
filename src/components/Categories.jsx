import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../services/api";
import "./Categories.css";
const getCategoryIcon = (category) => {
  const componentIcons = {
    "Procesadores": "🧠",
    "Tarjetas Gráficas": "🎮", 
    "Memoria RAM": "📈",
    "Almacenamiento": "💽",
    "Motherboards": "🔌",
    "Fuentes": "⚡",
    "Gabinetes": "🏠",
    "Placas Base": "🔌",
    "Procesador": "🧠",
    "RAM": "📈",
    "SSD": "💽",
    "HDD": "💽",
    "GPU": "🎮",
    
  };

  const peripheralIcons = {
    "Monitores": "🖥️",
    "Teclados": "⌨️",
    "Mouses": "🖱️",
    "Auriculares": "🎧",
    "Altavoces": "🔊",
    "Webcams": "📹",
    "Micrófonos": "🎤",
    "Mouse": "🖱️",
    "Teclado": "⌨️",
    "Monitor": "🖥️"
  };
  const iconMap = category.type === 'COMPONENTE' ? componentIcons : peripheralIcons;
  return iconMap[category.description] || (category.type === 'COMPONENTE' ? "🔧" : "🖱️");
};
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategories();
        setCategories(response.data.content || response.data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);
  if (loading) {
    return (
      <section className="cats">
        <h2 className="cats__title">Categorías principales</h2>
        <div className="cats__grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="cat loading">
              <div className="cat__icon loading-placeholder">📦</div>
              <div className="cat__label loading-text"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (categories.length === 0) {
    return (
      <section className="cats">
        <h2 className="cats__title">Categorías principales</h2>
        <div className="empty-state">
          <p>No hay categorías disponibles en este momento.</p>
          <p>Los vendedores pueden crear categorías desde el panel de administración.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="cats">
      <h2 className="cats__title">Categorías principales</h2>
      <div className="cats__grid">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={`/productos?categoria=${encodeURIComponent(category.description)}&tipo=${category.type}`} 
            className="cat"
          >
            <div className="cat__icon" aria-hidden>
              {getCategoryIcon(category)}
            </div>
            <h3 className="cat__label">{category.description}</h3>
            <span className="cat__type">
              {category.type === 'COMPONENTE' ? '🔧 Componente' : '🖱️ Periférico'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default Categories;
