import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./views/Home";
import Contact from "./views/Contact";
import ProductList from "./views/ProductList";
import ProductDetail from "./views/ProductDetail";
import Cart from "./views/Cart";
import Profile from "./views/Profile";
import Login from "./views/Login"; 
import Register from "./views/Register"; 
import ForgotPassword from "./views/ForgotPassword";
import PCBuilder from "./views/PCBuilder";


const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/armador" element={<PCBuilder />} /> 
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
};

export default App;
