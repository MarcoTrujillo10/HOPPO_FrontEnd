import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  productService,
  categoryService,
  brandService,
} from "../services/api";

const initialFilters = {
  q: "",
  categoria: "Todos",
  tipo: null,
  marcas: [],
  min: "",
  max: "",
  orden: "relevancia",
};

const initialState = {
  filters: { ...initialFilters },
  productos: [],
  categorias: ["Todos"],
  categoryPool: [],
  marcasOpts: [],
  loading: false,
  metaLoading: false,
  error: null,
};

const clampNumber = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "";
  return Math.min(Math.max(numeric, 0), 100000);
};

export const fetchCatalogMeta = createAsyncThunk(
  "catalog/fetchMeta",
  async ({ tipoParam } = {}, { rejectWithValue }) => {
    try {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands(),
      ]);

      const categoriesArray =
        categoriesResponse?.data?.content ?? categoriesResponse?.data ?? [];

      const filteredCategories = tipoParam
        ? categoriesArray.filter((cat) => cat.type === tipoParam)
        : categoriesArray;

      const categoriesData = [
        "Todos",
        ...filteredCategories.map((cat) => cat.description),
      ];

      const brandsArray = brandsResponse?.data ?? [];
      const brandsData = brandsArray.map((brand) => brand.name);

      return {
        categorias: categoriesData,
        categoryPool: filteredCategories.length
          ? filteredCategories
          : categoriesArray,
        marcas: brandsData,
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error al cargar filtros"
      );
    }
  }
);

export const fetchCatalogProducts = createAsyncThunk(
  "catalog/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, categoryPool } = getState().catalog;
      const searchParams = { page: 0, size: 1000 };

      if (filters.q?.trim()) searchParams.name = filters.q.trim();
      if (filters.min !== "") searchParams.minPrice = Number(filters.min);
      if (filters.max !== "") searchParams.maxPrice = Number(filters.max);

      let productsData = [];
      if (filters.categoria !== "Todos") {
        let pool = categoryPool;
        if (!pool.length) {
          const categoriesResponse = await categoryService.getCategories();
          pool =
            categoriesResponse?.data?.content ?? categoriesResponse?.data ?? [];
        }

        let filteredPool = pool;
        if (filters.tipo) {
          filteredPool = pool.filter((cat) => cat.type === filters.tipo);
        }

        const selectedCategory = filteredPool.find(
          (cat) => cat.description === filters.categoria
        );

        if (selectedCategory) {
          const productsResponse = await categoryService.getProductsByCategory(
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
          filteredProducts = filteredProducts.sort(
            (a, b) => a.price - b.price
          );
          break;
        case "precio-desc":
          filteredProducts = filteredProducts.sort(
            (a, b) => b.price - a.price
          );
          break;
        case "alf-asc":
          filteredProducts = filteredProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          break;
        case "alf-desc":
          filteredProducts = filteredProducts.sort((a, b) =>
            b.name.localeCompare(a.name)
          );
          break;
        default:
          break;
      }

      return filteredProducts;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error al cargar productos"
      );
    }
  }
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    replaceFilters(state, action) {
      state.filters = {
        ...initialFilters,
        ...action.payload,
      };
    },
    setPriceFilters(state, action) {
      state.filters = {
        ...state.filters,
        min: clampNumber(action.payload?.min ?? state.filters.min),
        max: clampNumber(action.payload?.max ?? state.filters.max),
      };
    },
    clearFilters(state) {
      state.filters = { ...initialFilters };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCatalogMeta.pending, (state) => {
        state.metaLoading = true;
        state.error = null;
      })
      .addCase(fetchCatalogMeta.fulfilled, (state, action) => {
        state.metaLoading = false;
        state.categorias = action.payload.categorias;
        state.categoryPool = action.payload.categoryPool;
        state.marcasOpts = action.payload.marcas;
      })
      .addCase(fetchCatalogMeta.rejected, (state, action) => {
        state.metaLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCatalogProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalogProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(fetchCatalogProducts.rejected, (state, action) => {
        state.loading = false;
        state.productos = [];
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setFilters, replaceFilters, clearFilters, setPriceFilters } =
  catalogSlice.actions;

export const selectCatalogState = (state) => state.catalog;

export default catalogSlice.reducer;

