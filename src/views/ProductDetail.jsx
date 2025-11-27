import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { productService } from "../services/api";
import { useCart } from "../hooks/useCart.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import "./ProductDetail.css";
const ProductDetail = () => {
<<<<<<< HEAD
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCUyn6oLUZTZoekF78Ybwyq1tSw4PPdECMn_6qGlzTcf-a3FPNZTLAa0n7p2WkEKxAiJclw94v5qq5BQ4GLb1LTblqpkzHSmgBvlnzF6gYZY3VlVOMhsCEG7sAM4RAdGq2U-tgKKGymPPz5nwXm99JcUSLYW11-2X5JVEhefMM38e53keMDu-qhbDgXPhLE0L4BQiU3p8ztTDDH76_wCjigekN7GyXP3rG8oBQEaIa3nM0w4hrFSnqzU5ot7V2Sqw-pT_hJ5_myox4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB5zy8sSs6HvceClddGnXQNWAxFK3KGvSpJ-9bIaEowDZXI5IRKIG0jj5B_pVVpRaopOs_YXWOtz0_Acbg9dJIHm4hBHOHP6aiyLn4Gjj4GiKc5EOx4pIjOLUWa8E10ul846gNoLFo44GU1loiWVaUqlhb9DSSvYq9Gqmzs25N1O7XDfc6tG5NOM97QKx8ecd85Y4g-v4MKPB50Eh1wJkO1WI6x17yC-NLvd8bPI1R_2wJp3J8nlMwSPDbqwID5tOIDUOMv4nqIFZA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD_Cwajjri_b1SvOHsRh9Jt1xv5N_xAWrDeQS4q4RTEYlg8auBXKW-n_IB22VLQGMf_8d-AH-WySZGEM-Efgk3UsldHw_ypmShMPJ7xWCgTjsgVePoT6_CWEgE2x4kR9Rjvenmyi4R6BtVltA7m4TKMySKw77zu71mx8sX3bqlRsbhCiT8c5YUWPRlUrzX1N6bMhXyVJzZMGnteIelvByrbT5xXSnlzqCQZx27IK9K9AYcwzxnJKthp0Z0v18Lsb8hrBGgIbnVDBEk",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCUyn6oLUZTZoekF78Ybwyq1tSw4PPdECMn_6qGlzTcf-a3FPNZTLAa0n7p2WkEKxAiJclw94v5qq5BQ4GLb1LTblqpkzHSmgBvlnzF6gYZY3VlVOMhsCEG7sAM4RAdGq2U-tgKKGymPPz5nwXm99JcUSLYW11-2X5JVEhefMM38e53keMDu-qhbDgXPhLE0L4BQiU3p8ztTDDH76_wCjigekN7GyXP3rG8oBQEaIa3nM0w4hrFSnqzU5ot7V2Sqw-pT_hJ5_myox4",
  ];

=======
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        setProduct(response.data);
      } catch (err) {
        console.error('Error cargando producto:', err);
        setError('Producto no encontrado');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadProduct();
    }
  }, [id]);
  if (loading) {
    return (
      <main className="pd container">
        <div className="pd__loading">
          <h1>Cargando producto...</h1>
        </div>
      </main>
    );
  }
  if (error || !product) {
    return (
      <main className="pd container">
        <div className="pd__error">
          <h1>Producto no encontrado</h1>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
          <Link to="/productos" className="btn btn--primary">
            Volver a productos
          </Link>
        </div>
      </main>
    );
  }
  const productData = {
    id: product.id,
    nombre: product.name,
    detalle: product.description || product.detail || '',
    categoria: product.category?.description || 'Sin categoría',
    marca: product.brand?.name || 'Sin marca',
    precio: product.price || 0,
    precioConDescuento: product.discountedPrice || product.price || 0,
    descuento: product.discount || 0,
    tieneDescuento: product.hasDiscount || false,
    descripcion: product.description || '',
    especificaciones: product.specifications || [],
    stock: product.stock || 0,
    images: product.images || []
  };
  const images = productData.images.length > 0 
    ? productData.images.map(img => img.imageUrl)
    : ['https://via.placeholder.com/500x500?text=Sin+Imagen'];
  
  while (images.length < 4) {
    images.push(images[0]);
  }
  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      showToast('Debes iniciar sesión para agregar productos al carrito', 'info');
      return;
    }
    try {
      setAddingToCart(true);
      const result = await addToCart(productData.id, quantity);
      
      if (result.success) {
        showToast(`Se agregaron ${quantity} unidad(es) al carrito`, 'success');
        setQuantity(1); // Resetear cantidad
      } else {
        showToast(result.error || 'Error al agregar al carrito', 'error');
      }
    } catch (err) {
      showToast('Error al agregar al carrito', 'error');
    } finally {
      setAddingToCart(false);
    }
  };
>>>>>>> origin/Bauti
  return (
    <main className="pd container">
      <div className="pd__breadcrumbs">
        <Link to="/productos">Productos</Link>
        <span>/</span>
        <span>{productData.categoria}</span>
      </div>
      <div className="pd__grid">
        <section className="pd__gallery">
          <div
            className="pd__gallery-main"
            style={{ backgroundImage: `url("${images[0]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[1]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[2]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[3]}")` }}
          />
        </section>
<<<<<<< HEAD

=======
        {/* Info */}
>>>>>>> origin/Bauti
        <section className="pd__info">
          <header className="pd__header">
            <h1 className="pd__title">{productData.nombre}</h1>
            <p className="pd__model">{productData.detalle}</p>
          </header>
          <div className="pd__pricing">
            {productData.tieneDescuento && (
              <div className="pd__discount-info">
                <span className="pd__price-original">${productData.precio.toFixed(2)}</span>
                <span className="pd__discount-badge">-{productData.descuento}%</span>
              </div>
            )}
            <div className="pd__price">${productData.precioConDescuento.toFixed(2)}</div>
          </div>
          
          {productData.stock > 0 && (
            <div className="pd__stock">
              Stock disponible: {productData.stock} unidades
            </div>
          )}
          <div className="pd__block">
            <h2 className="pd__h2">Descripción del Producto</h2>
            <p className="pd__text">
              {productData.descripcion || 'No hay descripción disponible.'}
            </p>
          </div>
          <div className="pd__block">
            <h2 className="pd__h2">Especificaciones Técnicas</h2>
            <div className="pd__specs">
              {productData.especificaciones.length > 0 ? (
                productData.especificaciones.map((spec, index) => (
                  <div key={index} className="pd__spec">
                    <p className="pd__spec-k">{spec.key || spec.clave}</p>
                    <p className="pd__spec-v">{spec.value || spec.valor}</p>
                  </div>
                ))
              ) : (
                <p>No hay especificaciones disponibles.</p>
              )}
            </div>
          </div>
          <div className="pd__actions">
            {productData.stock > 0 && (
              <div className="pd__quantity">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, Math.min(productData.stock, parseInt(e.target.value) || 1)))}
                    min="1"
                    max={productData.stock}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(productData.stock, quantity + 1))}
                    disabled={quantity >= productData.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <button 
              className="btn btn--primary"
              disabled={productData.stock === 0 || addingToCart}
              onClick={handleAddToCart}
            >
              {addingToCart ? 'Agregando...' : 
               productData.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
export default ProductDetail;
