import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8081';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de Productos
export const productService = {
  // Obtener todos los productos con filtros opcionales
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },

  // Obtener producto por ID
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },

  // Crear producto (requiere autenticación de vendedor)
  createProduct: (productData) => {
    return api.post('/products', productData);
  },

  // Actualizar producto (requiere autenticación de vendedor)
  updateProduct: (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },

  // Eliminar producto (requiere autenticación de vendedor)
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  },
};

// Servicios de Categorías
export const categoryService = {
  // Obtener todas las categorías
  getCategories: (params = {}) => {
    return api.get('/categories', { params });
  },

  // Obtener categorías por tipo
  getCategoriesByType: (type, params = {}) => {
    return api.get('/categories', { params: { ...params, type } });
  },

  // Obtener categoría por ID
  getCategoryById: (id) => {
    return api.get(`/categories/${id}`);
  },

  // Obtener productos por categoría
  getProductsByCategory: (categoryId, params = {}) => {
    return api.get(`/categories/${categoryId}/products`, { params });
  },

  // Crear categoría (requiere autenticación de vendedor)
  createCategory: (categoryData) => {
    return api.post('/categories', categoryData);
  },

  // Actualizar categoría (requiere autenticación de vendedor)
  updateCategory: (id, categoryData) => {
    return api.put(`/categories/${id}`, categoryData);
  },

  // Eliminar categoría (requiere autenticación de vendedor)
  deleteCategory: (id) => {
    return api.delete(`/categories/${id}`);
  },
};

// Servicios de Marcas
export const brandService = {
  // Obtener todas las marcas
  getBrands: (params = {}) => {
    return api.get('/brands', { params });
  },

  // Obtener marca por ID
  getBrandById: (id) => {
    return api.get(`/brands/${id}`);
  },

  // Crear marca (requiere autenticación de vendedor)
  createBrand: (brandData) => {
    return api.post('/brands', brandData);
  },

  // Actualizar marca (requiere autenticación de vendedor)
  updateBrand: (id, brandData) => {
    return api.put(`/brands/${id}`, brandData);
  },

  // Eliminar marca (requiere autenticación de vendedor)
  deleteBrand: (id) => {
    return api.delete(`/brands/${id}`);
  },
};

// Servicios de Carrito
export const cartService = {
  // Obtener mi carrito activo
  getMyCart: () => {
    return api.get('/carts/my-cart');
  },

  // Crear nuevo carrito
  createCart: (cartData) => {
    return api.post('/carts', cartData);
  },

  // Extender expiración del carrito
  extendCartExpiration: () => {
    return api.post('/carts/my-cart/extend');
  },
};

// Servicios de Productos del Carrito
export const cartProductService = {
  // Obtener productos del carrito
  getCartProducts: (params = {}) => {
    return api.get('/cart-products', { params });
  },

  // Agregar producto al carrito
  addToCart: (cartProductData) => {
    return api.post('/cart-products', cartProductData);
  },

  // Actualizar cantidad de producto en carrito
  updateCartProduct: (id, cartProductData) => {
    return api.put(`/cart-products/${id}`, cartProductData);
  },

  // Eliminar producto del carrito
  removeFromCart: (id) => {
    return api.delete(`/cart-products/${id}`);
  },
};

// Servicios de Órdenes
export const orderService = {
  // Obtener mis órdenes
  getMyOrders: (params = {}) => {
    return api.get('/orders/my-orders', { params });
  },

  // Crear nueva orden
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  // Cancelar orden
  cancelOrder: (id) => {
    return api.patch(`/orders/${id}/cancel`);
  },

  // Actualizar orden
  updateOrder: (id, orderData) => {
    return api.put(`/orders/${id}`, orderData);
  },
};

// Servicios de Autenticación
export const authService = {
  // Registrar usuario
  register: (userData) => {
    return api.post('/api/v1/auth/register', userData);
  },

  // Iniciar sesión
  login: (credentials) => {
    return api.post('/api/v1/auth/authenticate', credentials);
  },

  // Obtener perfil del usuario autenticado
  getProfile: () => {
    return api.get('/users/myuser');
  },

  // Cerrar sesión (opcional, manejar en el frontend)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default api;
