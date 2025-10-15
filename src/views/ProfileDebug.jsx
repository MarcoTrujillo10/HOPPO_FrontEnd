import { useAuth } from '../hooks/useAuth.jsx';

const ProfileDebug = () => {
  const { user, token, isAuthenticated, loading } = useAuth();

  console.log('ProfileDebug - Estado:', {
    user,
    token: token ? 'Presente' : 'No presente',
    isAuthenticated: isAuthenticated(),
    loading
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Profile Debug</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Estado de Autenticación:</h2>
        <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
        <p><strong>isAuthenticated():</strong> {isAuthenticated() ? 'Sí' : 'No'}</p>
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
        <h2>Resultado de isAuthenticated():</h2>
        <div style={{ 
          padding: '10px', 
          borderRadius: '5px',
          backgroundColor: isAuthenticated() ? '#d4edda' : '#f8d7da',
          border: `1px solid ${isAuthenticated() ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {isAuthenticated() ? '✅ Usuario autenticado' : '❌ Usuario NO autenticado'}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Renderizado del Perfil:</h2>
        {!isAuthenticated() ? (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '5px'
          }}>
            <h3>🔒 Acceso Requerido</h3>
            <p>Debes iniciar sesión para ver tu perfil.</p>
          </div>
        ) : (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#d4edda', 
            border: '1px solid #c3e6cb',
            borderRadius: '5px'
          }}>
            <h3>✅ Perfil Accesible</h3>
            <p>Bienvenido, {user?.firstName} {user?.lastName}!</p>
            <p>Email: {user?.email}</p>
            <p>Rol: {user?.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDebug;
