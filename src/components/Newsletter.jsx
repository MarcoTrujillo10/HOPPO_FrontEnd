import "./Newsletter.css";

const Newsletter = () => {
  return (
    <section className="news">
      <h2 className="news__title">Mantente actualizado</h2>
      <p className="news__text">
        Recibe las últimas noticias, ofertas y lanzamientos directamente en tu correo electrónico.
      </p>
      <div className="news__actions">
        <button className="news__btn">Suscríbete</button>
      </div>
    </section>
  );
};
export default Newsletter;
