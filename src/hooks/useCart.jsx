import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth.jsx";
import {
  fetchCart,
  createCartThunk,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCartItems,
  resetCartState,
  calculateCartTotals,
  selectCartState,
} from "../redux/cartSlice";

const CartContext = createContext(null);

const getErrorText = (error, fallback) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  return fallback;
};
 
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
 
export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useAuth();
  const { cart, items: cartProducts, loading, error } =
    useSelector(selectCartState);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
      } else {
      dispatch(resetCartState());
      }
  }, [token, dispatch]);

  const loadCart = useCallback(async () => {
    try {
      await dispatch(fetchCart()).unwrap();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: getErrorText(err, "Error al cargar el carrito"),
      };
    }
  }, [dispatch]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
    try {
        const existingProduct = cartProducts.find(
          (cp) => cp.product?.id === productId
        );
      if (existingProduct) {
          await dispatch(
            updateCartItem({
              cartProductId: existingProduct.id,
              quantity: existingProduct.quantity + quantity,
            })
          ).unwrap();
      } else {
          await dispatch(addItemToCart({ productId, quantity })).unwrap();
        }
        return {
          success: true,
          message: `Se agregaron ${quantity} unidad(es) al carrito`,
        };
    } catch (err) {
      return {
        success: false,
          error: getErrorText(err, "Error al agregar producto al carrito"),
        };
      }
    },
    [dispatch, cartProducts]
  );

  const removeFromCart = useCallback(
    async (cartProductId) => {
    try {
        await dispatch(removeCartItem({ cartProductId })).unwrap();
      return {
        success: true,
          message: "Producto eliminado del carrito",
      };
    } catch (err) {
      return {
        success: false,
          error: getErrorText(err, "Error al eliminar producto"),
        };
    }
    },
    [dispatch]
  );
 
  const updateCartProduct = useCallback(
    async (cartProductId, newQuantity) => {
    try {
        if (newQuantity <= 0) {
          return await removeFromCart(cartProductId);
        }
        await dispatch(
          updateCartItem({ cartProductId, quantity: newQuantity })
        ).unwrap();
        return {
          success: true,
          message: "Cantidad actualizada",
          data: { quantity: newQuantity },
        };
      } catch (err) {
        return {
          success: false,
          error: getErrorText(err, "Error al actualizar producto"),
        };
      }
    },
    [dispatch, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await dispatch(clearCartItems()).unwrap();
      return {
        success: true,
        message: "Carrito limpiado",
      };
    } catch (err) {
      return {
        success: false,
        error: getErrorText(err, "Error al limpiar carrito"),
      };
    }
  }, [dispatch]);
 
  const getCartTotals = useCallback(
    () => calculateCartTotals(cartProducts),
    [cartProducts]
  );
 
  const getCartTotal = useCallback(() => {
    if (cart && cart.totalPrice !== undefined) {
      return cart.totalPrice;
    }
    return getCartTotals().total;
  }, [cart, getCartTotals]);

  const value = useMemo(
    () => ({
      cart,
      cartProducts,
      loading,
      error,
      loadCart,
      createCart: () => dispatch(createCartThunk()),
      addToCart,
      updateCartProduct,
      removeFromCart,
      clearCart,
      getCartTotals,
      getCartTotal,
      isCartEmpty: () => cartProducts.length === 0,
      hasItems: cartProducts.length > 0,
    }),
    [
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
      dispatch,
    ]
  );
 
  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};