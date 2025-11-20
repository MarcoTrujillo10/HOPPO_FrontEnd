import { useState, useEffect, createContext, useContext } from 'react';
import { cartService, cartProductService } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';
 
const CartContext = createContext();
 
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};
 
export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartResponse = await cartService.getMyCart();
      if (cartResponse.data) {
        setCart(cartResponse.data);
        const items = cartResponse.data.items || [];
        setCartProducts(items);
      } else {
        setCart(null);
        setCartProducts([]);
      }
    } catch (err) {
      console.error('Error cargando carrito:', err);
      // 403 = Forbidden (usuario no tiene rol COMPRADOR, probablemente es VENDEDOR)
      // 404 = Not Found (no hay carrito, es normal)
      if (err.response?.status !== 404 && err.response?.status !== 403) {
        setError('Error al cargar el carrito');
      }
      // Si es 403, el usuario probablemente es VENDEDOR y no necesita carrito
      setCart(null);
      setCartProducts([]);
    } finally {
      setLoading(false);
    }
  };
 
  const loadCartProducts = async () => {
    try {
      await loadCart();
    } catch (err) {
      console.error('Error cargando productos del carrito:', err);
      setError('Error al cargar productos del carrito');
      setCartProducts([]);
    }
  };
 
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
 
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);
      const existingProduct = cartProducts.find(cp => cp.product.id === productId);
      if (existingProduct) {
        return await updateCartProduct(existingProduct.id, existingProduct.quantity + quantity);
      } else {
        const cartProductData = {
          productId,
          quantity
        };
        const response = await cartProductService.addToCart(cartProductData);
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
 
  const updateCartProduct = async (cartProductId, newQuantity) => {
    try {
      setLoading(true);
      setError(null);
      if (newQuantity <= 0) {
        return await removeFromCart(cartProductId);
      }
      const cartProductData = { quantity: newQuantity };
      await cartProductService.updateCartProduct(cartProductId, cartProductData);
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
 
  const removeFromCart = async (cartProductId) => {
    try {
      setLoading(true);
      setError(null);
      await cartProductService.removeFromCart(cartProductId);
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
 
 
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Si no hay productos, ya está limpio
      if (cartProducts.length === 0) {
        setCart(null);
        setCartProducts([]);
        return {
          success: true,
          message: 'Carrito limpiado'
        };
      }
      
      // Eliminar todos los productos del carrito
      const deletePromises = cartProducts.map(cp =>
        cartProductService.removeFromCart(cp.id)
      );
      await Promise.all(deletePromises);
      
      // Recargar el carrito para sincronizar con el backend
      await loadCart();
      
      // Asegurar que el estado esté limpio
      setCartProducts([]);
      if (cart) {
        setCart({ ...cart, items: [], quantity: 0 });
      }
      
      return {
        success: true,
        message: 'Carrito limpiado'
      };
    } catch (err) {
      console.error('Error limpiando carrito:', err);
      // Aún así, intentar recargar el carrito
      await loadCart();
      return {
        success: false,
        error: 'Error al limpiar carrito'
      };
    } finally {
      setLoading(false);
    }
  };
 
  const getCartTotals = () => {
    const subtotal = cartProducts.reduce((sum, cp) => {
      const price = cp.product.discountedPrice || cp.product.price;
      return sum + price * cp.quantity;
    }, 0);
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.21;
    const total = subtotal + shipping + tax;
    const itemCount = cartProducts.reduce((sum, cp) => sum + cp.quantity, 0);
    return { subtotal, shipping, tax, total, itemCount };
  };
 
  const getCartTotal = () => {
    if (cart && cart.totalPrice !== undefined) {
      return cart.totalPrice;
    }
    const totals = getCartTotals();
    return totals.total;
  };
 
  useEffect(() => {
    if (token) {
      loadCart();
    } else {
      setCart(null);
      setCartProducts([]);
    }
  }, [token]);
 
  const value = {
    cart,
    cartProducts,
    loading,
    error,
    loadCart,
    addToCart,
    updateCartProduct,
    removeFromCart,
    clearCart,
    getCartTotals,
    getCartTotal,
    isCartEmpty: () => cartProducts.length === 0,
    hasItems: cartProducts.length > 0
  };
 
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};