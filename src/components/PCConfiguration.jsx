import "./PCConfiguration.css";

export default function PCConfiguration({ selectedComponents, totalPrice, isComplete }) {
  const entries = Object.entries(selectedComponents);

  return (
    <div className="cfg">
      <h2 className="cfg__title">Configuración</h2>

      <div className="cfg__list">
        {entries.map(([key, comp]) => (
          <div key={key} className="cfg__row">
            <span className="cfg__key">{label(key)}</span>
            <span className="cfg__val">
              {comp ? (
                <>
                  {comp.nombre} <em>· ${comp.precio.toFixed(2)}</em>
                </>
              ) : (
                <span className="cfg__placeholder">Sin seleccionar</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="cfg__total">
        <span>Total</span>
        <strong>${totalPrice.toFixed(2)}</strong>
      </div>

      <button className="cfg__buy" disabled={!isComplete}>
        {isComplete ? "Finalizar compra" : "Selecciona los componentes requeridos"}
      </button>
    </div>
  );
}

function label(k) {
  switch (k) {
    case "cpu": return "Procesador";
    case "motherboard": return "Placa Madre";
    case "gpu": return "Tarjeta Gráfica";
    case "ram": return "Memoria RAM";
    case "storage": return "Almacenamiento";
    case "psu": return "Fuente";
    case "case": return "Gabinete";
    case "cooling": return "Refrigeración";
    default: return k;
  }
}
