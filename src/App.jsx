import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./views/Home.jsx";
import ProductList from "./views/ProductList.jsx";
import ProductDetail from "./views/ProductDetail.jsx";
import Cart from "./views/Cart.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import Profile from "./views/Profile.jsx";
import PCBuilder from "./views/PCBuilder.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ForgotPassword from "./views/ForgotPassword.jsx";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Rutas donde NO debe verse Header/Footer
const AUTH_ROUTES = ["/login", "/registro", "/contraseña-olvidada"];

export default function App() {
  const location = useLocation();
  const hideLayout = AUTH_ROUTES.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        {/* Arranque en /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/contraseña-olvidada" element={<ForgotPassword />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/armador" element={<PCBuilder />} />

        {/* Protegidas */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}
