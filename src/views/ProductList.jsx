import { useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import {
  fetchCatalogMeta,
  fetchCatalogProducts,
  selectCatalogState,
  setFilters,
  replaceFilters,
  clearFilters,
} from "../redux/catalogSlice";
import "./ProductList.css";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const catalogState = useSelector(selectCatalogState);
  const { filters, productos, categorias, marcasOpts, loading, metaLoading, error } =
    catalogState;

  const categoriaParam = searchParams.get("categoria");
  const tipoParam = searchParams.get("tipo");
  const qParam = searchParams.get("q");

  useEffect(() => {
    dispatch(fetchCatalogMeta({ tipoParam }));
  }, [dispatch, tipoParam]);

  useEffect(() => {
    const updates = {};
    let shouldUpdate = false;

    if (qParam !== null) {
      updates.q = qParam || "";
      shouldUpdate = true;
    }

    if (categoriaParam) {
      updates.categoria = categoriaParam;
      updates.tipo = tipoParam || null;
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      dispatch(setFilters(updates));
    }
  }, [categoriaParam, tipoParam, qParam, dispatch]);

  useEffect(() => {
    dispatch(fetchCatalogProducts());
  }, [dispatch, filters]);

  const handleSetFilters = useCallback(
    (updater) => {
      if (typeof updater === "function") {
        const nextFilters = updater(filters);
        dispatch(replaceFilters(nextFilters));
      } else if (updater === null) {
        dispatch(clearFilters());
      } else {
        dispatch(replaceFilters(updater));
      }
    },
    [dispatch, filters]
  );

  if ((loading || metaLoading) && productos.length === 0) {
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
        setFilters={handleSetFilters}
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
