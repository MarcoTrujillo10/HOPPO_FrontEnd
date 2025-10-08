import { Link } from "react-router-dom";
import "./Login.css";

const Login = () =>{
  return (
    <main className="login">
      <div className="login__card">
        <header className="login__header">
          <div className="login__brand">
            <svg className="login__logo" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.263 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"/>
              <path d="M10.4485 13.8519c.0264.0752.1718.3941.9305.8842  .919.5937 2.3702 1.1784 4.2927 1.6374C18 16.93 20.87 17.27 24 17.27s6-.34 8.33-.897c1.92-.459 3.37-1.044 4.29-1.637.76-.49.9-.809.93-.8842V34.13c.01.027.1.36.94.9.92.594 2.37 1.178 4.29 1.637 2.33.556 5.2.892 8.33.892" fill="currentColor"/>
            </svg>
            <h1>HOPPO</h1>
          </div>

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
      </div>
    </main>
  );
};

export default Login;
