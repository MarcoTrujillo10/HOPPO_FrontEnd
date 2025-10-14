import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import hoppoLogo from "../assets/image.png";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // estado controlado para poder enviar el form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login({ email, password });  
      navigate("/home");                
    } catch (err) {
      alert("No se pudo iniciar sesión.");
    }
  }

  return (
    <main className="login">
      <div className="login__card">
        <header className="login__header">
          <Link className="brand" to="/login">
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

          <div className="login__nav">
            <Link to="/productos" className="login__link">
              Entrar sin iniciar sesión
            </Link>
          </div>
        </header>

        <section className="login__body">
          <h2>Bienvenido a HOPPO</h2>
          <p className="login__subtitle">
            Inicia sesión para continuar o{" "}
            <Link to="/registro" className="login__link">registrate</Link>
          </p>

          <form className="login__form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

            <label className="sr-only" htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <div className="login__actions">
              <Link to="/contraseña-olvidada" className="login__link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="btn-primary">Iniciar sesión</button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
