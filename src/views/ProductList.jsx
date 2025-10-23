import { useState, useEffect } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import { productService, categoryService, brandService } from "../services/api";
import "./ProductList.css";
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
  // Estados para datos del backend
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(["Todos"]);
  const [marcasOpts, setMarcasOpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Cargar categorías y marcas al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, brandsResponse] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands(),
        ]);
        // Mapear categorías (api puede traer {content: []} o [])
        const categoriesArray =
          categoriesResponse?.data?.content ??
          categoriesResponse?.data ??
          [];
        const categoriesData = [
          "Todos",
          ...categoriesArray.map((cat) => cat.description),
        ];
        setCategorias(categoriesData);
        // Mapear marcas
        const brandsArray = brandsResponse?.data ?? [];
        const brandsData = brandsArray.map((brand) => brand.name);
        setMarcasOpts(brandsData);
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
        setError(
          `Error al cargar datos: ${
            err?.response?.data?.message || err?.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);
  // Cargar productos cuando cambien los filtros
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { q, categoria, min, max } = filters;
        // Construir parámetros de búsqueda
        const searchParams = {
          page: 0,
          size: 1000, // Cargar todos los productos por ahora
        };
        if (q?.trim()) searchParams.name = q.trim();
        if (min !== "") searchParams.minPrice = Number(min);
        if (max !== "") searchParams.maxPrice = Number(max);
        let productsData = [];
        if (categoria !== "Todos") {
          // Buscar categoría por nombre y obtener productos
          const categoriesResponse = await categoryService.getCategories();
          const pool =
            categoriesResponse?.data?.content ??
            categoriesResponse?.data ??
            [];
          const selectedCategory = pool.find(
            (cat) => cat.description === categoria
          );
          if (selectedCategory) {
            const productsResponse =
              await categoryService.getProductsByCategory(
                selectedCategory.id
              );
            productsData = productsResponse?.data?.content ?? [];
          } else {
            productsData = [];
          }
        } else {
          // Obtener todos los productos
          const productsResponse = await productService.getProducts(searchParams);
          productsData = productsResponse?.data?.content ?? [];
        }
        // Filtro por marcas
        let filteredProducts = productsData;
        if (filters.marcas?.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            filters.marcas.includes(product?.brand?.name)
          );
        }
        // Ordenamiento
        switch (filters.orden) {
          case "precio-asc":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case "precio-desc":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case "alf-asc":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "alf-desc":
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            // relevancia: orden original
            break;
        }
        setProductos(filteredProducts);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setError("Error al cargar productos");
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters]);
  // Helpers para inputs de precio
  const clampMin = (v) =>
    setFilters((f) => ({
      ...f,
      min: v === "" ? "" : clamp(Number(v), 0, 100000),
    }));
  const clampMax = (v) =>
    setFilters((f) => ({
      ...f,
      max: v === "" ? "" : clamp(Number(v), 0, 100000),
    }));
  // Estados de carga / error
  if (loading && productos.length === 0) {
    return (
      <main className="productList">
        <div className="loading">
          <h2>Cargando productos...</h2>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="productList">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </main>
    );
  }
  return (
    <main className="productList">
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        categorias={categorias}
        marcasOpts={marcasOpts}
      />
      <section className="list" style={{ position: "relative", zIndex: 1 }}>
        <div className="list__head">
          <h2 className="list__title">Productos</h2>
          <span className="list__count">
            {productos.length} resultados
            {loading && " (cargando...)"}
          </span>
        </div>
        <ProductGrid productos={productos} />
      </section>
    </main>
  );
};
export default ProductList;
