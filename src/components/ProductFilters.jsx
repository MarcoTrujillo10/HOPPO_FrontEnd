import { useState, useMemo, useEffect } from "react";

const defaultOpen = {
  search: true,
  categoria: true,
  marca: true,
  precio: true,
  orden: false,
};

// util de clamp local
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default function ProductFilters({
  filters,
  setFilters,
  categorias = ["Todos"],
  marcasOpts = [],
}) {
  const [open, setOpen] = useState(defaultOpen);

  // === DRAFT LOCAL PARA PRECIO ===
  const [priceDraft, setPriceDraft] = useState({
    min: filters.min ?? "",
    max: filters.max ?? "",
  });

  // si desde afuera cambian los filtros (limpiar, etc.), sincronizo el draft
  useEffect(() => {
    setPriceDraft({
      min: filters.min ?? "",
      max: filters.max ?? "",
    });
  }, [filters.min, filters.max]);

  // handlers de filtro
  const onChangeSearch = (e) =>
    setFilters((f) => ({ ...f, q: e.target.value }));

  const onChangeCategoria = (e) =>
    setFilters((f) => ({ ...f, categoria: e.target.value }));

  const toggleMarca = (name) =>
    setFilters((f) => {
      const current = new Set(f.marcas || []);
      current.has(name) ? current.delete(name) : current.add(name);
      return { ...f, marcas: Array.from(current) };
    });

  const onChangeOrden = (e) =>
    setFilters((f) => ({ ...f, orden: e.target.value }));

  const clearAll = () =>
    setFilters({
      q: "",
      categoria: "Todos",
      marcas: [],
      min: "",
      max: "",
      orden: "relevancia",
    });

  // ordenar marcas para UX
  const marcasOrdenadas = useMemo(
    () => [...marcasOpts].sort((a, b) => a.localeCompare(b)),
    [marcasOpts]
  );

  // evita que Enter envíe un form implícito y recargue la página
  const preventEnter = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  // aplicar precio: pasa de draft -> filters (dispara fetch 1 sola vez)
  const applyPrice = () => {
    const rawMin = priceDraft.min;
    const rawMax = priceDraft.max;

    const nextMin =
      rawMin === "" ? "" : clamp(Number(rawMin) || 0, 0, 100000);
    const nextMax =
      rawMax === "" ? "" : clamp(Number(rawMax) || 0, 0, 100000);

    // validación simple: si ambos existen y min > max, no aplicar
    if (nextMin !== "" && nextMax !== "" && Number(nextMin) > Number(nextMax)) {
      // opcional: mostrar toast/alert
      return;
    }

    setFilters((f) => ({
      ...f,
      min: nextMin,
      max: nextMax,
    }));
  };

  // aplicar con Enter dentro de los inputs de precio
  const onPriceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyPrice();
    }
  };

  return (
    <aside className="filters">
      <div className="filters__head">
        <h3 className="filters__title">Filtros</h3>
        <button type="button" className="filters__clear" onClick={clearAll}>
          Limpiar
        </button>
      </div>

      {/* === BUSCADOR === */}
      <div className="filters__block">
        <input
          className="filters__search"
          type="text"
          placeholder="Buscar producto..."
          value={filters.q}
          onChange={onChangeSearch}
          onKeyDown={preventEnter}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* === CATEGORÍA === */}
      <div className="filters__dropdown">
        <button
          type="button"
          className="filters__dropdown-header"
          onClick={() => setOpen((o) => ({ ...o, categoria: !o.categoria }))}
        >
          <h3>Categoría</h3>
          <span
            className={`filters__dropdown-icon ${
              open.categoria ? "expanded" : ""
            }`}
          >
            ▾
          </span>
        </button>

        <div
          className={`filters__dropdown-content ${
            open.categoria ? "expanded" : ""
          }`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <select
            className="filters__select"
            value={filters.categoria}
            onChange={onChangeCategoria}
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* === MARCA === */}
      <div className="filters__dropdown">
        <button
          type="button"
          className="filters__dropdown-header"
          onClick={() => setOpen((o) => ({ ...o, marca: !o.marca }))}
        >
          <h3>Marcas</h3>
          <span
            className={`filters__dropdown-icon ${
              open.marca ? "expanded" : ""
            }`}
          >
            ▾
          </span>
        </button>

        <div
          className={`filters__dropdown-content ${
            open.marca ? "expanded" : ""
          }`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="filters__checks">
            {marcasOrdenadas.map((m) => {
              const checked = (filters.marcas || []).includes(m);
              return (
                <label key={m} className="filters__checkbox">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMarca(m)}
                  />
                  <span className="filters__checkbox-label">{m}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* === PRECIO === */}
      <div className="filters__dropdown">
        <button
          type="button"
          className="filters__dropdown-header"
          onClick={() => setOpen((o) => ({ ...o, precio: !o.precio }))}
        >
          <h3>Precio</h3>
          <span
            className={`filters__dropdown-icon ${
              open.precio ? "expanded" : ""
            }`}
          >
            ▾
          </span>
        </button>

        <div
          className={`filters__dropdown-content ${
            open.precio ? "expanded" : ""
          }`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            className="filters__price"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <input
              type="number"
              inputMode="numeric"
              className="filters__price-input"
              placeholder="Mín"
              value={priceDraft.min}
              onChange={(e) =>
                setPriceDraft((d) => ({ ...d, min: e.target.value }))
              }
              onKeyDown={onPriceKeyDown}
              onFocus={(e) => e.stopPropagation()}
              min={0}
              step="1"
            />
            <span className="filters__price-separator">—</span>
            <input
              type="number"
              inputMode="numeric"
              className="filters__price-input"
              placeholder="Máx"
              value={priceDraft.max}
              onChange={(e) =>
                setPriceDraft((d) => ({ ...d, max: e.target.value }))
              }
              onKeyDown={onPriceKeyDown}
              onFocus={(e) => e.stopPropagation()}
              min={0}
              step="1"
            />
          </div>

          <button
            type="button"
            className="filters__apply"
            onClick={(e) => {
              e.stopPropagation();
              applyPrice();
            }}
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* === ORDEN === */}
      <div className="filters__dropdown">
        <button
          type="button"
          className="filters__dropdown-header"
          onClick={() => setOpen((o) => ({ ...o, orden: !o.orden }))}
        >
          <h3>Ordenar</h3>
          <span
            className={`filters__dropdown-icon ${
              open.orden ? "expanded" : ""
            }`}
          >
            ▾
          </span>
        </button>

        <div
          className={`filters__dropdown-content ${
            open.orden ? "expanded" : ""
          }`}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <select
            className="filters__select"
            value={filters.orden}
            onChange={onChangeOrden}
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="alf-asc">Nombre: A → Z</option>
            <option value="alf-desc">Nombre: Z → A</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
