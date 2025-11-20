import { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext.jsx';
import './AdminComponents.css';
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { showToast } = useToast();
  useEffect(() => {
    loadOrders();
  }, []);
  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log('🛒 OrderManagement: Cargando órdenes...');
      const response = await orderService.getOrders();
      console.log('🛒 OrderManagement: Respuesta del backend:', response);
      // El backend devuelve una respuesta paginada con content
      const orders = response.data?.content || response.data || [];
      console.log('🛒 OrderManagement: Órdenes extraídas:', orders);
      setOrders(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrder(orderId, { status: newStatus });
      await loadOrders();
      showToast('Estado de orden actualizado exitosamente', 'success');
    } catch (error) {
      console.error('Error updating order:', error);
      showToast('Error al actualizar la orden', 'error');
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };
  const getStatusBadge = (status) => {
    const statusConfig = {
      'CREATED': { text: 'Creada', class: 'status-created' },
      'COMPLETED': { text: 'Completada', class: 'status-completed' },
      'CANCELLED': { text: 'Cancelada', class: 'status-cancelled' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'status-default' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  if (loading) {
    return <div className="loading">Cargando órdenes...</div>;
  }
  return (
    <div className="order-management">
      <div className="section-header">
        <h2>📋 Gestión de Órdenes</h2>
        <button 
          className="btn btn-secondary"
          onClick={loadOrders}
        >
          🔄 Actualizar
        </button>
      </div>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <>
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.user?.name} {order.user?.lastName}</strong>
                      <small>{order.user?.email}</small>
                    </div>
                  </td>
                  <td>{formatPrice(order.total)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{formatDate(order.orderDate || order.createdAt)}</td>
                  <td>
                    <div className="order-actions">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => toggleOrderDetails(order.id)}
                        title="Ver detalles"
                      >
                        {expandedOrderId === order.id ? '▼' : '▶'} Detalles
                      </button>
                      {order.status === 'CREATED' && (
                        <>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                          >
                            ✅ Completar
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                          >
                            ❌ Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedOrderId === order.id && order.items && order.items.length > 0 && (
                  <tr>
                    <td colSpan="6" className="order-details-cell">
                      <div className="order-details">
                        <h4>📦 Artículos de la Orden</h4>
                        <div className="order-items-list">
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item-card">
                              <div className="order-item-info">
                                <strong>{item.productName || 'Producto'}</strong>
                                <div className="order-item-details">
                                  <span>Cantidad: {item.quantity}</span>
                                  <span>Precio unitario: {formatPrice(item.price)}</span>
                                  <span>Subtotal: {formatPrice(item.price * item.quantity)}</span>
                                  {item.discount > 0 && (
                                    <span className="discount-badge">Descuento: {item.discount}%</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="order-summary">
                          <div className="order-summary-line">
                            <span>Dirección de envío:</span>
                            <span>{order.address}</span>
                          </div>
                          <div className="order-summary-line">
                            <span>Método de envío:</span>
                            <span>{order.shipping}</span>
                          </div>
                          <div className="order-summary-line order-total">
                            <span>Total:</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <div className="empty-state">
          <p>No hay órdenes registradas.</p>
        </div>
      )}
    </div>
  );
};
export default OrderManagement;
