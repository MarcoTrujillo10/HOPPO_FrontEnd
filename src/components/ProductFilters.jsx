const ProductFilters = ({ filters, setFilters, categorias, marcasOpts, clampMin, clampMax }) => {
  const toggleMarca = (m) => {
    setFilters((f) => ({
      ...f,
      marcas: f.marcas.includes(m)
        ? f.marcas.filter((x) => x !== m)
        : [...f.marcas, m],
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

      <div className="filters__block">
        <h3>Categoría</h3>
        <select
          value={filters.categoria}
          onChange={(e) => setFilters((f) => ({ ...f, categoria: e.target.value }))}
        >
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filters__block">
        <h3>Marcas</h3>
        <div className="filters__checks">
          {marcasOpts.map((m) => (
            <label key={m}>
              <input
                type="checkbox"
                checked={filters.marcas.includes(m)}
                onChange={() => toggleMarca(m)}
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      <div className="filters__block">
        <h3>Precio</h3>
        <div className="filters__price">
          <input
            type="number"
            min="0"
            placeholder="Mín"
            value={filters.min}
            onChange={(e) => clampMin(e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            min="0"
            placeholder="Máx"
            value={filters.max}
            onChange={(e) => clampMax(e.target.value)}
          />
        </div>
      </div>

      <div className="filters__block">
        <h3>Ordenar</h3>
        <select
          value={filters.orden}
          onChange={(e) => setFilters((f) => ({ ...f, orden: e.target.value }))}
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="alf-asc">Nombre A→Z</option>
          <option value="alf-desc">Nombre Z→A</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductFilters;
