<<<<<<< HEAD
import { Link } from "react-router-dom";
import "./Login.css";
import hoppoLogo from "../assets/image.png"; 


const Login = () =>{
  return (
    <main className="login">
      <div className="login__card">
        <header className="login__header">
          <Link className="brand" to="/">
                      <img
                        src={hoppoLogo}
                        alt="HOPPO logo"
                        className="brand__icon"
                        width={32}
                        height={32}
                        loading="eager"
                        decoding="async"
                      />
                      <h2 className="brand__text">HOPPO</h2>
                    </Link>

          <nav className="login__nav">
            <Link to="/">Inicio</Link>
            <Link to="/productos">Productos</Link>
            <Link to="/ofertas">Ofertas</Link>
            <Link to="/soporte">Soporte</Link>
          </nav>
        </header>

        <section className="login__body">
          <h2>Bienvenido a HOPPO</h2>
          <p className="login__subtitle">
            Inicia sesión para continuar o{" "}
            <Link to="/register" className="login__link">registrate</Link>
          </p>

          <form className="login__form" onSubmit={(e)=>{ e.preventDefault();}}>
            <label className="sr-only" htmlFor="email">Correo electrónico</label>
            <input id="email" name="email" type="email" placeholder="Correo electrónico" required />

            <label className="sr-only" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" placeholder="Contraseña" required />

            <div className="login__actions">
              <Link to="/forgot-password" className="login__link">¿Olvidaste tu contraseña?</Link>
            </div>

            <button type="submit" className="btn-primary">Iniciar sesión</button>
          </form>
        </section>
=======
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import './Auth.css';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
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
    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        navigate('/'); // Redirigir al home después del login exitoso
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Iniciar Sesión</h1>
          
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
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
              />
            </div>
            <button 
              type="submit" 
              className="btn btn--primary auth-submit"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
          <div className="auth-links">
            <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
          </div>
        </div>
>>>>>>> origin/Bauti
      </div>
    </main>
  );
};
<<<<<<< HEAD

=======
>>>>>>> origin/Bauti
export default Login;
