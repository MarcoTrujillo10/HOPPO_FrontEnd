import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
  };

  return (
    <main className="fp">
      <section className="fp__wrap">
        <h1 className="fp__title">¿Olvidaste tu contraseña?</h1>
        <p className="fp__subtitle">
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.
        </p>

        <form className="fp__form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Correo electrónico"
            required
          />

          <button type="submit" className="btn-primary">Enviar instrucciones</button>
        </form>

        <p className="fp__back">
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
