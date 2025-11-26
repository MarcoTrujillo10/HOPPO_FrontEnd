import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { paymentService } from "../services/api";

const initialFormData = {
  cardNumber: "",
  cardHolderName: "",
  expiryDate: "",
  cvv: "",
  paymentMethod: "credit_card",
  billingAddress: "",
  city: "",
  postalCode: "",
  country: "Argentina",
};

const initialState = {
  formData: initialFormData,
  errors: {},
  loading: false,
  paymentStatus: null,
  paymentResult: null,
};

export const processCheckoutPayment = createAsyncThunk(
  "checkout/processPayment",
  async ({ totalAmount }, { getState, rejectWithValue }) => {
    try {
      const { formData } = getState().checkout;
      const payload = {
        ...formData,
        totalAmount,
      };
      const response = await paymentService.processPayment(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "Error procesando el pago. Inténtalo nuevamente."
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    updateCheckoutField(state, action) {
      const { name, value } = action.payload;
      state.formData = {
        ...state.formData,
        [name]: value,
      };
    },
    setCheckoutErrors(state, action) {
      state.errors = action.payload || {};
    },
    resetCheckoutState() {
      return {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processCheckoutPayment.pending, (state) => {
        state.loading = true;
        state.paymentStatus = null;
        state.paymentResult = null;
      })
      .addCase(processCheckoutPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = "success";
        state.paymentResult = action.payload;
      })
      .addCase(processCheckoutPayment.rejected, (state, action) => {
        state.loading = false;
        state.paymentStatus = "error";
        state.paymentResult = null;
        state.errors = {
          ...state.errors,
          submit: action.payload || action.error.message,
        };
      });
  },
});

export const {
  updateCheckoutField,
  setCheckoutErrors,
  resetCheckoutState,
} = checkoutSlice.actions;

export const selectCheckoutState = (state) => state.checkout;

export default checkoutSlice.reducer;

