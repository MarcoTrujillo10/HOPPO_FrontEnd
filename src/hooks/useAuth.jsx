import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const loadUserProfile = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (savedToken) {
        setToken(savedToken);
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
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
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const { access_token: newToken, user: userFromBackend } = response.data;
      const userData = {
        id: userFromBackend.id,
        email: userFromBackend.email,
        username: userFromBackend.username,
        firstName: userFromBackend.name,
        lastName: userFromBackend.lastName,
        role: userFromBackend.role
      };
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
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
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.data.access_token) {
        const { access_token: newToken, user: userFromBackend } = response.data;
        
        const newUserData = {
          id: userFromBackend.id,
          email: userFromBackend.email,
          username: userFromBackend.username,
          firstName: userFromBackend.name,
          lastName: userFromBackend.lastName,
          role: userFromBackend.role
        };
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUserData));
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
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };
  const isAuthenticated = () => {
    return !!(token && user);
  };
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
