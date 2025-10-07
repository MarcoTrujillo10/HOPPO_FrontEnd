import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  // Datos mock del carrito
  const cartItems = [
    {
      id: "cpu-i7",
      nombre: "Intel Core i7",
      detalle: "12C/24T",
      precio: 350,
      cantidad: 1,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeEZ3wJRC_iZRmm61SLDO7Hi9nNZH8JXC79xQghK3aAPKFAla1BuCoEgF5u9KSYQAnDjHh-gD84neVLlw7nMMWa0oOyQHLLoWj3ginyHsAyba8OqVibkfYkqt8MLJBoFUICfeCyD4kFYmUULzHUFKxjQHqe9tdal1DYaiEZ4nTUK61Wp6fsDFeSL_a5O-doU0VUWN6fijTVSN6Zv-6JTBy0GmLzOUp5TyXFK6GVPzbuUsj8oR_2cBz50PDnE_ex-kGcPRG5Ad2r-4"
    },
    {
      id: "gpu-3080",
      nombre: "NVIDIA RTX 3080",
      detalle: "10 GB GDDR6X",
      precio: 1200,
      cantidad: 1,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3WJvAue9tfr-7SvXGxS5UadyO2OGS21_qDzIY-w_NKQkCDS46H7JrkLa1fmVVHYcXSB3A5SYgNcf2Y9h7hMnlJzYKi8h8RQuMQ5Bmt2NLL4bUrNR4HNK804Agij6KzPhlrT0xE6X8HDN6BFRmHORKpki6uymsi6a8T29f_OUUfrwVgWjJqOjjoubpI5qJsO7JwrnUZtNvMr-VTmhwXx2TAJC17cNqTNCm9SnTLbnVE7swMulVPoEkmnlmtPtSmxNidAEIMvlZgk"
    },
    {
      id: "ram-ven",
      nombre: "Corsair Vengeance 16GB",
      detalle: "DDR4 3200",
      precio: 95,
      cantidad: 2,
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJabHAOWCQEFvtaG0SrkKL6k0ub2C2PCBfGWXiHSPSpjrA8BlPmxidgsCfpmQtAwt_lAa7Gc-W7pmZS_lTWgcoZBFlZWDVOYTQ5msC539UfRdKtF9prGEWvEO1Ev-zyXUclIj66eqf2rToXoIXP3z7SbuQD0QK7Qs6fgjCabbOGOOjuVnKYlta5Dvtv4wUYbYQyEJm2KSbPYisUJyd8jpMxufPmXWT8zcmKeiTrKRL-lYjmYmSz_1SMeFx8CFQY8MyfrUgtQ4Q2p4"
    }
  ];

  // Cálculos del carrito
  const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.21; // 21% IVA
  const total = subtotal + shipping + tax;

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
            <h2>Productos ({cartItems.length})</h2>
          </div>
          
          <div className="cart__items-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-item">
                <div className="cart-item__image">
                  <img src={item.img} alt={item.nombre} />
                </div>
                
                <div className="cart-item__info">
                  <Link to={`/productos/${item.id}`} className="cart-item__name">
                    {item.nombre}
                  </Link>
                  <p className="cart-item__detail">{item.detalle}</p>
                  <p className="cart-item__price">${item.precio.toFixed(2)}</p>
                </div>

                <div className="cart-item__quantity">
                  <button className="quantity-btn" disabled>-</button>
                  <span className="quantity-value">{item.cantidad}</span>
                  <button className="quantity-btn">+</button>
                </div>

                <div className="cart-item__total">
                  <p className="cart-item__total-price">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </p>
                </div>

                <div className="cart-item__actions">
                  <button className="remove-btn" title="Eliminar del carrito">
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
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary__line">
              <span>Envío</span>
              <span>
                {shipping === 0 ? (
                  <span className="free-shipping">¡Gratis!</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            
            <div className="summary__line">
              <span>IVA (21%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary__line summary__line--total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="summary__benefits">
              {subtotal < 500 && (
                <p className="benefit">
                  💡 Agrega ${(500 - subtotal).toFixed(2)} más para envío gratis
                </p>
              )}
              <p className="benefit">🚚 Envío en 24-48hs</p>
              <p className="benefit">🔄 Devolución gratuita</p>
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
