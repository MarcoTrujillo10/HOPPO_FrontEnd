import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { orderService } from '../services/api';
import "./Profile.css";

const ProfileMinimal = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      loadUserOrders();
    }
  }, [user, isAuthenticated]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      // El backend retorna {content: [], pageable: {...}}, necesitamos extraer content
      const ordersData = response.data?.content || response.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
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

  console.log('ProfileMinimal rendering:', {
    isAuthenticated: isAuthenticated(),
    user,
    loading,
    ordersCount: orders.length
  });

  if (!isAuthenticated()) {
    return (
      <main className="profile container">
        <div className="profile__not-authenticated">
          <h1>🔒 Acceso Requerido</h1>
          <p>Debes iniciar sesión para ver tu perfil.</p>
          <p>Estado: {isAuthenticated() ? 'Autenticado' : 'No autenticado'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile container">
      <div className="profile__header">
        <div className="profile__avatar">
          <div className="avatar-placeholder">
            {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="profile__email">{user?.email}</p>
          <p className="profile__username">@{user?.username}</p>
          <div className="profile__stats">
            <div className="stat">
              <span className="stat__number">{orders.length}</span>
              <span className="stat__label">Pedidos</span>
            </div>
            <div className="stat">
              <span className="stat__number">
                {formatPrice(orders.reduce((total, order) => total + (order.total || 0), 0))}
              </span>
              <span className="stat__label">Total gastado</span>
            </div>
            <div className="stat">
              <span className="stat__number">0</span>
              <span className="stat__label">En carrito</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile__content">
        <div className="profile__panel">
          <div className="panel-content">
            <h2 className="panel-title">Información Personal</h2>
            <div className="profile-info-display">
              <div className="info-section">
                <h3>👤 Datos Personales</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nombre:</label>
                    <span>{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div className="info-item">
                    <label>Username:</label>
                    <span>@{user?.username}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Rol:</label>
                    <span className="role-badge">{user?.role}</span>
                  </div>
                </div>
              </div>

              {user?.role === 'VENDEDOR' && (
                <div className="info-section">
                  <h3>🛠️ Acceso de Vendedor</h3>
                  <p>Como vendedor, tienes acceso a funciones administrativas especiales.</p>
                  <a href="/admin" className="btn btn--primary">
                    Ir al Panel de Admin
                  </a>
                </div>
              )}

              <div className="info-section">
                <h3>📦 Mis Pedidos</h3>
                {loading ? (
                  <p>Cargando órdenes...</p>
                ) : orders.length > 0 ? (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h3 className="order-id">Pedido #{order.id}</h3>
                            <p className="order-date">
                              {formatDate(order.orderDate || order.createdAt)}
                            </p>
                          </div>
                          <div className="order-status">
                            <span className="order-total">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No tienes órdenes registradas.</p>
                    <a href="/productos" className="btn btn--primary">Ver Productos</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileMinimal;
