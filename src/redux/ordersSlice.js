import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../services/api";

// ============ ESTADO INICIAL ============
const initialState = {
  // Órdenes para admin (todas)
  adminOrders: [],
  adminLoading: false,
  adminError: null,
  
  // Órdenes del usuario (mis órdenes)
  userOrders: [],
  userLoading: false,
  userError: null,
  
  // UI state
  expandedOrderId: null,
};

// ============ THUNKS (ACCIONES ASYNC) ============

// Cargar todas las órdenes (admin)
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

// Cargar mis órdenes (usuario)
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

// Actualizar estado de orden (admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue, dispatch }) => {
    try {
      await orderService.updateOrder(orderId, { status });
      // Recargar órdenes después de actualizar
      dispatch(fetchAdminOrders());
      return { orderId, status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al actualizar orden"
      );
    }
  }
);

// Cancelar orden (usuario)
export const cancelUserOrder = createAsyncThunk(
  "orders/cancelUserOrder",
  async (orderId, { rejectWithValue, dispatch }) => {
    try {
      await orderService.cancelOrder(orderId);
      // Recargar mis órdenes después de cancelar
      dispatch(fetchUserOrders());
      return orderId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error al cancelar orden"
      );
    }
  }
);

// ============ SLICE ============
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  
  reducers: {
    // Toggle para expandir/contraer detalles de orden
    toggleOrderDetails: (state, action) => {
      state.expandedOrderId = 
        state.expandedOrderId === action.payload ? null : action.payload;
    },
    
    // Limpiar errores
    clearOrdersError: (state) => {
      state.adminError = null;
      state.userError = null;
    },
    
    // Reset al logout
    resetOrdersState: (state) => {
      state.adminOrders = [];
      state.userOrders = [];
      state.expandedOrderId = null;
      state.adminError = null;
      state.userError = null;
    },
  },
  
  extraReducers: (builder) => {
    // ===== FETCH ADMIN ORDERS =====
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
    
    // ===== FETCH USER ORDERS =====
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
    
    // ===== UPDATE ORDER STATUS =====
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
    
    // ===== CANCEL USER ORDER =====
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

// ============ EXPORTAR ACTIONS ============
export const { 
  toggleOrderDetails, 
  clearOrdersError, 
  resetOrdersState 
} = ordersSlice.actions;

// ============ SELECTORES ============
export const selectAdminOrders = (state) => state.orders.adminOrders;
export const selectAdminOrdersLoading = (state) => state.orders.adminLoading;
export const selectAdminOrdersError = (state) => state.orders.adminError;

export const selectUserOrders = (state) => state.orders.userOrders;
export const selectUserOrdersLoading = (state) => state.orders.userLoading;
export const selectUserOrdersError = (state) => state.orders.userError;

export const selectExpandedOrderId = (state) => state.orders.expandedOrderId;

// Selector derivado: estadísticas del usuario
export const selectUserOrdersStats = (state) => {
  const orders = state.orders.userOrders;
  return {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
    pendingOrders: orders.filter(o => o.status === 'CREATED').length,
  };
};

// ============ EXPORTAR REDUCER ============
export default ordersSlice.reducer;

