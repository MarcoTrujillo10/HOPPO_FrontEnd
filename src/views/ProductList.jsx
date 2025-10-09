// src/views/ProductList.jsx
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import SubnavProducts from "../components/SubnavProducts";
import { PRODUCTS_DATA, getAllCategories, getAllBrands } from "../data/productsData";
import "./ProductList.css";

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const ProductList = () => {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    q: "",
    categoria: "Todos",
    marcas: [],
    min: "",
    max: "",
    orden: "relevancia",
  });

  // Si viene ?q= o ?cat= en la URL, úsalo como búsqueda rápida
  useEffect(() => {
    const qParam = searchParams.get("q");
    const catParam = searchParams.get("cat");
    const incoming = qParam || catParam || "";

    setFilters((prev) =>
      incoming && incoming !== prev.q ? { ...prev, q: incoming } : prev
    );
  }, [searchParams]);

  const categorias = useMemo(() => ["Todos", ...getAllCategories()], []);
  const marcasOpts = useMemo(() => getAllBrands(), []);

  const productos = useMemo(() => {
    let out = PRODUCTS_DATA.slice();
    const { q, categoria, marcas, min, max, orden } = filters;

    if (q.trim()) {
      const t = q.trim().toLowerCase();
      out = out.filter(
        (p) =>
          p.nombre.toLowerCase().includes(t) ||
          p.detalle.toLowerCase().includes(t) ||
          p.marca.toLowerCase().includes(t) ||
          (p.tags ? p.tags.some((tag) => tag.toLowerCase().includes(t)) : false)
      );
    }

    if (categoria !== "Todos") out = out.filter((p) => p.categoria === categoria);

    if (marcas.length) out = out.filter((p) => marcas.includes(p.marca));

    const nMin = min === "" ? -Infinity : Number(min);
    const nMax = max === "" ? +Infinity : Number(max);
    out = out.filter((p) => p.precio >= nMin && p.precio <= nMax);

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
        break; // relevancia (no cambia el orden original)
    }

    return out;
  }, [filters]);

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
        {/* Subnavegación con “pills” */}
        <SubnavProducts />

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
