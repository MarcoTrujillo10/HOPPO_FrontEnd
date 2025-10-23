import { useState, useEffect } from 'react';
import { productService, categoryService, brandService, uploadService } from '../../services/api';
import ImageUploadTest from './ImageUploadTest';
import './AdminComponents.css';
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
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
  console.log('ProductManagement render - productImages:', productImages);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        productService.getProducts({ includeOutOfStock: true }), // Incluir productos sin stock
        categoryService.getCategories(),
        brandService.getBrands()
      ]);
      setProducts(productsRes.data.content || productsRes.data || []);
      setCategories(categoriesRes.data.content || categoriesRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validaciones básicas
  if (!formData.name.trim()) {
    alert('El nombre del producto es requerido');
    return;
  }
  
  if (!formData.price || Number(formData.price) <= 0) {
    alert('El precio debe ser mayor a 0');
    return;
  }
  
  if (!formData.categoryId) {
    alert('Debe seleccionar una categoría');
    return;
  }
  
  if (!formData.brandId) {
    alert('Debe seleccionar una marca');
    return;
  }
  
  try {
    // 1) dividir imágenes nuevas vs existentes
    const imgs = Array.isArray(productImages) ? productImages : [];
    const newFiles = imgs
      .filter(img => img?.isNew && img?.file instanceof File)
      .map(img => img.file);
    const existingUrls = imgs
      .filter(img => !img?.isNew)
      .map(img => img.url || img.imageUrl)
      .filter(Boolean);
    // 2) subir nuevas (si las hay) y obtener sus URLs
    let uploadedUrls = [];
    if (newFiles.length > 0) {
      uploadedUrls = await uploadService.uploadImages(newFiles);
    }
    // 3) unificar URLs
    const imageUrls = [...existingUrls, ...uploadedUrls];
    // 4) armar payload del producto
    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      categoryId: parseInt(formData.categoryId, 10),
      brandId: parseInt(formData.brandId, 10),
      discount: parseInt(formData.discount, 10) || 0,
      imageUrls
    };
    
    // Solo agregar showInCarousel si el backend lo soporta
    if (formData.showInCarousel !== undefined) {
      productData.showInCarousel = Boolean(formData.showInCarousel);
    }
    // 5) crear o actualizar
    if (editingProduct?.id) {
      await productService.updateProduct(editingProduct.id, productData);
    } else {
      await productService.createProduct(productData);
    }
    // 6) refrescar y limpiar
    await loadData();
    resetForm();
    alert(editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
  } catch (error) {
    console.error('Error saving product:', error);
    console.error('Error details:', error.response?.data);
    console.error('Product data being sent:', productData);
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Error al guardar el producto';
    
    alert(`Error al guardar el producto: ${errorMessage}`);
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
    
    // Cargar imágenes existentes
    if (product.images && product.images.length > 0) {
      const existingImages = product.images.map(img => ({
        url: img.imageUrl,
        name: `Imagen existente`,
        isNew: false
      }));
      setProductImages(existingImages);
    } else {
      setProductImages([]);
    }
    
    setShowForm(true);
  };
  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productService.deleteProduct(productId);
        await loadData();
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleToggleCarousel = async (product) => {
    try {
      const newCarouselStatus = !product.showInCarousel;
      
      console.log(`Updating product ${product.id} carousel status to:`, newCarouselStatus);
      
      // Intentar usar el endpoint específico primero
      try {
        await productService.updateProductCarouselStatus(product.id, newCarouselStatus);
      } catch (carouselError) {
        console.log('Carousel-specific endpoint failed, trying full update:', carouselError);
        
        // Si falla, usar el endpoint completo con datos limpios
        const updatedProduct = {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.category?.id || product.categoryId,
          brandId: product.brand?.id || product.brandId,
          discount: product.discount || 0,
          showInCarousel: newCarouselStatus,
          imageUrls: product.images ? product.images.map(img => img.imageUrl) : []
        };
        
        await productService.updateProduct(product.id, updatedProduct);
      }
      
      await loadData();
      alert(`Producto ${newCarouselStatus ? 'agregado al' : 'quitado del'} carrusel`);
    } catch (error) {
      console.error('Error updating carousel status:', error);
      console.error('Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error al actualizar el estado del carrusel';
      
      alert(`Error al actualizar el estado del carrusel: ${errorMessage}`);
    }
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
        <div className="header-actions">
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={showOutOfStock}
              onChange={(e) => setShowOutOfStock(e.target.checked)}
            />
            <span>Mostrar productos sin stock</span>
          </label>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            ➕ Agregar Producto
          </button>
        </div>
      </div>
      
      <div className="products-stats">
        <p>
          Total: {products.length} productos | 
          Sin stock: {products.filter(p => p.stock === 0).length} | 
          Con stock: {products.filter(p => p.stock > 0).length}
        </p>
      </div>
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
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, brandId: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.showInCarousel}
                    onChange={(e) => setFormData({...formData, showInCarousel: e.target.checked})}
                    disabled={true}
                  />
                  <span className="checkbox-text">🎯 Mostrar en carrusel principal</span>
                </label>
                <small className="form-help">
                  ⚠️ Funcionalidad temporalmente deshabilitada hasta que el backend soporte el campo showInCarousel
                </small>
              </div>
              {/* Componente para subir imágenes */}
              <ImageUploadTest
                images={productImages}
                onImagesChange={setProductImages}
              />
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
        {products
          .filter(product => showOutOfStock || product.stock > 0)
          .map(product => (
          <div key={product.id} className={`product-card ${product.stock === 0 ? 'product-card--out-of-stock' : ''}`}>
            {/* Imagen del producto */}
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
              {product.showInCarousel && (
                <div className="carousel-badge">
                  🎯 En carrusel
                </div>
              )}
              {product.stock === 0 && (
                <div className="out-of-stock-badge">
                  ⚠️ Sin stock
                </div>
              )}
              <p className="product-price">{formatPrice(product.price)}</p>
              {product.discount > 0 && (
                <p className="product-discount">Descuento: {product.discount}%</p>
              )}
              <p className={`product-stock ${product.stock === 0 ? 'product-stock--zero' : ''}`}>
                Stock: {product.stock}
              </p>
              <p className="product-category">
                📂 {product.category?.description || 'Sin categoría'}
              </p>
              <p className="product-brand">
                🏷️ {product.brand?.name || 'Sin marca'}
              </p>
              <p className="product-description">{product.description}</p>
            </div>
            
            <div className="product-actions">
              <button 
                className={`btn ${product.showInCarousel ? 'btn-carousel-active' : 'btn-carousel'}`}
                onClick={() => handleToggleCarousel(product)}
                title="Funcionalidad temporalmente deshabilitada"
                disabled={true}
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                {product.showInCarousel ? '🎯 En carrusel' : '🎯 Agregar'}
              </button>
              <button 
                className="btn btn-edit"
                onClick={() => handleEdit(product)}
              >
                ✏️ Editar
              </button>
              <button 
                className="btn btn-delete"
                onClick={() => handleDelete(product.id)}
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
    </div>
  );
};
export default ProductManagement;
