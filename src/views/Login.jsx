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
      </div>
    </main>
  );
};

export default Login;
