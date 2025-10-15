import { useState, useEffect, createContext, useContext } from 'react';
import { cartService, cartProductService } from '../services/api';

// Crear contexto del carrito
const CartContext = createContext();

// Hook para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Provider del carrito
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar carrito activo del usuario
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar obtener el carrito activo
      const cartResponse = await cartService.getMyCart();
      
      if (cartResponse.data) {
        setCart(cartResponse.data);
      } else {
        setCart(null);
      }
      
      // Siempre cargar productos del carrito (puede que no haya carrito pero sí productos)
      await loadCartProducts();
    } catch (err) {
      console.error('Error cargando carrito:', err);
      // Si no hay carrito activo, no es un error
      if (err.response?.status !== 404) {
        setError('Error al cargar el carrito');
      }
      setCart(null);
      setCartProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos del carrito
  const loadCartProducts = async () => {
    try {
      const response = await cartProductService.getCartProducts();
      setCartProducts(response.data || []);
    } catch (err) {
      console.error('Error cargando productos del carrito:', err);
      setError('Error al cargar productos del carrito');
      setCartProducts([]);
    }
  };

  // Crear nuevo carrito si no existe
  const createCart = async () => {
    try {
      const response = await cartService.createCart({});
      setCart(response.data);
      return response.data;
    } catch (err) {
      console.error('Error creando carrito:', err);
      setError('Error al crear carrito');
      throw err;
    }
  };

  // Agregar producto al carrito
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar si el producto ya está en el carrito
      const existingProduct = cartProducts.find(cp => cp.product.id === productId);
      
      if (existingProduct) {
        // Actualizar cantidad del producto existente
        return await updateCartProduct(existingProduct.id, existingProduct.quantity + quantity);
      } else {
        // Agregar nuevo producto al carrito (el backend creará el carrito si no existe)
        const cartProductData = {
          productId: productId,
          quantity: quantity
        };

        const response = await cartProductService.addToCart(cartProductData);
        
        // Recargar carrito y productos
        await loadCart();
        
        return {
          success: true,
          message: `Se agregaron ${quantity} unidad(es) al carrito`,
          data: response.data
        };
      }
    } catch (err) {
      console.error('Error agregando al carrito:', err);
      const errorMessage = err.response?.data?.message || 'Error al agregar producto al carrito';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar cantidad de producto en el carrito
  const updateCartProduct = async (cartProductId, newQuantity) => {
    try {
      setLoading(true);
      setError(null);

      if (newQuantity <= 0) {
        // Si la cantidad es 0 o menor, eliminar el producto
        return await removeFromCart(cartProductId);
      }

      const cartProductData = {
        quantity: newQuantity
      };

      await cartProductService.updateCartProduct(cartProductId, cartProductData);
      
      // Recargar productos del carrito
      await loadCartProducts();
      
      return {
        success: true,
        message: 'Cantidad actualizada',
        data: cartProductData
      };
    } catch (err) {
      console.error('Error actualizando producto del carrito:', err);
      const errorMessage = err.response?.data?.message || 'Error al actualizar producto';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (cartProductId) => {
    try {
      setLoading(true);
      setError(null);

      await cartProductService.removeFromCart(cartProductId);
      
      // Recargar productos del carrito
      await loadCartProducts();
      
      return {
        success: true,
        message: 'Producto eliminado del carrito'
      };
    } catch (err) {
      console.error('Error eliminando producto del carrito:', err);
      const errorMessage = err.response?.data?.message || 'Error al eliminar producto';
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Extender expiración del carrito
  const extendCartExpiration = async () => {
    try {
      await cartService.extendCartExpiration();
      await loadCart(); // Recargar carrito con nueva expiración
      return {
        success: true,
        message: 'Expiración del carrito extendida por 24 horas'
      };
    } catch (err) {
      console.error('Error extendiendo carrito:', err);
      return {
        success: false,
        error: 'Error al extender expiración del carrito'
      };
    }
  };

  // Limpiar carrito (eliminar todos los productos)
  const clearCart = async () => {
    try {
      setLoading(true);
      
      // Eliminar todos los productos del carrito
      const deletePromises = cartProducts.map(cp => 
        cartProductService.removeFromCart(cp.id)
      );
      
      await Promise.all(deletePromises);
      
      // Recargar productos del carrito
      await loadCartProducts();
      
      return {
        success: true,
        message: 'Carrito limpiado'
      };
    } catch (err) {
      console.error('Error limpiando carrito:', err);
      return {
        success: false,
        error: 'Error al limpiar carrito'
      };
    } finally {
      setLoading(false);
    }
  };

  // Calcular totales del carrito
  const getCartTotals = () => {
    const subtotal = cartProducts.reduce((sum, cp) => {
      return sum + (cp.product.price * cp.quantity);
    }, 0);

    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.21; // 21% IVA
    const total = subtotal + shipping + tax;

    return {
      subtotal,
      shipping,
      tax,
      total,
      itemCount: cartProducts.reduce((sum, cp) => sum + cp.quantity, 0)
    };
  };

  // Cargar carrito al montar el componente
  useEffect(() => {
    loadCart();
  }, []);

  const value = {
    cart,
    cartProducts,
    loading,
    error,
    loadCart,
    addToCart,
    updateCartProduct,
    removeFromCart,
    extendCartExpiration,
    clearCart,
    getCartTotals,
    // Utilidades
    isCartEmpty: cartProducts.length === 0,
    hasItems: cartProducts.length > 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
