import { useAuth } from '../hooks/useAuth.jsx';
import { useCart } from '../hooks/useCart.jsx';
const TestPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartProducts, getCartTotals } = useCart();
  const cartTotals = getCartTotals();
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Página de Prueba - HOPPO</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Estado de Autenticación:</h2>
        <p><strong>Autenticado:</strong> {isAuthenticated() ? '✅ Sí' : '❌ No'}</p>
        {user && (
          <div>
            <p><strong>Usuario:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
          </div>
        )}
      </div>
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Estado del Carrito:</h2>
        <p><strong>Productos en carrito:</strong> {cartProducts.length}</p>
        <p><strong>Total de items:</strong> {cartTotals.itemCount}</p>
        <p><strong>Subtotal:</strong> ${cartTotals.subtotal}</p>
        <p><strong>Total:</strong> ${cartTotals.total}</p>
      </div>
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Enlaces de Prueba:</h2>
        <ul>
          <li><a href="/">🏠 Inicio</a></li>
          <li><a href="/productos">🛍️ Productos</a></li>
          <li><a href="/cart">🛒 Carrito</a></li>
          <li><a href="/login">🔐 Login</a></li>
          <li><a href="/register">📝 Registro</a></li>
        </ul>
      </div>
      <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <h2>🔧 Información Técnica:</h2>
        <p><strong>Frontend:</strong> React + Vite (Puerto 5174)</p>
        <p><strong>Backend:</strong> Spring Boot (Puerto 8081)</p>
        <p><strong>Base de datos:</strong> MySQL (HOPPO)</p>
        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};
export default TestPage;
