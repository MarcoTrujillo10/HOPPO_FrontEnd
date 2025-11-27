import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import catalogReducer from "./catalogSlice";
import checkoutReducer from "./checkoutSlice";
import adminProductsReducer from "./adminProductsSlice";
import ordersReducer from "./ordersSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    catalog: catalogReducer,
    checkout: checkoutReducer,
    adminProducts: adminProductsReducer,
    orders: ordersReducer,
  },
});

export default store;