import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAdminOrders,
  updateOrderStatus,
  toggleOrderDetails,
  selectAdminOrders,
  selectAdminOrdersLoading,
  selectExpandedOrderId,
} from '../../redux/ordersSlice';
import { useToast } from '../../contexts/ToastContext.jsx';
import './AdminComponents.css';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  
  // Selectores de Redux
  const orders = useSelector(selectAdminOrders);
  const loading = useSelector(selectAdminOrdersLoading);
  const expandedOrderId = useSelector(selectExpandedOrderId);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      showToast('Estado de orden actualizado exitosamente', 'success');
    } catch (error) {
      console.error('Error updating order:', error);
      showToast('Error al actualizar la orden', 'error');
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAdminOrders());
  };

  const handleToggleDetails = (orderId) => {
    dispatch(toggleOrderDetails(orderId));
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

  if (loading && orders.length === 0) {
    return <div className="loading">Cargando órdenes...</div>;
  }

  return (
    <div className="order-management">
      <div className="section-header">
        <h2>📋 Gestión de Órdenes</h2>
        <button 
          className="btn btn-secondary"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? '⏳ Cargando...' : '🔄 Actualizar'}
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
                        onClick={() => handleToggleDetails(order.id)}
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
                  <tr key={`${order.id}-details`}>
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

      {orders.length === 0 && !loading && (
        <div className="empty-state">
          <p>No hay órdenes registradas.</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
