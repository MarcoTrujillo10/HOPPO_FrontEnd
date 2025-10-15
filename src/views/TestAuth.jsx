import { useAuth } from '../hooks/useAuth.jsx';

const TestAuth = () => {
  const { user, token, isAuthenticated, loading } = useAuth();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Estado de Autenticación</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Estado:</h2>
        <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
        <p><strong>Autenticado:</strong> {isAuthenticated() ? 'Sí' : 'No'}</p>
        <p><strong>Token:</strong> {token ? 'Presente' : 'No presente'}</p>
        <p><strong>Usuario:</strong> {user ? 'Presente' : 'No presente'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Datos del Usuario:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Token:</h2>
        <p style={{ wordBreak: 'break-all' }}>{token || 'No hay token'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>LocalStorage:</h2>
        <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Presente' : 'No presente'}</p>
        <p><strong>User:</strong> {localStorage.getItem('user') ? 'Presente' : 'No presente'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Datos del LocalStorage:</h2>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
          {JSON.stringify({
            token: localStorage.getItem('token'),
            user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestAuth;
