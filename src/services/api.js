import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';


let navigationCallback = null;

export const setNavigationCallback = (callback) => {
  navigationCallback = callback;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
 
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    
      if (navigationCallback) {
        navigationCallback('/login');
      }
    }
    return Promise.reject(error);
  }
);
 
export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const carouselService = {
  getActiveCarousel: () => api.get('/carousel'),
  getAllCarouselItems: () => api.get('/admin/carousel'),
  addProductToCarousel: (productId) => api.post(`/admin/carousel/add/${productId}`),
  removeProductFromCarousel: (productId) => api.delete(`/admin/carousel/remove/${productId}`),
  reorderCarouselItems: (carouselItemIds) => api.put('/admin/carousel/reorder', { carouselItemIds: carouselItemIds }),
  checkProductInCarousel: (productId) => api.get(`/admin/carousel/check/${productId}`),
  getCarouselItemCount: () => api.get('/admin/carousel/count'),
};

export const categoryService = {
  getCategories: (params = {}) => api.get('/categories', { params }),
  getCategoriesByType: (type, params = {}) => api.get('/categories', { params: { ...params, type } }),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  getProductsByCategory: (categoryId, params = {}) => api.get(`/categories/${categoryId}/products`, { params }),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};
 
export const brandService = {
  getBrands: (params = {}) => api.get('/brands', { params }),
  getBrandById: (id) => api.get(`/brands/${id}`),
  createBrand: (brandData) => api.post('/brands', brandData),
  updateBrand: (id, brandData) => api.put(`/brands/${id}`, brandData),
  deleteBrand: (id) => api.delete(`/brands/${id}`),
};
 
export const cartService = {
  getMyCart: () => api.get('/carts/my-cart'),
  createCart: (cartData) => api.post('/carts', cartData),
};
 
export const cartProductService = {
  getCartProducts: (params = {}) => api.get('/cart-products', { params }),
  addToCart: (cartProductData) => api.post('/cart-products', cartProductData),
  updateCartProduct: (id, cartProductData) => api.put(`/cart-products/${id}`, cartProductData),
  removeFromCart: (id) => api.delete(`/cart-products/${id}`),
};
 
export const orderService = {
  getOrders: (params = {}) => api.get('/orders', { params }),
  getMyOrders: (params = {}) => api.get('/orders/my-orders', { params }),
  createOrder: (orderData) => api.post('/orders', orderData),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
};
 
export const authService = {
  register: (userData) => api.post('/api/v1/auth/register', userData),
  login: (credentials) => api.post('/api/v1/auth/authenticate', credentials),
  getProfile: () => api.get('/users/myuser'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
 
export const uploadService = {
  uploadImages: async (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    const res = await api.post('/uploads', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const urls = (res.data?.urls || []).map((u) => `${API_BASE_URL}${u}`);
    return urls;
  },
};
 
export const paymentService = {
  processPayment: (paymentData) => api.post('/payments/process', paymentData),
};
 
export const bannerService = {
  getBanners: (params = {}) => api.get('/banners', { params }),
  getActiveBanners: () => api.get('/banners', { params: { active: true } }),
  getBannerById: (id) => api.get(`/banners/${id}`),
  createBanner: (bannerData) => api.post('/banners', bannerData),
  updateBanner: (id, bannerData) => api.put(`/banners/${id}`, bannerData),
  deleteBanner: (id) => api.delete(`/banners/${id}`),
  updateBannerOrder: (bannerIds) => api.patch('/banners/reorder', { bannerIds }),
};
 
export default api;