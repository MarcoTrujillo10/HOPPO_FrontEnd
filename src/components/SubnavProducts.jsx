import { Link } from "react-router-dom";
import "./SubnavProducts.css";

const SubnavProducts = () =>{
  return (
    <div className="subnav">
      <div className="subnav__block">
        <h3 className="subnav__title">Componentes</h3>
        <div className="subnav__group">
          <Link className="pill" to="/productos?cat=procesadores">Procesadores</Link>
          <Link className="pill" to="/productos?cat=gpu">Tarjetas Gráficas</Link>
          <Link className="pill" to="/productos?cat=ram">Memoria RAM</Link>
          <Link className="pill" to="/productos?cat=almacenamiento">Almacenamiento</Link>
          <Link className="pill" to="/productos?cat=mother">Placas Madre</Link>
          <Link className="pill" to="/productos?cat=psu">Fuentes</Link>
        </div>
      </div>

      <div className="subnav__block">
        <h3 className="subnav__title">Periféricos</h3>
        <div className="subnav__group">
          <Link className="pill" to="/productos?cat=teclados">Teclados</Link>
          <Link className="pill" to="/productos?cat=mouse">Mouses</Link>
          <Link className="pill" to="/productos?cat=monitores">Monitores</Link>
          <Link className="pill" to="/productos?cat=auriculares">Auriculares</Link>
        </div>
      </div>

      <div className="subnav__block">
        <div className="subnav__group">
          <Link className="pill pill--emph" to="/productos">Todos los Productos</Link>
          <Link className="pill" to="/armador">Armador de PC</Link>
          <Link className="pill" to="/Offers">Ofertas</Link>
          <Link className="pill" to="/Contact">Contacto</Link>
        </div>
      </div>
    </div>
  );
};

export default SubnavProducts;
