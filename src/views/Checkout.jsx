import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.jsx';
import PaymentForm from '../components/PaymentForm.jsx';
import './Checkout.css';
const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const handlePaymentSuccess = (paymentResult) => {
    console.log('Pago exitoso:', paymentResult);
    
    // El carrito ya se limpia automáticamente en el backend
    // Solo necesitamos recargar el carrito para reflejar los cambios
    window.location.reload();
    
    // Mostrar mensaje de éxito
    alert(`¡Pago procesado exitosamente!
    
ID de Transacción: ${paymentResult.transactionId}
ID de Orden: ${paymentResult.orderId}
Monto: $${paymentResult.amount.toFixed(2)}
Gracias por tu compra!`);
    
    // Redirigir a la página principal
    navigate('/');
  };
  const handlePaymentCancel = () => {
    navigate('/cart');
  };
  if (!cart || cart.items.length === 0) {
    return (
      <main className="checkout">
        <div className="checkout__empty">
          <h1>No hay productos en tu carrito</h1>
          <p>Agrega algunos productos antes de proceder al checkout.</p>
          <button 
            className="btn btn--primary"
            onClick={() => navigate('/productos')}
          >
            Ver Productos
          </button>
        </div>
      </main>
    );
  }
  return (
    <main className="checkout">
      <div className="checkout__container">
        <h1 className="checkout__title">Checkout</h1>
        
        <div className="checkout__grid">
          {/* Resumen del carrito */}
          <div className="checkout__summary">
            <h2>Resumen de la Orden</h2>
            
            <div className="checkout__items">
              {cart.items.map((item) => (
                <div key={item.id} className="checkout__item">
                  <div className="checkout__item-info">
                    <h3>{item.product.name}</h3>
                    <p className="checkout__item-details">
                      {item.product.category?.description} · {item.product.brand?.name}
                    </p>
                  </div>
                  
                  <div className="checkout__item-quantity">
                    Cantidad: {item.quantity}
                  </div>
                  
                  <div className="checkout__item-pricing">
                    {item.hasDiscount && (
                      <div className="checkout__item-original-price">
                        ${item.originalTotalPrice.toFixed(2)}
                      </div>
                    )}
                    <div className="checkout__item-price">
                      ${item.totalPrice.toFixed(2)}
                    </div>
                    {item.hasDiscount && (
                      <div className="checkout__item-discount">
                        Ahorras: ${item.totalDiscount.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="checkout__totals">
              <div className="checkout__total-line">
                <span>Subtotal:</span>
                <span>${cart.originalTotalPrice.toFixed(2)}</span>
              </div>
              
              {cart.totalDiscount > 0 && (
                <div className="checkout__total-line checkout__discount">
                  <span>Descuento:</span>
                  <span>-${cart.totalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="checkout__total-line checkout__shipping">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              
              <div className="checkout__total-line checkout__final-total">
                <span>Total:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {/* Formulario de pago */}
          <div className="checkout__payment">
            <PaymentForm
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={handlePaymentCancel}
            />
          </div>
        </div>
      </div>
    </main>
  );
};
export default Checkout;
