import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import catalogReducer from "./catalogSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    catalog: catalogReducer,
  },
});

export default store;