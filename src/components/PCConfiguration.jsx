import './PCConfiguration.css';

const PCConfiguration = ({ selectedComponents, totalPrice, isComplete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getComponentIcon = (category) => {
    const icons = {
      cpu: '🧠',
      gpu: '🎮',
      ram: '💾',
      motherboard: '🔧',
      storage: '💿',
      psu: '⚡',
      case: '📦',
      cooling: '❄️'
    };
    return icons[category] || '🔧';
  };

  const getComponentName = (category) => {
    const names = {
      cpu: 'Procesador',
      gpu: 'Tarjeta Gráfica',
      ram: 'Memoria RAM',
      motherboard: 'Placa Madre',
      storage: 'Almacenamiento',
      psu: 'Fuente de Poder',
      case: 'Gabinete',
      cooling: 'Refrigeración'
    };
    return names[category] || category;
  };

  const calculateCompatibility = () => {
    const warnings = [];
    
    // Check CPU and Motherboard compatibility
    if (selectedComponents.cpu && selectedComponents.motherboard) {
      const cpuSocket = selectedComponents.cpu.especificaciones?.Socket;
      const mbSocket = selectedComponents.motherboard.especificaciones?.Socket;
      
      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        warnings.push('⚠️ Socket incompatible entre CPU y Placa Madre');
      }
    }
    
    // Check RAM and Motherboard compatibility
    if (selectedComponents.ram && selectedComponents.motherboard) {
      const ramType = selectedComponents.ram.especificaciones?.['Velocidad']?.includes('DDR4') ? 'DDR4' : 
                     selectedComponents.ram.especificaciones?.['Velocidad']?.includes('DDR5') ? 'DDR5' : null;
      const mbRam = selectedComponents.motherboard.especificaciones?.RAM;
      
      if (ramType && mbRam && !mbRam.includes(ramType)) {
        warnings.push('⚠️ Tipo de RAM incompatible con la Placa Madre');
      }
    }
    
    // Check power consumption
    if (selectedComponents.psu && selectedComponents.gpu) {
      const psuWattage = parseInt(selectedComponents.psu.especificaciones?.['Potencia']?.replace('W', '') || '0');
      const gpuConsumption = parseInt(selectedComponents.gpu.especificaciones?.['Consumo']?.replace('W', '') || '0');
      const cpuConsumption = parseInt(selectedComponents.cpu?.especificaciones?.['TDP']?.replace('W', '') || '0');
      
      const estimatedConsumption = gpuConsumption + cpuConsumption + 150; // +150W for other components
      
      if (psuWattage < estimatedConsumption) {
        warnings.push('⚠️ La fuente podría no ser suficiente para el consumo estimado');
      }
    }
    
    return warnings;
  };

  const compatibilityWarnings = calculateCompatibility();

  return (
    <div className="pc-configuration">
      <div className="pc-configuration__header">
        <h3 className="pc-configuration__title">🖥️ Tu PC Armada</h3>
        <div className="pc-configuration__status">
          {isComplete ? (
            <span className="pc-configuration__status--complete">✅ Completa</span>
          ) : (
            <span className="pc-configuration__status--incomplete">⚠️ Incompleta</span>
          )}
        </div>
      </div>

      <div className="pc-configuration__components">
        {Object.entries(selectedComponents).map(([category, component]) => (
          <div key={category} className="pc-configuration__component">
            <div className="pc-configuration__component-header">
              <span className="pc-configuration__component-icon">
                {getComponentIcon(category)}
              </span>
              <span className="pc-configuration__component-name">
                {getComponentName(category)}
              </span>
            </div>
            
            {component ? (
              <div className="pc-configuration__component-details">
              <div className="pc-configuration__component-info">
                <div className="pc-configuration__component-brand">{component.marca}</div>
                <div className="pc-configuration__component-model">{component.nombre}</div>
                <div className="pc-configuration__component-price">
                  {formatPrice(component.precio)}
                </div>
              </div>
              {component.img && (
                <div className="pc-configuration__component-image">
                  <img 
                    src={component.img} 
                    alt={component.nombre}
                    onError={(e) => {
                      e.target.src = '/placeholder-component.png';
                    }}
                  />
                </div>
              )}
              </div>
            ) : (
              <div className="pc-configuration__component-empty">
                No seleccionado
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Compatibility Warnings */}
      {compatibilityWarnings.length > 0 && (
        <div className="pc-configuration__warnings">
          <h4 className="pc-configuration__warnings-title">Advertencias de Compatibilidad:</h4>
          {compatibilityWarnings.map((warning, index) => (
            <div key={index} className="pc-configuration__warning">
              {warning}
            </div>
          ))}
        </div>
      )}

      {/* Total Price */}
      <div className="pc-configuration__total">
        <div className="pc-configuration__total-label">Total estimado:</div>
        <div className="pc-configuration__total-price">
          {formatPrice(totalPrice)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pc-configuration__actions">
        <button 
          className="pc-configuration__btn pc-configuration__btn--save"
          disabled={!isComplete}
        >
          💾 Guardar Configuración
        </button>
        <button 
          className="pc-configuration__btn pc-configuration__btn--cart"
          disabled={!isComplete}
        >
          🛒 Agregar al Carrito
        </button>
      </div>

      {/* Build Summary */}
      {isComplete && (
        <div className="pc-configuration__summary">
          <h4 className="pc-configuration__summary-title">Resumen de tu Build:</h4>
          <div className="pc-configuration__summary-stats">
            <div className="pc-configuration__stat">
              <span className="pc-configuration__stat-label">Componentes:</span>
              <span className="pc-configuration__stat-value">
                {Object.values(selectedComponents).filter(comp => comp !== null).length}/8
              </span>
            </div>
            <div className="pc-configuration__stat">
              <span className="pc-configuration__stat-label">Categorías:</span>
              <span className="pc-configuration__stat-value">
                {Object.keys(selectedComponents).filter(cat => selectedComponents[cat] !== null).length}
              </span>
            </div>
            <div className="pc-configuration__stat">
              <span className="pc-configuration__stat-label">Compatibilidad:</span>
              <span className="pc-configuration__stat-value">
                {compatibilityWarnings.length === 0 ? '✅ OK' : '⚠️ Revisar'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PCConfiguration;
