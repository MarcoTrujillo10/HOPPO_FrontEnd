import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import { productService, categoryService, brandService } from "../services/api";
import "./ProductList.css";
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const ProductList = () => {
  const [searchParams] = useSearchParams();
  
  // Leer parámetros de la URL
  const categoriaParam = searchParams.get("categoria");
  const tipoParam = searchParams.get("tipo");
  const qParam = searchParams.get("q");
  
  const [filters, setFilters] = useState({
    q: qParam || "",
    categoria: categoriaParam || "Todos",
    tipo: tipoParam || null,
    marcas: [],
    min: "",
    max: "",
    orden: "relevancia",
  });
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState(["Todos"]);
  const [marcasOpts, setMarcasOpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, brandsResponse] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands(),
        ]);
        const categoriesArray =
          categoriesResponse?.data?.content ??
          categoriesResponse?.data ??
          [];
        
        // Si hay un tipo en la URL, filtrar categorías por tipo
        let filteredCategories = categoriesArray;
        if (tipoParam) {
          filteredCategories = categoriesArray.filter(
            (cat) => cat.type === tipoParam
          );
        }
        
        const categoriesData = [
          "Todos",
          ...filteredCategories.map((cat) => cat.description),
        ];
        setCategorias(categoriesData);
        
        // Si hay una categoría en la URL, verificar que existe
        if (categoriaParam) {
          const categoryExists = filteredCategories.some(
            (cat) => cat.description === categoriaParam
          );
          if (categoryExists) {
            setFilters((prev) => ({
              ...prev,
              categoria: categoriaParam,
              tipo: tipoParam,
            }));
          }
        }
        
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
  }, [categoriaParam, tipoParam]);
  
  // Actualizar filtros cuando cambian los parámetros de la URL
  useEffect(() => {
    const categoriaFromUrl = searchParams.get("categoria");
    const tipoFromUrl = searchParams.get("tipo");
    const qFromUrl = searchParams.get("q");
    
    setFilters((prev) => {
      const updates = { ...prev };
      let hasChanges = false;
      
      // Actualizar categoría
      if (categoriaFromUrl && categoriaFromUrl !== prev.categoria) {
        updates.categoria = categoriaFromUrl;
        updates.tipo = tipoFromUrl || prev.tipo;
        hasChanges = true;
      } else if (!categoriaFromUrl && prev.categoria !== "Todos") {
        updates.categoria = "Todos";
        updates.tipo = null;
        hasChanges = true;
      }
      
      // Actualizar búsqueda
      if (qFromUrl !== prev.q) {
        updates.q = qFromUrl || "";
        hasChanges = true;
      }
      
      return hasChanges ? updates : prev;
    });
  }, [searchParams]);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { q, categoria, min, max } = filters;
        const searchParams = {
          page: 0,
          size: 1000, 
        };
        
        if (q?.trim()) searchParams.name = q.trim();
        if (min !== "") searchParams.minPrice = Number(min);
        if (max !== "") searchParams.maxPrice = Number(max);
        let productsData = [];
        if (categoria !== "Todos") {
          const categoriesResponse = await categoryService.getCategories();
          const pool =
            categoriesResponse?.data?.content ??
            categoriesResponse?.data ??
            [];
          
          // Si hay un tipo en los filtros, filtrar por tipo también
          let filteredPool = pool;
          if (filters.tipo) {
            filteredPool = pool.filter((cat) => cat.type === filters.tipo);
          }
          
          const selectedCategory = filteredPool.find(
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
          const productsResponse = await productService.getProducts(searchParams);
          productsData = productsResponse?.data?.content ?? [];
        }
        let filteredProducts = productsData;
        if (filters.marcas?.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            filters.marcas.includes(product?.brand?.name)
          );
        }
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
