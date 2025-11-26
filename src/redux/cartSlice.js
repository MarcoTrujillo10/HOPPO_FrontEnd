import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService, cartProductService } from "../services/api";

const emptyPayload = {
  cart: null,
  items: [],
};

const normalizePayload = (cartData) => ({
  cart: cartData || null,
  items: (cartData?.items || []).filter(Boolean),
});

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getMyCart();
      if (!response?.data) {
        return emptyPayload;
      }
      return normalizePayload(response.data);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404 || status === 403) {
        return emptyPayload;
      }
      return rejectWithValue(
        getErrorMessage(error, "Error al cargar el carrito")
      );
    }
  }
);

export const createCartThunk = createAsyncThunk(
  "cart/createCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.createCart({});
      return normalizePayload(response?.data);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al crear el carrito")
      );
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ productId, quantity = 1 }, { dispatch, rejectWithValue }) => {
    try {
      const payload = { productId, quantity };
      const response = await cartProductService.addToCart(payload);
      await dispatch(fetchCart()).unwrap();
      return {
        message: `Se agregaron ${quantity} unidad(es) al carrito`,
        data: response?.data,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al agregar producto al carrito")
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ cartProductId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await cartProductService.updateCartProduct(cartProductId, { quantity });
      await dispatch(fetchCart()).unwrap();
      return { id: cartProductId, quantity };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al actualizar el producto del carrito")
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ cartProductId }, { dispatch, rejectWithValue }) => {
    try {
      await cartProductService.removeFromCart(cartProductId);
      await dispatch(fetchCart()).unwrap();
      return { id: cartProductId };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al eliminar el producto del carrito")
      );
    }
  }
);

export const clearCartItems = createAsyncThunk(
  "cart/clearCartItems",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const items = getState().cart.items || [];
      if (items.length === 0) {
        return { removed: 0 };
      }
      await Promise.all(
        items.map((item) => cartProductService.removeFromCart(item.id))
      );
      await dispatch(fetchCart()).unwrap();
      return { removed: items.length };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Error al limpiar el carrito")
      );
    }
  }
);

const initialState = {
  cart: null,
  items: [],
  loading: false,
  error: null,
  lastActionMessage: null,
};

const isMutationPending = (action) =>
  [
    addItemToCart.pending.type,
    updateCartItem.pending.type,
    removeCartItem.pending.type,
    clearCartItems.pending.type,
  ].includes(action.type);

const isMutationFulfilled = (action) =>
  [
    addItemToCart.fulfilled.type,
    updateCartItem.fulfilled.type,
    removeCartItem.fulfilled.type,
    clearCartItems.fulfilled.type,
  ].includes(action.type);

const isMutationRejected = (action) =>
  [
    addItemToCart.rejected.type,
    updateCartItem.rejected.type,
    removeCartItem.rejected.type,
    clearCartItems.rejected.type,
  ].includes(action.type);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload.cart;
        state.items = action.payload.items;
        state.error = null;
      })
      .addCase(createCartThunk.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addMatcher(isMutationPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isMutationFulfilled, (state, action) => {
        state.loading = false;
        state.lastActionMessage = action.payload?.message || null;
      })
      .addMatcher(isMutationRejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetCartState } = cartSlice.actions;

export const selectCartState = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export const calculateCartTotals = (items = []) => {
  const subtotal = items.reduce((sum, cartProduct) => {
    const price =
      cartProduct.product?.discountedPrice || cartProduct.product?.price || 0;
    return sum + price * (cartProduct.quantity || 0);
  }, 0);

  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.21;
  const total = subtotal + shipping + tax;
  const itemCount = items.reduce(
    (sum, cartProduct) => sum + (cartProduct.quantity || 0),
    0
  );

  return { subtotal, shipping, tax, total, itemCount };
};

export default cartSlice.reducer;

