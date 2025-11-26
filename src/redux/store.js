import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import catalogReducer from "./catalogSlice";
import checkoutReducer from "./checkoutSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    catalog: catalogReducer,
    checkout: checkoutReducer,
  },
});

export default store;