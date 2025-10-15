import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import "./Cart.css";

const Cart = () => {
  const { 
    cartProducts, 
    loading, 
    error, 
    updateCartProduct, 
    removeFromCart,
    getCartTotals,
    isCartEmpty,
    extendCartExpiration 
  } = useCart();
  
  const { isAuthenticated } = useAuth();

  // Calcular totales del carrito
  const totals = getCartTotals();

  // Función para actualizar cantidad
  const handleUpdateQuantity = async (cartProductId, newQuantity) => {
    const result = await updateCartProduct(cartProductId, newQuantity);
    if (!result.success) {
      alert(result.error);
    }
  };

  // Función para eliminar producto
  const handleRemoveProduct = async (cartProductId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      const result = await removeFromCart(cartProductId);
      if (!result.success) {
        alert(result.error);
      }
    }
  };

  // Función para extender expiración
  const handleExtendExpiration = async () => {
    const result = await extendCartExpiration();
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  // Si el usuario no está autenticado
  if (!isAuthenticated()) {
    return (
      <main className="cart container">
        <div className="cart__auth-required">
          <h1>Inicia sesión para ver tu carrito</h1>
          <p>Necesitas estar logueado para acceder a tu carrito de compras.</p>
          <Link to="/login" className="btn btn--primary">
            Iniciar Sesión
          </Link>
        </div>
      </main>
    );
  }

  // Mostrar estado de carga
  if (loading && isCartEmpty) {
    return (
      <main className="cart container">
        <div className="cart__loading">
          <h1>Cargando carrito...</h1>
        </div>
      </main>
    );
  }

  // Mostrar error si hay alguno
  if (error) {
    return (
      <main className="cart container">
        <div className="cart__error">
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </main>
    );
  }

  // Carrito vacío
  if (isCartEmpty) {
    return (
      <main className="cart container">
        <div className="cart__empty">
          <h1>Tu carrito está vacío</h1>
          <p>Agrega algunos productos para comenzar tu compra.</p>
          <Link to="/productos" className="btn btn--primary">
            Ver Productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart container">
      <div className="cart__header">
        <h1 className="cart__title">Mi Carrito</h1>
        <Link to="/productos" className="cart__continue">
          ← Continuar comprando
        </Link>
      </div>

      <div className="cart__content">
        {/* Lista de productos */}
        <section className="cart__items">
          <div className="cart__items-header">
            <h2>Productos ({cartProducts.length})</h2>
            <button 
              className="extend-btn"
              onClick={handleExtendExpiration}
              title="Extender expiración del carrito"
            >
              ⏰ Extender carrito
            </button>
          </div>
          
          <div className="cart__items-list">
            {cartProducts.map((cartProduct) => (
              <article key={cartProduct.id} className="cart-item">
                <div className="cart-item__image">
                  <img 
                    src={cartProduct.product.images?.[0]?.url || 'https://via.placeholder.com/100x100?text=Sin+Imagen'} 
                    alt={cartProduct.product.name} 
                  />
                </div>
                
                <div className="cart-item__info">
                  <Link to={`/productos/${cartProduct.product.id}`} className="cart-item__name">
                    {cartProduct.product.name}
                  </Link>
                  <p className="cart-item__detail">{cartProduct.product.description || ''}</p>
                  <p className="cart-item__price">${cartProduct.product.price.toFixed(2)}</p>
                  <p className="cart-item__stock">
                    Stock: {cartProduct.product.stock} unidades
                  </p>
                </div>

                <div className="cart-item__quantity">
                  <button 
                    className="quantity-btn" 
                    onClick={() => handleUpdateQuantity(cartProduct.id, cartProduct.quantity - 1)}
                    disabled={cartProduct.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-value">{cartProduct.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleUpdateQuantity(cartProduct.id, cartProduct.quantity + 1)}
                    disabled={cartProduct.quantity >= cartProduct.product.stock}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item__total">
                  <p className="cart-item__total-price">
                    ${(cartProduct.product.price * cartProduct.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="cart-item__actions">
                  <button 
                    className="remove-btn" 
                    title="Eliminar del carrito"
                    onClick={() => handleRemoveProduct(cartProduct.id)}
                  >
                    🗑️
                  </button>
                  <button className="favorite-btn" title="Mover a favoritos">
                    ♡
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Cupón de descuento */}
          <div className="cart__coupon">
            <h3>Aplicar cupón de descuento</h3>
            <div className="coupon-form">
              <input 
                type="text" 
                placeholder="Código de descuento"
                className="coupon-input"
              />
              <button className="coupon-btn">Aplicar</button>
            </div>
          </div>
        </section>

        {/* Resumen del pedido */}
        <aside className="cart__summary">
          <div className="summary-card">
            <h3 className="summary__title">Resumen del pedido</h3>
            
            <div className="summary__line">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary__line">
              <span>Envío</span>
              <span>
                {totals.shipping === 0 ? (
                  <span className="free-shipping">¡Gratis!</span>
                ) : (
                  `$${totals.shipping.toFixed(2)}`
                )}
              </span>
            </div>
            
            <div className="summary__line">
              <span>IVA (21%)</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            
            <div className="summary__line summary__line--total">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>

            <div className="summary__benefits">
              {totals.subtotal < 500 && (
                <p className="benefit">
                  💡 Agrega ${(500 - totals.subtotal).toFixed(2)} más para envío gratis
                </p>
              )}
              <p className="benefit">🚚 Envío en 24-48hs</p>
              <p className="benefit">🔄 Devolución gratuita</p>
              <p className="benefit">📦 {totals.itemCount} producto(s) en el carrito</p>
            </div>

            <button className="checkout-btn">
              Proceder al pago
            </button>

            <div className="payment-methods">
              <p className="payment__title">Métodos de pago aceptados:</p>
              <div className="payment__icons">
                <span>💳</span>
                <span>🏦</span>
                <span>📱</span>
                <span>💰</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Productos relacionados */}
      <section className="cart__related">
        <h3>Productos que te pueden interesar</h3>
        <div className="related-grid">
          <div className="related-item">
            <div className="related-item__image">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsnTsArs0xYlbkqu7Nrr7cwsq9paYWaPfSZfM9TDbnOthiQ5_yL9NfIdQmrIQGgbuEA4pH1FlMVUdX0PzIynw7aFGjdsvoiW9a2YcoMzSCKcXUuVlh01FBdPzoN6qMdJiBsG0D_j_t9jfVaFXEqFJFbQpkPww8qIz7p2k-pC7mewI7qDhayyZD50v1K0LG3mdLrlLUmTIb2dPKqSdVaISCQpvJV_BW36yOBCH1CTcAUaxZD68JRhrlsx5Of3NbkJuYHVdNjJV-_WA" alt="Monitor" />
            </div>
            <div className="related-item__info">
              <p className="related-item__name">ASUS ROG Swift 27"</p>
              <p className="related-item__price">$650.00</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Cart;
