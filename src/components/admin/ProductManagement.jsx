import { useState, useEffect } from 'react';
import { productService, categoryService, brandService, uploadService } from '../../services/api';
import ImageUploadSimple from './ImageUploadSimple';
import './AdminComponents.css';
 
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    brandId: '',
    discount: 0,
    showInCarousel: false
  });
  const [productImages, setProductImages] = useState([]);
 
  useEffect(() => {
    loadData();
  }, []);
 
  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
        brandService.getBrands()
      ]);
      setProducts(productsRes.data.content || productsRes.data || []);
      setCategories(categoriesRes.data.content || categoriesRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setStatus({ type: 'error', message: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'El nombre del producto es requerido' });
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setStatus({ type: 'error', message: 'El precio debe ser mayor a 0' });
      return;
    }
    if (!formData.categoryId) {
      setStatus({ type: 'error', message: 'Debe seleccionar una categoría' });
      return;
    }
    if (!formData.brandId) {
      setStatus({ type: 'error', message: 'Debe seleccionar una marca' });
      return;
    }
    
    try {
      const imgs = Array.isArray(productImages) ? productImages : [];
      const newFiles = imgs
        .filter(img => img?.isNew && img?.file instanceof File)
        .map(img => img.file);
      const existingUrls = imgs
        .filter(img => !img?.isNew)
        .map(img => img.url || img.imageUrl)
        .filter(Boolean);
 
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        uploadedUrls = await uploadService.uploadImages(newFiles);
      }
 
      const imageUrls = [...existingUrls, ...uploadedUrls];
 
      const productData = {
        ...formData,
        price: Number(formData.price) || 0,
        stock: parseInt(formData.stock, 10) || 0,
        categoryId: parseInt(formData.categoryId, 10),
        brandId: parseInt(formData.brandId, 10),
        discount: parseInt(formData.discount, 10) || 0,
        showInCarousel: formData.showInCarousel || false,
        imageUrls
      };
 
      if (editingProduct?.id) {
        await productService.updateProduct(editingProduct.id, productData);
        setStatus({ type: 'success', message: 'Producto actualizado exitosamente' });
      } else {
        await productService.createProduct(productData);
        setStatus({ type: 'success', message: 'Producto creado exitosamente' });
      }
 
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      console.error('Error response:', error.response?.data);
      console.error('Product data being sent:', productData);
      
      let errorMessage = 'Error al guardar el producto';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setStatus({ type: 'error', message: errorMessage });
    }
  };
 
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.category?.id || '',
      brandId: product.brand?.id || '',
      discount: product.discount || 0,
      showInCarousel: product.showInCarousel || false
    });
 
    if (product.images && product.images.length > 0) {
      const existingImages = product.images.map(img => ({
        url: img.imageUrl,
        name: 'Imagen existente',
        isNew: false
      }));
      setProductImages(existingImages);
    } else {
      setProductImages([]);
    }
 
    setShowForm(true);
  };
 
  const requestDelete = (productId) => {
    setPendingDeleteId(productId);
    setConfirmOpen(true);
  };
 
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await productService.deleteProduct(pendingDeleteId);
      await loadData();
      setStatus({ type: 'success', message: 'Producto eliminado exitosamente' });
    } catch (error) {
      console.error('Error deleting product:', error);
      setStatus({ type: 'error', message: 'Error al eliminar el producto' });
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };
 
  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };
 
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      brandId: '',
      discount: 0,
      showInCarousel: false
    });
    setProductImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };
 
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };
 
  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }
 
  return (
    <div className="product-management">
      <div className="section-header">
        <h2>📦 Gestión de Productos</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Agregar Producto
        </button>
      </div>
 
      {status.message && (
        <div className={`status-banner ${status.type}`}>
          {status.message}
        </div>
      )}
 
      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <div className="form-header">
              <h3>{editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
              <button className="close-btn" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>
 
              <div className="form-row">
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descuento (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                </div>
              </div>
 
              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.description}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marca</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar marca</option>
                    {brands.map(brand => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
              </div>
 
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  required
                />
              </div>
 
              <ImageUploadSimple
                images={productImages}
                onImagesChange={setProductImages}
              />

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.showInCarousel}
                    onChange={(e) => setFormData({ ...formData, showInCarousel: e.target.checked })}
                  />
                  <span>Mostrar en carrusel principal</span>
                </label>
                <p className="form-help">
                  Los productos marcados aparecerán en el carrusel de la página principal
                </p>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].imageUrl}
                  alt={product.name}
                  className="product-img"
                />
              ) : (
                <div className="product-img-placeholder">
                  📷 Sin imagen
                </div>
              )}
              {product.images && product.images.length > 1 && (
                <div className="image-count-badge">
                  +{product.images.length - 1}
                </div>
              )}
            </div>
 
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">{formatPrice(product.price)}</p>
              {product.discount > 0 && (
                <p className="product-discount">Descuento: {product.discount}%</p>
              )}
              <p className="product-stock">Stock: {product.stock}</p>
              <p className="product-category">📂 {product.category?.description || 'Sin categoría'}</p>
              <p className="product-brand">🏷️ {product.brand?.name || 'Sin marca'}</p>
              {product.showInCarousel && (
                <p className="carousel-badge">🎠 En carrusel</p>
              )}
              <p className="product-description">{product.description}</p>
            </div>
 
            <div className="product-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEdit(product)}
              >
                ✏️ Editar
              </button>
              <button
                className="btn btn-delete"
                onClick={() => requestDelete(product.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
 
      {products.length === 0 && (
        <div className="empty-state">
          <p>No hay productos registrados.</p>
        </div>
      )}
 
      {confirmOpen && (
        <div className="confirm-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-box">
            <p>¿Estás seguro de que quieres eliminar este producto?</p>
            <div className="confirm-actions">
              <button className="btn btn-danger btn-small" onClick={confirmDelete}>Eliminar</button>
              <button className="btn btn-secondary btn-small" onClick={cancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ProductManagement;