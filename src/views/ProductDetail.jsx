import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { productService } from "../services/api";
import { useCart } from "../hooks/useCart.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import "./ProductDetail.css";


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Cargar producto del backend
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

  // Mostrar estado de carga
  if (loading) {
    return (
      <main className="pd container">
        <div className="pd__loading">
          <h1>Cargando producto...</h1>
        </div>
      </main>
    );
  }

  // Si no se encuentra el producto, mostrar error
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

  // Mapear datos del backend
  const productData = {
    id: product.id,
    nombre: product.name,
    detalle: product.description || product.detail || '',
    categoria: product.category?.description || 'Sin categoría',
    marca: product.brand?.name || 'Sin marca',
    precio: product.price || 0,
    descripcion: product.description || '',
    especificaciones: product.specifications || [],
    stock: product.stock || 0,
    images: product.images || []
  };

  // Generar imágenes para la galería
  const images = productData.images.length > 0 
    ? productData.images.map(img => img.url)
    : ['https://via.placeholder.com/500x500?text=Sin+Imagen'];
  
  // Si solo hay una imagen, duplicarla para la galería
  while (images.length < 4) {
    images.push(images[0]);
  }

  // Función para agregar al carrito
  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      setAddingToCart(true);
      const result = await addToCart(productData.id, quantity);
      
      if (result.success) {
        alert(`Se agregaron ${quantity} unidad(es) al carrito`);
        setQuantity(1); // Resetear cantidad
      } else {
        alert(result.error || 'Error al agregar al carrito');
      }
    } catch (err) {
      alert('Error al agregar al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <main className="pd container">
      {/* migas */}
      <div className="pd__breadcrumbs">
        <Link to="/productos">Productos</Link>
        <span>/</span>
        <span>{productData.categoria}</span>
      </div>

      <div className="pd__grid">
        {/* Galería */}
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

        {/* Info */}
        <section className="pd__info">
          <header className="pd__header">
            <h1 className="pd__title">{productData.nombre}</h1>
            <p className="pd__model">{productData.detalle}</p>
          </header>

          <div className="pd__price">${productData.precio.toFixed(2)}</div>
          
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
            <button className="btn btn--ghost" title="Favoritos">♡</button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
