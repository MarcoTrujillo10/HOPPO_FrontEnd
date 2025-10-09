import { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const userData = {
    nombre: "Juan Bautista",
    apellido: "Espino",
    email: "juan@example.com",
    telefono: "+54 11 1234-5678",
    fechaNacimiento: "1995-05-15",
    direccion: {
      calle: "Av. Corrientes 1234",
      ciudad: "Buenos Aires",
      codigoPostal: "1043",
      pais: "Argentina"
    },
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    fechaRegistro: "2024-01-15",
    totalCompras: 5,
    totalGastado: 2840.50
  };

  const orders = [
    {
      id: "ORD-001",
      fecha: "2024-12-15",
      estado: "Entregado",
      total: 1245.00,
      productos: [
        { nombre: "Intel Core i7", cantidad: 1, precio: 350.00 },
        { nombre: "NVIDIA RTX 3080", cantidad: 1, precio: 1200.00 }
      ]
    },
    {
      id: "ORD-002",
      fecha: "2024-11-28",
      estado: "En tránsito",
      total: 895.50,
      productos: [
        { nombre: "Corsair Vengeance 16GB", cantidad: 2, precio: 95.00 },
        { nombre: "Samsung 970 EVO 1TB", cantidad: 1, precio: 150.00 },
        { nombre: "Logitech G Pro", cantidad: 1, precio: 130.00 }
      ]
    }
  ];

  const favorites = [
    {
      id: "fav-1",
      nombre: "ASUS ROG Swift 27\"",
      precio: 650.00,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsnTsArs0xYlbkqu7Nrr7cwsq9paYWaPfSZfM9TDbnOthiQ5_yL9NfIdQmrIQGgbuEA4pH1FlMVUdX0PzIynw7aFGjdsvoiW9a2YcoMzSCKcXUuVlh01FBdPzoN6qMdJiBsG0D_j_t9jfVaFXEqFJFbQpkPww8qIz7p2k-pC7mewI7qDhayyZD50v1K0LG3mdLrlLUmTIb2dPKqSdVaISCQpvJV_BW36yOBCH1CTcAUaxZD68JRhrlsx5Of3NbkJuYHVdNjJV-_WA"
    },
    {
      id: "fav-2",
      nombre: "Razer Viper",
      precio: 80.00,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAB9-3XqvgCJAPM9ivAYfCA5VvWZSF6eXGgfbMlqrQ_PGxqgqwLiuZlcAFiJj-RXcHbtw2y0D1vc_49tFS0izptLZnoz8SiCDNEPAuKDWKx0gI5bvKhWIwz8MEadfnVYn6TlR8kVoly8TtUDOKg0Yd_GFGqr79tWrbVzAv7eEEv50Y9d6-Gf2LRpnD-4TFubIcFE2VIP5MYT-vJXGLpcEiLQEr2qEFescMW8IWZvIH7Aux8DJ98HD4crvlYGPQkXmNhfhDtouCBDlY"
    }
  ];

  const tabs = [
    { id: "profile", label: "Perfil", icon: "👤" },
    { id: "orders", label: "Pedidos", icon: "📦" },
    { id: "favorites", label: "Favoritos", icon: "❤️" },
    { id: "settings", label: "Configuración", icon: "⚙️" }
  ];

  return (
    <main className="profile container">
      <div className="profile__header">
        <div className="profile__avatar">
          <img src={userData.avatar} alt="Avatar" />
          <button className="avatar-edit">✏️</button>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">
            {userData.nombre} {userData.apellido}
          </h1>
          <p className="profile__email">{userData.email}</p>
          <div className="profile__stats">
            <div className="stat">
              <span className="stat__number">{userData.totalCompras}</span>
              <span className="stat__label">Pedidos</span>
            </div>
            <div className="stat">
              <span className="stat__number">${userData.totalGastado.toFixed(2)}</span>
              <span className="stat__label">Total gastado</span>
            </div>
            <div className="stat">
              <span className="stat__number">{favorites.length}</span>
              <span className="stat__label">Favoritos</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile__content">
        <nav className="profile__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab__icon">{tab.icon}</span>
              <span className="tab__label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="profile__panel">
          {activeTab === "profile" && (
            <div className="panel-content">
              <h2 className="panel-title">Información Personal</h2>
              <form className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      defaultValue={userData.nombre}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                      type="text"
                      id="apellido"
                      defaultValue={userData.apellido}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      defaultValue={userData.email}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      defaultValue={userData.telefono}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    defaultValue={userData.fechaNacimiento}
                    className="form-input"
                  />
                </div>

                <div className="form-section">
                  <h3>Dirección</h3>
                  <div className="form-row">
                    <div className="form-group form-group--wide">
                      <label htmlFor="calle">Calle</label>
                      <input
                        type="text"
                        id="calle"
                        defaultValue={userData.direccion.calle}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="ciudad">Ciudad</label>
                      <input
                        type="text"
                        id="ciudad"
                        defaultValue={userData.direccion.ciudad}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="codigoPostal">Código Postal</label>
                      <input
                        type="text"
                        id="codigoPostal"
                        defaultValue={userData.direccion.codigoPostal}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pais">País</label>
                      <input
                        type="text"
                        id="pais"
                        defaultValue={userData.direccion.pais}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary">
                    Guardar cambios
                  </button>
                  <button type="button" className="btn btn--ghost">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="panel-content">
              <h2 className="panel-title">Mis Pedidos</h2>
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3 className="order-id">Pedido #{order.id}</h3>
                        <p className="order-date">
                          {new Date(order.fecha).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge status-${order.estado.toLowerCase().replace(' ', '-')}`}>
                          {order.estado}
                        </span>
                        <span className="order-total">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="order-products">
                      {order.productos.map((product, index) => (
                        <div key={index} className="order-product">
                          <span className="product-quantity">{product.cantidad}x</span>
                          <span className="product-name">{product.nombre}</span>
                          <span className="product-price">${product.precio.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-actions">
                      <button className="btn btn--ghost btn--small">
                        Ver detalles
                      </button>
                      <button className="btn btn--ghost btn--small">
                        Rastrear envío
                      </button>
                      {order.estado === "Entregado" && (
                        <button className="btn btn--ghost btn--small">
                          Comprar de nuevo
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="panel-content">
              <h2 className="panel-title">Mis Favoritos</h2>
              <div className="favorites-grid">
                {favorites.map((item) => (
                  <div key={item.id} className="favorite-item">
                    <div className="favorite-item__image">
                      <img src={item.img} alt={item.nombre} />
                      <button className="favorite-remove" title="Quitar de favoritos">
                        ❤️
                      </button>
                    </div>
                    <div className="favorite-item__info">
                      <h3 className="favorite-item__name">{item.nombre}</h3>
                      <p className="favorite-item__price">${item.precio.toFixed(2)}</p>
                    </div>
                    <div className="favorite-item__actions">
                      <button className="btn btn--primary btn--small">
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="panel-content">
              <h2 className="panel-title">Configuración</h2>
              <div className="settings-sections">
                <div className="settings-section">
                  <h3>Notificaciones</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Ofertas y promociones</h4>
                      <p>Recibe notificaciones sobre ofertas especiales</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Estado del pedido</h4>
                      <p>Notificaciones sobre el estado de tus pedidos</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Newsletter</h4>
                      <p>Recibe nuestro newsletter semanal</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>Privacidad</h3>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Perfil público</h4>
                      <p>Permitir que otros usuarios vean tu perfil</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Compartir datos de uso</h4>
                      <p>Ayúdanos a mejorar compartiendo datos anónimos</p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-section">
                  <h3>Cuenta</h3>
                  <div className="setting-actions">
                    <button className="btn btn--ghost">
                      Cambiar contraseña
                    </button>
                    <button className="btn btn--ghost">
                      Descargar mis datos
                    </button>
                    <button className="btn btn--danger">
                      Eliminar cuenta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;
