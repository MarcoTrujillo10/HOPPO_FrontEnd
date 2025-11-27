import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import ProductManagement from '../components/admin/ProductManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import BrandManagement from '../components/admin/BrandManagement';
import OrderManagement from '../components/admin/OrderManagement';
import CarouselManagement from '../components/admin/CarouselManagement';
import './AdminPanel.css';
const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');

  if (user?.role !== 'VENDEDOR') {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>Solo los vendedores pueden acceder a este panel de administración.</p>
        </div>
      </div>
    );
  }
  const tabs = [
    { id: 'products', label: 'Productos', icon: '📦' },
    { id: 'categories', label: 'Categorías', icon: '📂' },
    { id: 'brands', label: 'Marcas', icon: '🏷️' },
    { id: 'carousel', label: 'Carrusel', icon: '🎠' },
    { id: 'orders', label: 'Órdenes', icon: '📋' },
  ];
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'brands':
        return <BrandManagement />;
      case 'carousel':
        return <CarouselManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return <ProductManagement />;
    }
  };
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛠️ Panel de Administración</h1>
        <p>Bienvenido, {user?.firstName} {user?.lastName}</p>
      </div>
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="admin-content">
        {renderActiveTab()}
      </div>
    </div>
  );
};
export default AdminPanel;
