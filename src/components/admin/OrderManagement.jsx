import { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import './AdminComponents.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.data || []);
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
      alert('Estado de orden actualizado exitosamente');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar la orden');
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
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <div className="order-actions">
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
