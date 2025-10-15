import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { CartProvider } from "./hooks/useCart.jsx";
import Header from "./components/Header";
import Home from "./views/Home";
import Contact from "./views/Contact";
import ProductList from "./views/ProductList";
import ProductDetail from "./views/ProductDetail";
import Cart from "./views/Cart";
import Profile from "./views/Profile";
import PCBuilder from "./views/PCBuilder";
import Login from "./views/Login";
import Register from "./views/Register";
import TestPage from "./views/TestPage";
import TestAuth from "./views/TestAuth";
import ProfileDebug from "./views/ProfileDebug";
import ProfileSimple from "./views/ProfileSimple";
import ProfileMinimal from "./views/ProfileMinimal";
import AdminPanel from "./views/AdminPanel";


const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pc-builder" element={<PCBuilder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/test-auth" element={<TestAuth />} />
          <Route path="/profile-debug" element={<ProfileDebug />} />
          <Route path="/profile-simple" element={<ProfileSimple />} />
          <Route path="/profile-minimal" element={<ProfileMinimal />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
