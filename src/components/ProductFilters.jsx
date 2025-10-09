import { useState } from 'react';

const ProductFilters = ({ filters, setFilters, categorias, marcasOpts, clampMin, clampMax }) => {
  const [expandedFilters, setExpandedFilters] = useState({
    categoria: false,
    marcas: false,
    precio: false,
    orden: false
  });

  const toggleMarca = (m) => {
    setFilters((f) => ({
      ...f,
      marcas: f.marcas.includes(m)
        ? f.marcas.filter((x) => x !== m)
        : [...f.marcas, m],
    }));
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const clear = () =>
    setFilters({ q: "", categoria: "Todos", marcas: [], min: "", max: "", orden: "relevancia" });

  return (
    <aside className="filters">
      <div className="filters__head">
        <h2 className="filters__title">Filtros</h2>
        <button className="filters__clear" onClick={clear}>Limpiar</button>
      </div>

      <div className="filters__block">
        <label className="sr-only" htmlFor="search">Buscar</label>
        <input
          id="search"
          className="filters__search"
          placeholder="Buscar productos..."
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
        />
      </div>

      {/* Categoría Dropdown */}
      <div className="filters__dropdown">
        <button 
          className="filters__dropdown-header"
          onClick={() => toggleFilter('categoria')}
        >
          <h3>📁 Categoría</h3>
          <span className={`filters__dropdown-icon ${expandedFilters.categoria ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        <div className={`filters__dropdown-content ${expandedFilters.categoria ? 'expanded' : ''}`}>
          <select
            value={filters.categoria}
            onChange={(e) => setFilters((f) => ({ ...f, categoria: e.target.value }))}
            className="filters__select"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Marcas Dropdown */}
      <div className="filters__dropdown">
        <button 
          className="filters__dropdown-header"
          onClick={() => toggleFilter('marcas')}
        >
          <h3>🏷️ Marcas {filters.marcas.length > 0 && `(${filters.marcas.length})`}</h3>
          <span className={`filters__dropdown-icon ${expandedFilters.marcas ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        <div className={`filters__dropdown-content ${expandedFilters.marcas ? 'expanded' : ''}`}>
          <div className="filters__checks">
            {marcasOpts.map((m) => (
              <label key={m} className="filters__checkbox">
                <input
                  type="checkbox"
                  checked={filters.marcas.includes(m)}
                  onChange={() => toggleMarca(m)}
                />
                <span className="filters__checkbox-label">{m}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Precio Dropdown */}
      <div className="filters__dropdown">
        <button 
          className="filters__dropdown-header"
          onClick={() => toggleFilter('precio')}
        >
          <h3>💰 Precio</h3>
          <span className={`filters__dropdown-icon ${expandedFilters.precio ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        <div className={`filters__dropdown-content ${expandedFilters.precio ? 'expanded' : ''}`}>
          <div className="filters__price">
            <input
              type="number"
              min="0"
              placeholder="Mín"
              value={filters.min}
              onChange={(e) => clampMin(e.target.value)}
              className="filters__price-input"
            />
            <span className="filters__price-separator">—</span>
            <input
              type="number"
              min="0"
              placeholder="Máx"
              value={filters.max}
              onChange={(e) => clampMax(e.target.value)}
              className="filters__price-input"
            />
          </div>
        </div>
      </div>

      {/* Ordenar Dropdown */}
      <div className="filters__dropdown">
        <button 
          className="filters__dropdown-header"
          onClick={() => toggleFilter('orden')}
        >
          <h3>🔢 Ordenar</h3>
          <span className={`filters__dropdown-icon ${expandedFilters.orden ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>
        <div className={`filters__dropdown-content ${expandedFilters.orden ? 'expanded' : ''}`}>
          <select
            value={filters.orden}
            onChange={(e) => setFilters((f) => ({ ...f, orden: e.target.value }))}
            className="filters__select"
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="alf-asc">Nombre A→Z</option>
            <option value="alf-desc">Nombre Z→A</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilters;
