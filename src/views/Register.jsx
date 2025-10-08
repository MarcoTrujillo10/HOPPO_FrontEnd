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

export default Register;
