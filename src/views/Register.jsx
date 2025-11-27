<<<<<<< HEAD
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <main className="register">
      <section className="register__wrap">
        <header className="register__head">
          <h1>Crea tu cuenta en HOPPO</h1>
          <p>Y empieza a construir la PC de tus sueños.</p>
        </header>

        <form className="register__form" onSubmit={handleSubmit}>
          <div className="grid2">
            <div className="field">
              <label htmlFor="firstName">Nombre</label>
              <input id="firstName" name="firstName" type="text" placeholder="Ingresa tu nombre" required />
            </div>
            <div className="field">
              <label htmlFor="lastName">Apellido</label>
              <input id="lastName" name="lastName" type="text" placeholder="Ingresa tu apellido" required />
            </div>
          </div>

          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email" placeholder="Ingresa tu correo" autoComplete="email" required />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" placeholder="Crea una contraseña" autoComplete="new-password" required />
          </div>

          <button type="submit" className="btn-primary">Registrarse</button>

          <p className="register__legal">
            Al registrarte, aceptas nuestros <a href="#">Términos de Servicio</a> y <a href="#">Política de Privacidad</a>.
          </p>

          <p className="register__swap">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

=======
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import './Auth.css';
const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar error al escribir
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    try {
      const result = await register({
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'COMPRADOR'
      });
      
      if (result.success) {
        showToast('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al registrarse');
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Crear Cuenta</h1>
          
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                minLength="6"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn--primary auth-submit"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
          <div className="auth-links">
            <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
};
>>>>>>> origin/Bauti
export default Register;
