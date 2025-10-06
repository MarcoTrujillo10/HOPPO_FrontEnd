import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./views/Home";
import Contact from "./views/Contact";
import ProductList from "./views/ProductList";
import ProductDetail from "./views/ProductDetail";


const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
};

export default App;
