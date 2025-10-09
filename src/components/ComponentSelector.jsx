import { useMemo, useState } from "react";
import { PC_PARTS } from "../data/pcPartsData";
import "./ComponentSelector.css";

export default function ComponentSelector({
  category,
  categoryName,
  selectedComponent,
  onSelectComponent,
}) {
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const base = PC_PARTS[category] || [];
    if (!q.trim()) return base;
    const t = q.toLowerCase();
    return base.filter(
      (i) =>
        i.nombre.toLowerCase().includes(t) ||
        (i.socket || "").toLowerCase().includes(t) ||
        (i.chipset || "").toLowerCase().includes(t) ||
        String(i.watts || "").includes(t) ||
        (i.tipo || "").toLowerCase().includes(t)
    );
  }, [category, q]);

  return (
    <div className="cs">
      <div className="cs__head">
        <h2 className="cs__title">{categoryName}</h2>
        <input
          className="cs__search"
          placeholder="Buscar en esta categoría"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="cs__grid">
        {items.map((i) => {
          const active = selectedComponent && selectedComponent.id === i.id;
          return (
            <article key={i.id} className={`cs__card ${active ? "is-active" : ""}`}>
              <div
                className="cs__thumb"
                style={{ backgroundImage: `url("${i.img}")` }}
              />
              <div className="cs__body">
                <h3 className="cs__name">{i.nombre}</h3>
                <div className="cs__meta">
                  {i.socket && <span>Socket: {i.socket}</span>}
                  {i.chipset && <span> · {i.chipset}</span>}
                  {i.watts && <span> · {i.watts}W</span>}
                  {i.tipo && <span> · {i.tipo}</span>}
                  {i.factor && <span> · {i.factor}</span>}
                  {i.nucleos && <span> · {i.nucleos}</span>}
                </div>
                <div className="cs__price">${i.precio.toFixed(2)}</div>
                <button
                  className="cs__btn"
                  onClick={() => onSelectComponent(i)}
                >
                  {active ? "Seleccionado ✓" : "Seleccionar"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
