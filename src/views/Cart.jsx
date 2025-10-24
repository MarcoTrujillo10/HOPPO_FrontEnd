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
            {cartProducts.map((cartProduct) => (
              <article key={cartProduct.id} className="cart-item">
                <div className="cart-item__image">
                  <img
                    src={
                      cartProduct.product.images?.[0]?.url ||
                      cartProduct.product.images?.[0]?.imageUrl ||
                      "https://via.placeholder.com/100x100?text=Sin+Imagen"
                    }
                    alt={cartProduct.product.name}
                  />
                </div>
 
                <div className="cart-item__info">
                  <Link
                    to={`/productos/${cartProduct.product.id}`}
                    className="cart-item__name"
                  >
                    {cartProduct.product.name}
                  </Link>
                  <p className="cart-item__detail">{cartProduct.product.description || ""}</p>
                  <p className="cart-item__price">
                    ${cartProduct.product.price.toFixed(2)}
                  </p>
                  <p className="cart-item__stock">
                    Stock: {cartProduct.product.stock} unidades
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
                    onClick={() => requestRemoveProduct(cartProduct.id)}
                  >
                    🗑️
                  </button>
                </div>
              </article>
            ))}
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