import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import catalogReducer from "./catalogSlice";
import checkoutReducer from "./checkoutSlice";
import adminProductsReducer from "./adminProductsSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    catalog: catalogReducer,
    checkout: checkoutReducer,
    adminProducts: adminProductsReducer,
  },
});

export default store;