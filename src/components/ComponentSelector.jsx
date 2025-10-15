import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import './ComponentSelector.css';

const ComponentSelector = ({ category, categoryName, selectedComponent, onSelectComponent }) => {
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000000],
    brand: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('price');

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await productService.getProducts({
          category: category,
          limit: 50
        });
        
        let components = (response.data.content || response.data).map(p => ({
          id: p.id,
          nombre: p.name,
          marca: p.brand?.name || 'Sin marca',
          detalle: p.description || '',
          precio: p.price || 0,
          img: p.images && p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/300x300?text=Sin+Imagen',
          stock: p.stock || 0,
          especificaciones: {} // Por ahora vacío
        }));
        
        // Apply filters
        if (filters.brand) {
          components = components.filter(comp => 
            comp.marca.toLowerCase().includes(filters.brand.toLowerCase())
          );
        }
        
        if (filters.search) {
          components = components.filter(comp =>
            comp.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
            comp.marca.toLowerCase().includes(filters.search.toLowerCase()) ||
            comp.detalle.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        // Price filter
        components = components.filter(comp =>
          comp.precio >= filters.priceRange[0] && comp.precio <= filters.priceRange[1]
        );
        
        // Sort
        components.sort((a, b) => {
          switch (sortBy) {
            case 'price':
              return a.precio - b.precio;
            case 'name':
              return a.nombre.localeCompare(b.nombre);
            case 'brand':
              return a.marca.localeCompare(b.marca);
            default:
              return 0;
          }
        });
        
        setFilteredComponents(components);
      } catch (error) {
        console.error('Error fetching components:', error);
        setFilteredComponents([]);
      }
    };

    fetchComponents();
  }, [category, filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const getBrands = () => {
    return [...new Set(filteredComponents.map(comp => comp.marca))];
  };

  return (
    <div className="component-selector">
      <div className="component-selector__header">
        <h2 className="component-selector__title">
          Selecciona tu {categoryName}
        </h2>
        {selectedComponent && (
          <div className="component-selector__selected">
            <span>Seleccionado: </span>
            <strong>{selectedComponent.marca} {selectedComponent.nombre}</strong>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="component-selector__filters">
        <div className="component-selector__filter">
          <label>Buscar:</label>
          <input
            type="text"
            placeholder="Buscar componente..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="component-selector__search"
          />
        </div>

        <div className="component-selector__filter">
          <label>Marca:</label>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="component-selector__select"
          >
            <option value="">Todas las marcas</option>
            {getBrands().map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="component-selector__filter">
          <label>Precio máximo:</label>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000000])}
            className="component-selector__price-input"
          />
        </div>

        <div className="component-selector__filter">
          <label>Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="component-selector__select"
          >
            <option value="price">Precio</option>
            <option value="name">Nombre</option>
            <option value="brand">Marca</option>
          </select>
        </div>
      </div>

      {/* Components Grid */}
      <div className="component-selector__grid">
        {filteredComponents.length === 0 ? (
          <div className="component-selector__empty">
            <p>No se encontraron componentes con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredComponents.map(component => (
            <div
              key={component.id}
              className={`component-selector__item ${
                selectedComponent?.id === component.id ? 'component-selector__item--selected' : ''
              }`}
              onClick={() => onSelectComponent(component)}
            >
              <div className="component-selector__item-image">
                <img
                  src={component.img}
                  alt={component.nombre}
                  onError={(e) => {
                    e.target.src = '/placeholder-component.png';
                  }}
                />
              </div>
              
              <div className="component-selector__item-info">
                <h3 className="component-selector__item-brand">{component.marca}</h3>
                <h4 className="component-selector__item-name">{component.nombre}</h4>
                
                {component.especificaciones && (
                  <div className="component-selector__item-specs">
                    {Object.entries(component.especificaciones).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="component-selector__spec">
                        <span className="component-selector__spec-key">{key}:</span>
                        <span className="component-selector__spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="component-selector__item-price">
                  {formatPrice(component.precio)}
                </div>
                
                {component.stock && component.stock < 10 && (
                  <div className="component-selector__item-stock">
                    ¡Solo quedan {component.stock} unidades!
                  </div>
                )}
              </div>
              
              <button className="component-selector__select-btn">
                {selectedComponent?.id === component.id ? 'Seleccionado' : 'Seleccionar'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComponentSelector;
