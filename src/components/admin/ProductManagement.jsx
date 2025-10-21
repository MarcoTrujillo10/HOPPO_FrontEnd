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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    brandId: '',
    discount: 0
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
        productService.getProducts(),
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
      ...formData,
      price: Number(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
      categoryId: parseInt(formData.categoryId, 10),
      brandId: parseInt(formData.brandId, 10),
      discount: parseInt(formData.discount, 10) || 0,
      imageUrls
    };

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
    alert('Error al guardar el producto');
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
      discount: product.discount || 0
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      brandId: '',
      discount: 0
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
        {products.map(product => (
          <div key={product.id} className="product-card">
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
              <p className="product-price">{formatPrice(product.price)}</p>
              {product.discount > 0 && (
                <p className="product-discount">Descuento: {product.discount}%</p>
              )}
              <p className="product-stock">Stock: {product.stock}</p>
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
