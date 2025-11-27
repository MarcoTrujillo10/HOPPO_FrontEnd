import { useState, useEffect } from 'react';
import { carouselService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './AdminComponents.css';

const CarouselManagement = () => {
  const { user } = useAuth();
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [draggedItem, setDraggedItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, productId: null });

  useEffect(() => {
    loadCarouselItems();
  }, []);

  const loadCarouselItems = async () => {
    try {
      setLoading(true);
      setStatus({ type: '', message: '' });
      const response = await carouselService.getAllCarouselItems();
      setCarouselItems(response.data || []);
    } catch (error) {
      console.error('Error loading carousel items:', error);
      setStatus({ 
        type: 'error', 
        message: 'Error al cargar los items del carrusel' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }

    const newItems = [...carouselItems];
    const draggedItemData = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedItemData);

    // Actualizar el estado local inmediatamente para feedback visual
    setCarouselItems(newItems);
    setDraggedItem(null);

    // Enviar el nuevo orden al backend
    try {
      const carouselItemIds = newItems.map(item => item.id);
      await carouselService.reorderCarouselItems(carouselItemIds);
      setStatus({ type: 'success', message: 'Orden del carrusel actualizado exitosamente' });
      await loadCarouselItems(); // Recargar para asegurar sincronización
    } catch (error) {
      console.error('Error reordering carousel:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al reordenar el carrusel' 
      });
      // Revertir al estado anterior
      await loadCarouselItems();
    }
  };

  const requestRemove = (productId) => {
    setConfirmDelete({ show: true, productId });
  };

  const confirmRemove = async () => {
    if (!confirmDelete.productId) return;

    try {
      await carouselService.removeProductFromCarousel(confirmDelete.productId);
      setStatus({ type: 'success', message: 'Producto removido del carrusel exitosamente' });
      await loadCarouselItems();
    } catch (error) {
      console.error('Error removing from carousel:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al remover el producto del carrusel' 
      });
    } finally {
      setConfirmDelete({ show: false, productId: null });
    }
  };

  const cancelRemove = () => {
    setConfirmDelete({ show: false, productId: null });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  if (!user || user.role !== 'VENDEDOR') {
    return (
      <div className="admin-section">
        <div style={{ padding: '20px', textAlign: 'center', color: '#e74c3c' }}>
          <h3>⚠️ Acceso Denegado</h3>
          <p>Solo los vendedores pueden gestionar el carrusel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Cargando carrusel...</div>;
  }

  return (
    <div className="admin-section">
      <h2>🎠 Gestión del Carrusel Principal</h2>
      
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
          📋 Información del Carrusel
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>El carrusel muestra hasta <strong>5 productos</strong> en la página principal</li>
          <li>Los productos se muestran en el <strong>orden de agregación</strong></li>
          <li>Puedes <strong>arrastrar y soltar</strong> los productos para reordenarlos</li>
          <li>Solo productos con <strong>stock disponible e imágenes</strong> pueden estar en el carrusel</li>
          <li>Para agregar productos, edítalos desde la sección "Productos" y marca la opción "Agregar al carrusel"</li>
        </ul>
      </div>

      <div className="admin-list">
        <h3>Productos en el Carrusel ({carouselItems.length}/5)</h3>
        
        {carouselItems.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1em', color: '#666', marginBottom: '10px' }}>
              No hay productos en el carrusel
            </p>
            <p style={{ color: '#999' }}>
              Edita un producto desde la sección "Productos" y marca la opción "Agregar al carrusel" para comenzar.
            </p>
          </div>
        ) : (
          <div className="carousel-items-list">
            {carouselItems.map((item, index) => {
              const product = item.product;
              const imageUrl = product?.images?.[0]?.imageUrl;
              const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
              const fullImageUrl = imageUrl?.startsWith('http') 
                ? imageUrl 
                : `${API_BASE_URL}${imageUrl}`;

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`carousel-item-card ${draggedItem === index ? 'dragging' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '15px',
                    marginBottom: '10px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'move',
                    transition: 'all 0.2s',
                    opacity: draggedItem === index ? 0.5 : 1
                  }}
                >
                  <div style={{ 
                    fontSize: '24px', 
                    color: '#999',
                    userSelect: 'none'
                  }}>
                    ☰
                  </div>
                  
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    color: '#13a4ec',
                    minWidth: '30px',
                    textAlign: 'center'
                  }}>
                    {index + 1}
                  </div>

                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: '#f0f0f0'
                  }}>
                    {fullImageUrl ? (
                      <img 
                        src={fullImageUrl} 
                        alt={product?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '12px'
                      }}>
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1em' }}>
                      {product?.name}
                    </h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '0.9em' }}>
                      {product?.category?.description || 'Sin categoría'}
                    </p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#28a745', fontSize: '1.1em' }}>
                      {formatPrice(product?.price || 0)}
                    </p>
                    {product?.stock !== undefined && (
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.85em', color: product.stock > 0 ? '#28a745' : '#dc3545' }}>
                        Stock: {product.stock}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => requestRemove(product?.id)}
                    className="btn btn--small btn--danger"
                    style={{ flexShrink: 0 }}
                  >
                    Remover
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmDelete.show && (
        <div className="confirm-backdrop" role="dialog" aria-modal="true" onClick={cancelRemove}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas remover este producto del carrusel?</p>
            <div className="confirm-actions">
              <button className="btn btn--secondary btn--small" onClick={cancelRemove}>
                Cancelar
              </button>
              <button className="btn btn--danger btn--small" onClick={confirmRemove}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselManagement;

