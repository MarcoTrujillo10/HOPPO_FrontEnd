import { useState } from 'react';
import ComponentSelector from '../components/ComponentSelector';
import PCConfiguration from '../components/PCConfiguration';
import './PCBuilder.css';

const PCBuilder = () => {
  const [selectedComponents, setSelectedComponents] = useState({
    cpu: null,
    gpu: null,
    ram: null,
    motherboard: null,
    storage: null,
    psu: null,
    case: null,
    cooling: null
  });

  const [currentStep, setCurrentStep] = useState(0);

  const componentCategories = [
    { key: 'cpu', name: 'Procesador', icon: '🧠', required: true },
    { key: 'motherboard', name: 'Placa Madre', icon: '🔧', required: true },
    { key: 'gpu', name: 'Tarjeta Gráfica', icon: '🎮', required: true },
    { key: 'ram', name: 'Memoria RAM', icon: '💾', required: true },
    { key: 'storage', name: 'Almacenamiento', icon: '💿', required: true },
    { key: 'psu', name: 'Fuente de Poder', icon: '⚡', required: true },
    { key: 'case', name: 'Gabinete', icon: '📦', required: true },
    { key: 'cooling', name: 'Refrigeración', icon: '❄️', required: false }
  ];

  const updateComponent = (category, component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: component
    }));
  };

  const nextStep = () => {
    if (currentStep < componentCategories.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const calculateTotal = () => {
    return Object.values(selectedComponents)
      .filter(component => component !== null)
      .reduce((total, component) => total + component.precio, 0);
  };

  const isStepComplete = (step) => {
    const category = componentCategories[step];
    return category.required ? selectedComponents[category.key] !== null : true;
  };

  const isBuildComplete = () => {
    return componentCategories
      .filter(category => category.required)
      .every(category => selectedComponents[category.key] !== null);
  };

  return (
    <div className="pc-builder">
      <div className="container">
        <div className="pc-builder__header">
          <h1 className="pc-builder__title">
            🛠️ Armador de PC
          </h1>
          <p className="pc-builder__subtitle">
            Construye tu PC ideal paso a paso. Selecciona cada componente y ve el precio total actualizarse en tiempo real.
          </p>
        </div>

        <div className="pc-builder__content">
          {/* Progress Steps */}
          <div className="pc-builder__steps">
            {componentCategories.map((category, index) => (
              <div
                key={category.key}
                className={`pc-builder__step ${
                  index === currentStep ? 'pc-builder__step--active' : ''
                } ${
                  isStepComplete(index) ? 'pc-builder__step--complete' : ''
                }`}
                onClick={() => goToStep(index)}
              >
                <div className="pc-builder__step-icon">
                  {isStepComplete(index) ? '✅' : category.icon}
                </div>
                <span className="pc-builder__step-name">{category.name}</span>
              </div>
            ))}
          </div>

          <div className="pc-builder__main">
            {/* Component Selection */}
            <div className="pc-builder__selector">
              <ComponentSelector
                category={componentCategories[currentStep].key}
                categoryName={componentCategories[currentStep].name}
                selectedComponent={selectedComponents[componentCategories[currentStep].key]}
                onSelectComponent={(component) => 
                  updateComponent(componentCategories[currentStep].key, component)
                }
              />
            </div>

            {/* PC Configuration Summary */}
            <div className="pc-builder__config">
              <PCConfiguration
                selectedComponents={selectedComponents}
                totalPrice={calculateTotal()}
                isComplete={isBuildComplete()}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="pc-builder__navigation">
            <button
              className="pc-builder__nav-btn pc-builder__nav-btn--prev"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              ← Anterior
            </button>
            
            <div className="pc-builder__step-info">
              Paso {currentStep + 1} de {componentCategories.length}
            </div>

            <button
              className="pc-builder__nav-btn pc-builder__nav-btn--next"
              onClick={nextStep}
              disabled={currentStep === componentCategories.length - 1}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCBuilder;
