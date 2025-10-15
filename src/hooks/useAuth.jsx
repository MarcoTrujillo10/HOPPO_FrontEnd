import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/api';

// Crear contexto de autenticación
const AuthContext = createContext();

// Hook para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const loadUserProfile = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken) {
        setToken(savedToken);
        
        // Si hay usuario guardado, usarlo temporalmente
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        
        // Intentar cargar el perfil actualizado desde el servidor
        try {
          const response = await authService.getProfile();
          const userFromBackend = response.data;
          
          const userData = {
            id: userFromBackend.id,
            email: userFromBackend.email,
            username: userFromBackend.username,
            firstName: userFromBackend.name,
            lastName: userFromBackend.lastName,
            role: userFromBackend.role
          };
          
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error cargando perfil:', error);
          // Si falla, limpiar datos inválidos
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const { access_token: newToken, user: userFromBackend } = response.data;

      // Usar la información del usuario que viene del backend
      const userData = {
        id: userFromBackend.id,
        email: userFromBackend.email,
        username: userFromBackend.username,
        firstName: userFromBackend.name,
        lastName: userFromBackend.lastName,
        role: userFromBackend.role
      };

      // Guardar en localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Actualizar estado
      setToken(newToken);
      setUser(userData);

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al iniciar sesión'
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar usuario
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      // El registro también devuelve un token y la info del usuario
      if (response.data.access_token) {
        const { access_token: newToken, user: userFromBackend } = response.data;
        
        // Usar la información del usuario que viene del backend
        const newUserData = {
          id: userFromBackend.id,
          email: userFromBackend.email,
          username: userFromBackend.username,
          firstName: userFromBackend.name,
          lastName: userFromBackend.lastName,
          role: userFromBackend.role
        };

        // Guardar en localStorage
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUserData));

        // Actualizar estado
        setToken(newToken);
        setUser(newUserData);
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al registrar usuario'
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Limpiar estado
    setToken(null);
    setUser(null);

    // Opcional: redirigir al login
    window.location.href = '/';
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!(token && user);
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
