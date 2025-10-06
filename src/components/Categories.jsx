import "./Categories.css";

const CATS = [
  { label: "Procesadores", icon: "🧠" },
  { label: "Memoria RAM", icon: "📈" },
  { label: "Almacenamiento", icon: "💽" },
  { label: "Monitores", icon: "🖥️" },
  { label: "Teclados", icon: "⌨️" },
  { label: "Mouses", icon: "🖱️" },
];

const Categories = () =>{
  return (
    <section className="cats">
      <h2 className="cats__title">Categorías principales</h2>
      <div className="cats__grid">
        {CATS.map((c) => (
          <a key={c.label} href="#" className="cat">
            <div className="cat__icon" aria-hidden>{c.icon}</div>
            <h3 className="cat__label">{c.label}</h3>
          </a>
        ))}
      </div>
    </section>
  );
};
export default Categories;
