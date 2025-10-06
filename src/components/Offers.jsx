import "./Offers.css";

const Offers = () => {
  const IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuAPq0In9Wd2HuJsWfsAQzmWLViv6CrJqKOjiiwpmF73o3DJrziLIuEDQzKwVplxoGwY-ffAS7OHQkBm8KtRV0BU6vFcne7kr_xqvJnzkn48PiJovGa9_Uqv2z19DjU8b3jplZbGySpVUlAnbBUIGzir_vDxeyIz20avtq2UsX-sF9diHgJ15fFADHqeExzpzVIU7ul_-y9yIcKob3bbs_fTRUJYXjTZQr4-WFLBN8VZnwWS-UGZDxigfg-lIgMKRaZD_l1_xen9dYE";
  return (
    <section className="offers">
      <h2 className="offers__title">Ofertas especiales</h2>
      <div className="offers__wrap">
        <div className="offers__img" style={{ backgroundImage: `url("${IMG}")` }} />
        <div className="offers__body">
          <h3>Descuento en Periféricos</h3>
          <p>
            Aprovecha descuentos exclusivos en una amplia gama de periféricos
            para PC. ¡Por tiempo limitado!
          </p>
          <button className="offers__btn">Ver ofertas</button>
        </div>
      </div>
    </section>
  );
};

export default Offers;