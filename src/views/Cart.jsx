import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  } = useCart();
 
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
 
  const [status, setStatus] = useState({ type: "", message: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
 
  const totals = getCartTotals();
 
  const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value || 0);
 
  const handleUpdateQuantity = async (cartProductId, newQuantity) => {
    const result = await updateCartProduct(cartProductId, newQuantity);
    if (!result.success) {
      setStatus({ type: "error", message: result.error || "No se pudo actualizar la cantidad" });
    } else {
      setStatus({ type: "success", message: "Cantidad actualizada" });
    }
  };
 
  const requestRemoveProduct = (cartProductId) => {
    setPendingDeleteId(cartProductId);
    setConfirmOpen(true);
  };
 
  const confirmRemoveProduct = async () => {
    if (!pendingDeleteId) return;
    const result = await removeFromCart(pendingDeleteId);
    if (!result.success) {
      setStatus({ type: "error", message: result.error || "No se pudo eliminar el producto" });
    } else {
      setStatus({ type: "success", message: "Producto eliminado del carrito" });
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };
 
  const cancelRemoveProduct = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };
 
 
  const handleCheckout = () => {
    if (!isAuthenticated()) {
      setStatus({ type: "error", message: "Debes iniciar sesión para proceder al checkout" });
      navigate("/login");
      return;
    }
    if (isCartEmpty()) {
      setStatus({ type: "error", message: "Tu carrito está vacío" });
      return;
    }
    navigate("/checkout");
  };
 
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
 
  if (loading && isCartEmpty()) {
    return (
      <main className="cart container">
        <div className="cart__loading">
          <h1>Cargando carrito...</h1>
        </div>
      </main>
    );
  }
 
  if (error) {
    return (
      <main className="cart container">
        <div className="cart__error">
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </main>
    );
  }
 
  if (isCartEmpty()) {
    return (
      <main className="cart container">
        <div className="cart__empty">
          <div className="cart__empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1" fill="currentColor"/>
              <circle cx="20" cy="21" r="1" fill="currentColor"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="cart__empty-title">Tu carrito está vacío</h1>
          <p className="cart__empty-message">
            Parece que aún no has agregado ningún producto a tu carrito.
            <br />
            ¡Explora nuestra tienda y encuentra los mejores productos!
          </p>
          <div className="cart__empty-actions">
            <Link to="/productos" className="btn btn--primary cart__empty-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Explorar Productos
            </Link>
            <Link to="/" className="btn btn--ghost cart__empty-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Volver al Inicio
            </Link>
          </div>
          <div className="cart__empty-features">
            <div className="cart__empty-feature">
              <span className="cart__empty-feature-icon">🚚</span>
              <span>Envío gratis en compras mayores a $500</span>
            </div>
            <div className="cart__empty-feature">
              <span className="cart__empty-feature-icon">🔄</span>
              <span>Devolución gratuita</span>
            </div>
            <div className="cart__empty-feature">
              <span className="cart__empty-feature-icon">💳</span>
              <span>Múltiples métodos de pago</span>
            </div>
          </div>
        </div>
      </main>
    );
  }
 
  return (
    <main className="cart container">
      {status.message && (
        <div className={`status-banner ${status.type}`}>{status.message}</div>
      )}
 
      <div className="cart__header">
        <h1 className="cart__title">Mi Carrito</h1>
        <Link to="/productos" className="cart__continue">
          ← Continuar comprando
        </Link>
      </div>
 
      <div className="cart__content">
        <section className="cart__items">
          <div className="cart__items-header">
            <h2>Productos ({cartProducts.length})</h2>
          </div>
 
          <div className="cart__items-list">
            {cartProducts.map((cartProduct) => {
              const product = cartProduct.product || {};
              const image =
                product.images?.[0]?.imageUrl ||
                product.images?.[0]?.url ||
                "https://via.placeholder.com/100x100?text=Sin+Imagen";
              const hasDiscount = product.hasDiscount;
              const discountPercent = product.discount || 0;
              const originalPrice = product.price || 0;
              const discountedPrice =
                product.discountedPrice !== undefined
                  ? product.discountedPrice
                  : originalPrice;
              const unitPrice = hasDiscount ? discountedPrice : originalPrice;
              const originalTotal = originalPrice * cartProduct.quantity;
              const discountedTotal = unitPrice * cartProduct.quantity;
              const totalSavings = hasDiscount ? originalTotal - discountedTotal : 0;

              return (
              <article key={cartProduct.id} className="cart-item">
                <div className="cart-item__image">
                    <img src={image} alt={product.name} />
                </div>
 
                <div className="cart-item__info">
                  <Link
                      to={`/productos/${product.id}`}
                    className="cart-item__name"
                  >
                      {product.name}
                  </Link>
                    <p className="cart-item__detail">{product.description || ""}</p>

                    <div className="cart-item__pricing">
                      {hasDiscount && (
                        <span className="cart-item__discount-badge">
                          -{discountPercent}% OFF
                        </span>
                      )}
                      <div className="cart-item__price-group">
                        {hasDiscount && (
                          <span className="cart-item__price-original">
                            {formatCurrency(originalPrice)}
                          </span>
                        )}
                        <span className="cart-item__price-current">
                          {formatCurrency(unitPrice)}
                        </span>
                      </div>
                    </div>

                  <p className="cart-item__stock">
                      Stock: {product.stock} unidades
                  </p>
                </div>
 
                <div className="cart-item__quantity">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleUpdateQuantity(cartProduct.id, cartProduct.quantity - 1)
                    }
                    disabled={cartProduct.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-value">{cartProduct.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      handleUpdateQuantity(cartProduct.id, cartProduct.quantity + 1)
                    }
                      disabled={cartProduct.quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
 
                <div className="cart-item__total">
                    {hasDiscount && (
                      <span className="cart-item__total-original">
                        {formatCurrency(originalTotal)}
                      </span>
                    )}
                  <p className="cart-item__total-price">
                      {formatCurrency(discountedTotal)}
                  </p>
                    {hasDiscount && (
                      <span className="cart-item__total-savings">
                        Ahorras {formatCurrency(totalSavings)}
                      </span>
                    )}
                </div>
 
                <div className="cart-item__actions">
                  <button
                    className="remove-btn"
                    title="Eliminar del carrito"
                    onClick={() => requestRemoveProduct(cartProduct.id)}
                  >
                    🗑️
                  </button>
                </div>
              </article>
              );
            })}
          </div>
 
          <div className="cart__coupon">
            <h3>Aplicar cupón de descuento</h3>
            <div className="coupon-form">
              <input type="text" placeholder="Código de descuento" className="coupon-input" />
              <button className="coupon-btn">Aplicar</button>
            </div>
          </div>
        </section>
 
        <aside className="cart__summary">
          <div className="summary-card">
            <h3 className="summary__title">Resumen del pedido</h3>
 
            <div className= "summary__line">
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
 
            <button className="checkout-btn" onClick={handleCheckout}>
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
 
 
      {confirmOpen && (
        <div className="confirm-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-box">
            <p>¿Estás seguro de que quieres eliminar este producto del carrito?</p>
            <div className="confirm-actions">
              <button className="btn btn-danger btn-small" onClick={confirmRemoveProduct}>
                Eliminar
              </button>
              <button className="btn btn-secondary btn-small" onClick={cancelRemoveProduct}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
 
export default Cart;