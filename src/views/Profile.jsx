import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCart } from '../hooks/useCart.jsx';
import {
  fetchUserOrders,
  toggleOrderDetails,
  selectUserOrders,
  selectUserOrdersLoading,
  selectExpandedOrderId,
  selectUserOrdersStats,
} from '../redux/ordersSlice';
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { getCartTotals } = useCart();
  
  // Selectores de Redux para órdenes
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const expandedOrderId = useSelector(selectExpandedOrderId);
  const orderStats = useSelector(selectUserOrdersStats);

  // Manejar cartTotals de forma segura
  let cartTotals;
  try {
    cartTotals = getCartTotals();
  } catch (error) {
    console.error('Error getting cart totals:', error);
    cartTotals = {
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
      itemCount: 0
    };
  }

  useEffect(() => {
    if (isAuthenticated()) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isAuthenticated]);

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

  if (!isAuthenticated()) {
    return (
      <main className="profile container">
        <div className="profile__not-authenticated">
          <h1>🔒 Acceso Requerido</h1>
          <p>Debes iniciar sesión para ver tu perfil.</p>
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
          {user?.role !== 'VENDEDOR' && (
            <div className="profile__stats">
              <div className="stat">
                <span className="stat__number">{orderStats.totalOrders}</span>
                <span className="stat__label">Pedidos</span>
              </div>
              <div className="stat">
                <span className="stat__number">
                  {formatPrice(orderStats.totalSpent)}
                </span>
                <span className="stat__label">Total gastado</span>
              </div>
              <div className="stat">
                <span className="stat__number">{cartTotals.itemCount}</span>
                <span className="stat__label">En carrito</span>
              </div>
            </div>
          )}
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

              {user?.role !== 'VENDEDOR' && (
                <>
                  <div className="info-section">
                    <h3>🛒 Carrito Actual</h3>
                    {cartTotals.itemCount > 0 ? (
                      <div className="cart-summary">
                        <p><strong>Items:</strong> {cartTotals.itemCount}</p>
                        <p><strong>Subtotal:</strong> {formatPrice(cartTotals.subtotal)}</p>
                        <p><strong>Total:</strong> {formatPrice(cartTotals.total)}</p>
                        <a href="/cart" className="btn btn--ghost">Ver Carrito</a>
                      </div>
                    ) : (
                      <p>Tu carrito está vacío.</p>
                    )}
                  </div>

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
                                {getStatusBadge(order.status)}
                                <span className="order-total">{formatPrice(order.total)}</span>
                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() => handleToggleDetails(order.id)}
                                  style={{ marginLeft: '8px', fontSize: '0.85rem', padding: '4px 8px' }}
                                >
                                  {expandedOrderId === order.id ? '▼' : '▶'} Detalles
                                </button>
                              </div>
                            </div>
                            {expandedOrderId === order.id && order.items && order.items.length > 0 && (
                              <div className="order-details">
                                <h4 style={{ margin: '16px 0 12px 0', fontSize: '1rem', color: '#1f2937' }}>
                                  📦 Artículos del Pedido
                                </h4>
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
                            )}
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

                  <div className="info-section">
                    <h3>📊 Mis Estadísticas</h3>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                          <span className="stat-number">{orderStats.totalOrders}</span>
                          <span className="stat-label">Órdenes Realizadas</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                          <span className="stat-number">
                            {formatPrice(orderStats.totalSpent)}
                          </span>
                          <span className="stat-label">Total Gastado</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">🛒</div>
                        <div className="stat-info">
                          <span className="stat-number">{cartTotals.itemCount}</span>
                          <span className="stat-label">Items en Carrito</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
