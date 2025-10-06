import { Link } from "react-router-dom";
import "./ProductDetail.css";

const ProductDetail = () => {
  // Podés traer estos datos por props o por :id más adelante.
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCUyn6oLUZTZoekF78Ybwyq1tSw4PPdECMn_6qGlzTcf-a3FPNZTLAa0n7p2WkEKxAiJclw94v5qq5BQ4GLb1LTblqpkzHSmgBvlnzF6gYZY3VlVOMhsCEG7sAM4RAdGq2U-tgKKGymPPz5nwXm99JcUSLYW11-2X5JVEhefMM38e53keMDu-qhbDgXPhLE0L4BQiU3p8ztTDDH76_wCjigekN7GyXP3rG8oBQEaIa3nM0w4hrFSnqzU5ot7V2Sqw-pT_hJ5_myox4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB5zy8sSs6HvceClddGnXQNWAxFK3KGvSpJ-9bIaEowDZXI5IRKIG0jj5B_pVVpRaopOs_YXWOtz0_Acbg9dJIHm4hBHOHP6aiyLn4Gjj4GiKc5EOx4pIjOLUWa8E10ul846gNoLFo44GU1loiWVaUqlhb9DSSvYq9Gqmzs25N1O7XDfc6tG5NOM97QKx8ecd85Y4g-v4MKPB50Eh1wJkO1WI6x17yC-NLvd8bPI1R_2wJp3J8nlMwSPDbqwID5tOIDUOMv4nqIFZA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD_Cwajjri_b1SvOHsRh9Jt1xv5N_xAWrDeQS4q4RTEYlg8auBXKW-n_IB22VLQGMf_8d-AH-WySZGEM-Efgk3UsldHw_ypmShMPJ7xWCgTjsgVePoT6_CWEgE2x4kR9Rjvenmyi4R6BtVltA7m4TKMySKw77zu71mx8sX3bqlRsbhCiT8c5YUWPRlUrzX1N6bMhXyVJzZMGnteIelvByrbT5xXSnlzqCQZx27IK9K9AYcwzxnJKthp0Z0v18Lsb8hrBGgIbnVDBEk",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCUyn6oLUZTZoekF78Ybwyq1tSw4PPdECMn_6qGlzTcf-a3FPNZTLAa0n7p2WkEKxAiJclw94v5qq5BQ4GLb1LTblqpkzHSmgBvlnzF6gYZY3VlVOMhsCEG7sAM4RAdGq2U-tgKKGymPPz5nwXm99JcUSLYW11-2X5JVEhefMM38e53keMDu-qhbDgXPhLE0L4BQiU3p8ztTDDH76_wCjigekN7GyXP3rG8oBQEaIa3nM0w4hrFSnqzU5ot7V2Sqw-pT_hJ5_myox4",
  ];

  return (
    <main className="pd container">
      {/* migas */}
      <div className="pd__breadcrumbs">
        <Link to="/productos">Productos</Link>
        <span>/</span>
        <span>Periféricos</span>
      </div>

      <div className="pd__grid">
        {/* Galería */}
        <section className="pd__gallery">
          <div
            className="pd__gallery-main"
            style={{ backgroundImage: `url("${images[0]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[1]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[2]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[3]}")` }}
          />
        </section>

        {/* Info */}
        <section className="pd__info">
          <header className="pd__header">
            <h1 className="pd__title">Teclado Mecánico para Gaming</h1>
            <p className="pd__model">Modelo: K95 RGB Platinum XT</p>
          </header>

          <div className="pd__price">$199.99</div>

          <div className="pd__block">
            <h2 className="pd__h2">Descripción del Producto</h2>
            <p className="pd__text">
              El teclado mecánico para gaming K95 RGB Platinum XT ofrece una
              experiencia de juego inigualable con sus interruptores Cherry MX
              Speed, retroiluminación RGB personalizable y construcción
              duradera. Ideal para gamers que buscan rendimiento y estilo.
            </p>
          </div>

          <div className="pd__block">
            <h2 className="pd__h2">Especificaciones Técnicas</h2>
            <div className="pd__specs">
              <div className="pd__spec">
                <p className="pd__spec-k">Tipo de Interruptor</p>
                <p className="pd__spec-v">Cherry MX Speed</p>
              </div>
              <div className="pd__spec">
                <p className="pd__spec-k">Retroiluminación</p>
                <p className="pd__spec-v">RGB por tecla</p>
              </div>
              <div className="pd__spec">
                <p className="pd__spec-k">Conectividad</p>
                <p className="pd__spec-v">USB 2.0</p>
              </div>
              <div className="pd__spec">
                <p className="pd__spec-k">Material</p>
                <p className="pd__spec-v">Aluminio anodizado</p>
              </div>
            </div>
          </div>

          <div className="pd__actions">
            <button className="btn btn--primary">Añadir al Carrito</button>
            <button className="btn btn--ghost" title="Favoritos">♡</button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
