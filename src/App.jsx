import { useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { CartProvider } from "./hooks/useCart.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import { setNavigationCallback } from "./services/api";
import Header from "./components/Header";
import Home from "./views/Home";
import Contact from "./views/Contact";
import ProductList from "./views/ProductList";
import ProductDetail from "./views/ProductDetail";
import Cart from "./views/Cart";
import Checkout from "./views/Checkout";
import Profile from "./views/Profile";
import PCBuilder from "./views/PCBuilder";
import Login from "./views/Login";
import Register from "./views/Register";
import AdminPanel from "./views/AdminPanel";
import "./styles/Toast.css";
 
const App = () => {
  const navigate = useNavigate();

  useEffect(() => {

    setNavigationCallback(navigate);
  }, [navigate]);

  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ProductList />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pc-builder" element={<PCBuilder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
};
 
export default App;