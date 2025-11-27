import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../services/api";

const initialState = {
  adminOrders: [],
  adminLoading: false,
  adminError: null,
  userOrders: [],
  userLoading: false,
  userError: null,
  expandedOrderId: null,
};

export const fetchAdminOrders = createAsyncThunk(
  "orders/fetchAdminOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrders(params);
      return response.data?.content || response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cargar órdenes"
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(params);
      return response.data?.content || response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cargar mis órdenes"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue, dispatch }) => {
    try {
      await orderService.updateOrder(orderId, { status });
      dispatch(fetchAdminOrders());
      return { orderId, status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al actualizar orden"
      );
    }
  }
);

export const cancelUserOrder = createAsyncThunk(
  "orders/cancelUserOrder",
  async (orderId, { rejectWithValue, dispatch }) => {
    try {
      await orderService.cancelOrder(orderId);
      dispatch(fetchUserOrders());
      return orderId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cancelar orden"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    toggleOrderDetails: (state, action) => {
      state.expandedOrderId = 
        state.expandedOrderId === action.payload ? null : action.payload;
    },
    clearOrdersError: (state) => {
      state.adminError = null;
      state.userError = null;
    },
    resetOrdersState: (state) => {
      state.adminOrders = [];
      state.userOrders = [];
      state.expandedOrderId = null;
      state.adminError = null;
      state.userError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userLoading = true;
        state.userError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.adminLoading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.adminLoading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload;
      })
      .addCase(cancelUserOrder.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(cancelUserOrder.fulfilled, (state) => {
        state.userLoading = false;
      })
      .addCase(cancelUserOrder.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = action.payload;
      });
  },
});

export const { 
  toggleOrderDetails, 
  clearOrdersError, 
  resetOrdersState 
} = ordersSlice.actions;

export const selectAdminOrders = (state) => state.orders.adminOrders;
export const selectAdminOrdersLoading = (state) => state.orders.adminLoading;
export const selectAdminOrdersError = (state) => state.orders.adminError;

export const selectUserOrders = (state) => state.orders.userOrders;
export const selectUserOrdersLoading = (state) => state.orders.userLoading;
export const selectUserOrdersError = (state) => state.orders.userError;

export const selectExpandedOrderId = (state) => state.orders.expandedOrderId;

export const selectUserOrdersStats = (state) => {
  const orders = state.orders.userOrders;
  return {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
    pendingOrders: orders.filter(o => o.status === 'CREATED').length,
  };
};

export default ordersSlice.reducer;
