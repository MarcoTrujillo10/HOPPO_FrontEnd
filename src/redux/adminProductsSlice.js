import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  productService,
  categoryService,
  brandService,
  uploadService,
  carouselService,
} from "../services/api";

const initialState = {
  products: [],
  categories: [],
  brands: [],
  loading: false,
  error: null,
  formData: {
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    brandId: "",
    discount: 0,
  },
  productImages: [],
  editingProduct: null,
  showForm: false,
  isInCarousel: false,
  carouselCount: 0,
  status: { type: "", message: "" },
};

export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts({
        includeOutOfStock: true,
        size: 1000,
      });
      return response.data.content || response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cargar productos"
      );
    }
  }
);

export const fetchAdminMetadata = createAsyncThunk(
  "adminProducts/fetchMetadata",
  async (_, { rejectWithValue }) => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands(),
      ]);
      return {
        categories:
          categoriesRes.data.content || categoriesRes.data || [],
        brands: brandsRes.data || [],
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cargar metadatos"
      );
    }
  }
);

export const fetchCarouselCount = createAsyncThunk(
  "adminProducts/fetchCarouselCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await carouselService.getCarouselItemCount();
      return response.data?.count || response.data || 0;
    } catch (error) {
      return 0;
    }
  }
);

export const checkProductInCarousel = createAsyncThunk(
  "adminProducts/checkInCarousel",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await carouselService.checkProductInCarousel(productId);
      return response.data?.isInCarousel ?? response.data ?? false;
    } catch (error) {
      return false;
    }
  }
);

export const createAdminProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue, dispatch }) => {
    try {
      const response = await productService.createProduct(productData);
      await dispatch(fetchAdminProducts());
      await dispatch(fetchCarouselCount());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.errors?.join(", ") ||
          "Error al crear producto"
      );
    }
  }
);

export const updateAdminProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ productId, productData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await productService.updateProduct(productId, productData);
      await dispatch(fetchAdminProducts());
      await dispatch(fetchCarouselCount());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.errors?.join(", ") ||
          "Error al actualizar producto"
      );
    }
  }
);

export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      await productService.deleteProduct(productId);
      await dispatch(fetchAdminProducts());
      await dispatch(fetchCarouselCount());
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al eliminar producto"
      );
    }
  }
);

export const toggleProductInCarousel = createAsyncThunk(
  "adminProducts/toggleCarousel",
  async ({ productId, add }, { rejectWithValue, dispatch }) => {
    try {
      if (add) {
        await carouselService.addProductToCarousel(productId);
      } else {
        await carouselService.removeProductFromCarousel(productId);
      }
      await dispatch(fetchCarouselCount());
      await dispatch(checkProductInCarousel(productId));
      return add;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al modificar el carrusel"
      );
    }
  }
);

export const uploadProductImages = createAsyncThunk(
  "adminProducts/uploadImages",
  async (files, { rejectWithValue }) => {
    try {
      const uploadedUrls = await uploadService.uploadImages(files);
      return uploadedUrls;
    } catch (error) {
      return rejectWithValue("Error al subir imágenes");
    }
  }
);

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
      state.productImages = [];
      state.editingProduct = null;
      state.isInCarousel = false;
      state.showForm = false;
      state.status = { type: "", message: "" };
    },
    setProductImages: (state, action) => {
      state.productImages = action.payload;
    },
    setEditingProduct: (state, action) => {
      const product = action.payload;
      if (product) {
        state.editingProduct = product;
        state.formData = {
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          categoryId: product.category?.id || "",
          brandId: product.brand?.id || "",
          discount: product.discount || 0,
        };
        if (product.images && product.images.length > 0) {
          state.productImages = product.images.map((img) => ({
            url: img.imageUrl,
            name: "Imagen existente",
            isNew: false,
          }));
        } else {
          state.productImages = [];
        }
        state.showForm = true;
      } else {
        state.editingProduct = null;
      }
    },
    setShowForm: (state, action) => {
      state.showForm = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    clearStatus: (state) => {
      state.status = { type: "", message: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminMetadata.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.brands = action.payload.brands;
      })
      .addCase(fetchCarouselCount.fulfilled, (state, action) => {
        state.carouselCount = action.payload;
      })
      .addCase(checkProductInCarousel.fulfilled, (state, action) => {
        state.isInCarousel = action.payload;
      })
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminProduct.fulfilled, (state) => {
        state.loading = false;
        state.status = {
          type: "success",
          message: "Producto creado exitosamente",
        };
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = {
          type: "error",
          message: action.payload || "Error al crear producto",
        };
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state) => {
        state.loading = false;
        state.status = {
          type: "success",
          message: "Producto actualizado exitosamente",
        };
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = {
          type: "error",
          message: action.payload || "Error al actualizar producto",
        };
      })
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state) => {
        state.loading = false;
        state.status = {
          type: "success",
          message: "Producto eliminado exitosamente",
        };
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = {
          type: "error",
          message: action.payload || "Error al eliminar producto",
        };
      })
      .addCase(toggleProductInCarousel.fulfilled, (state, action) => {
        state.isInCarousel = action.payload;
        state.status = {
          type: "success",
          message: action.payload
            ? "Producto agregado al carrusel exitosamente"
            : "Producto removido del carrusel exitosamente",
        };
      })
      .addCase(toggleProductInCarousel.rejected, (state, action) => {
        state.status = {
          type: "error",
          message: action.payload || "Error al modificar el carrusel",
        };
      });
  },
});

export const {
  setFormData,
  resetFormData,
  setProductImages,
  setEditingProduct,
  setShowForm,
  setStatus,
  clearStatus,
} = adminProductsSlice.actions;

export const selectAdminProducts = (state) => state.adminProducts.products;
export const selectAdminCategories = (state) => state.adminProducts.categories;
export const selectAdminBrands = (state) => state.adminProducts.brands;
export const selectAdminFormData = (state) => state.adminProducts.formData;
export const selectAdminProductImages = (state) =>
  state.adminProducts.productImages;
export const selectEditingProduct = (state) =>
  state.adminProducts.editingProduct;
export const selectShowForm = (state) => state.adminProducts.showForm;
export const selectIsInCarousel = (state) => state.adminProducts.isInCarousel;
export const selectCarouselCount = (state) => state.adminProducts.carouselCount;
export const selectAdminStatus = (state) => state.adminProducts.status;
export const selectAdminLoading = (state) => state.adminProducts.loading;
export const selectAdminError = (state) => state.adminProducts.error;

export default adminProductsSlice.reducer;

