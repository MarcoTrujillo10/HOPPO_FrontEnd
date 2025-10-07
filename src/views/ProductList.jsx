import { useMemo, useState } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import "./ProductList.css";

// Datos mock (podés pasarlos a /src/data/products.js si querés)
const RAW = [
  { id: "cpu-i7", nombre: "Intel Core i7", detalle: "12C/24T", categoria: "Componentes", marca: "Intel", precio: 350, img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center" },
  { id: "gpu-3080", nombre: "NVIDIA RTX 3080", detalle: "10 GB GDDR6X", categoria: "Componentes", marca: "NVIDIA", precio: 1200, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop&crop=center" },
  { id: "ram-ven", nombre: "Corsair Vengeance 16GB", detalle: "DDR4 3200", categoria: "Componentes", marca: "Corsair", precio: 95, img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center" },
  { id: "ssd-970", nombre: "Samsung 970 EVO 1TB", detalle: "NVMe Gen3", categoria: "Componentes", marca: "Samsung", precio: 150, img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop&crop=center" },
  { id: "kb-logi", nombre: "Logitech G Pro", detalle: "Teclado mecánico", categoria: "Periféricos", marca: "Logitech", precio: 130, img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&crop=center" },
  { id: "mouse-viper", nombre: "Razer Viper", detalle: "Ratón inalámbrico 20K DPI", categoria: "Periféricos", marca: "Razer", precio: 80, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&crop=center" },
  { id: "hp-cloud2", nombre: "HyperX Cloud II", detalle: "Auriculares 7.1", categoria: "Periféricos", marca: "HyperX", precio: 99, img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&crop=center" },
  { id: "monitor-rog", nombre: 'ASUS ROG Swift 27"', detalle: "1440p 165Hz", categoria: "Periféricos", marca: "ASUS", precio: 650, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop&crop=center" },
];

const uniq = (arr) => [...new Set(arr)];
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const ProductList = () => {
  // Estado de filtros de toda la vista
  const [filters, setFilters] = useState({
    q: "",
    categoria: "Todos",
    marcas: [],
    min: "",
    max: "",
    orden: "relevancia",
  });

  // Opciones dinámicas para selects/checkboxes
  const categorias = useMemo(
    () => ["Todos", ...uniq(RAW.map((p) => p.categoria))],
    []
  );
  const marcasOpts = useMemo(() => uniq(RAW.map((p) => p.marca)).sort(), []);

  // Filtrado + orden (memorizado)
  const productos = useMemo(() => {
    let out = RAW.slice();
    const { q, categoria, marcas, min, max, orden } = filters;

    // Búsqueda
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      out = out.filter(
        (p) =>
          p.nombre.toLowerCase().includes(t) ||
          p.detalle.toLowerCase().includes(t) ||
          p.marca.toLowerCase().includes(t)
      );
    }

    // Categoría
    if (categoria !== "Todos") out = out.filter((p) => p.categoria === categoria);

    // Marcas (multi)
    if (marcas.length) out = out.filter((p) => marcas.includes(p.marca));

    // Precio
    const nMin = min === "" ? -Infinity : Number(min);
    const nMax = max === "" ? +Infinity : Number(max);
    out = out.filter((p) => p.precio >= nMin && p.precio <= nMax);

    // Orden
    switch (orden) {
      case "precio-asc":
        out.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        out.sort((a, b) => b.precio - a.precio);
        break;
      case "alf-asc":
        out.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "alf-desc":
        out.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break; // relevancia: orden original
    }

    return out;
  }, [filters]);

  // Helpers que pasan a los inputs de precio
  const clampMin = (v) =>
    setFilters((f) => ({ ...f, min: v === "" ? "" : clamp(+v, 0, 100000) }));
  const clampMax = (v) =>
    setFilters((f) => ({ ...f, max: v === "" ? "" : clamp(+v, 0, 100000) }));

  return (
    <main className="productList">
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        categorias={categorias}
        marcasOpts={marcasOpts}
        clampMin={clampMin}
        clampMax={clampMax}
      />

      <section className="list">
        <div className="list__head">
          <h2 className="list__title">Productos</h2>
          <span className="list__count">{productos.length} resultados</span>
        </div>

        <ProductGrid productos={productos} />
      </section>
    </main>
  );
};

export default ProductList;
