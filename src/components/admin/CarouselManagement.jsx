import { useState, useEffect } from 'react';
import { carouselService, productService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import './AdminComponents.css';

const CarouselManagement = () => {
  const { user } = useAuth();
  const [carouselItems, setCarouselItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    displayOrder: 1,
    isActive: true,
    customTitle: '',
    customSubtitle: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [carouselResponse, productsResponse] = await Promise.all([
        carouselService.getAllCarouselItems(),
        productService.getProducts({ page: 0, size: 10000 })
      ]);
      
      console.log('Carousel response:', carouselResponse);
      console.log('Products response:', productsResponse);
      console.log('Products response data:', productsResponse?.data);
      console.log('Products response data type:', typeof productsResponse?.data);
      
      setCarouselItems(carouselResponse.data || []);
      
      // Manejar diferentes formatos de respuesta de la API
      let productsList = [];
      const responseData = productsResponse?.data;
      
      if (responseData) {
        // Si es una página de Spring (tiene content)
        if (responseData.content && Array.isArray(responseData.content)) {
          productsList = responseData.content;
          console.log('Found products in content array:', productsList.length);
        } 
        // Si es un array directo
        else if (Array.isArray(responseData)) {
          productsList = responseData;
          console.log('Found products as direct array:', productsList.length);
        }
        // Si es un objeto con otras propiedades, intentar acceder directamente
        else if (responseData.products && Array.isArray(responseData.products)) {
          productsList = responseData.products;
          console.log('Found products in products property:', productsList.length);
        } else {
          console.warn('Unknown response format:', responseData);
        }
      }
      
      console.log('Final products list:', productsList);
      console.log('Final products count:', productsList.length);
      
      // Log algunos productos para debug
      if (productsList.length > 0) {
        console.log('Sample product:', productsList[0]);
        console.log('Sample product images:', productsList[0]?.images);
      }
      
      setProducts(productsList);
    } catch (error) {
      console.error('Error loading data:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Error al cargar los datos';
      
      if (error.response?.status === 403) {
        errorMessage = 'Acceso denegado. Asegúrate de estar autenticado como VENDEDOR.';
      } else if (error.response?.status === 401) {
        errorMessage = 'No estás autenticado. Por favor, inicia sesión.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus({ type: '', message: '' });

      if (editingItem) {
        await carouselService.updateCarouselItem(editingItem.id, formData);
        setStatus({ type: 'success', message: 'Item del carrusel actualizado exitosamente' });
      } else {
        await carouselService.createCarouselItem(formData);
        setStatus({ type: 'success', message: 'Item del carrusel creado exitosamente' });
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving carousel item:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al guardar el item del carrusel' 
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      productId: item.product?.id || '',
      displayOrder: item.displayOrder || 1,
      isActive: item.isActive !== undefined ? item.isActive : true,
      customTitle: item.customTitle || '',
      customSubtitle: item.customSubtitle || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este item del carrusel?')) {
      return;
    }

    try {
      await carouselService.deleteCarouselItem(id);
      setStatus({ type: 'success', message: 'Item del carrusel eliminado exitosamente' });
      await loadData();
    } catch (error) {
      console.error('Error deleting carousel item:', error);
      setStatus({ type: 'error', message: 'Error al eliminar el item del carrusel' });
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      productId: '',
      displayOrder: 1,
      isActive: true,
      customTitle: '',
      customSubtitle: ''
    });
  };

  // Filtrar productos que tienen imágenes
  const productsWithImages = products.filter(p => {
    const hasImages = p.images && Array.isArray(p.images) && p.images.length > 0;
    const hasImageUrl = p.images && p.images[0] && p.images[0].imageUrl;
    return hasImages && hasImageUrl;
  });

  console.log('Total products:', products.length);
  console.log('Products with images:', productsWithImages.length);
  console.log('Products with images list:', productsWithImages);

  // Verificar autenticación y rol
  if (!user) {
    return (
      <div className="admin-section">
        <div style={{ padding: '20px', textAlign: 'center', color: '#e74c3c' }}>
          <h3>⚠️ No estás autenticado</h3>
          <p>Por favor, inicia sesión para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'VENDEDOR') {
    return (
      <div className="admin-section">
        <div style={{ padding: '20px', textAlign: 'center', color: '#e74c3c' }}>
          <h3>⚠️ Acceso Denegado</h3>
          <p>Solo los vendedores pueden gestionar el carrusel.</p>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
            Tu rol actual: <strong>{user.role}</strong>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="admin-section">
      <h2>🎠 Gestión del Carrusel Principal</h2>
      
      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.message}
        </div>
      )}

      <div className="admin-form-container">
        <form onSubmit={handleSubmit} className="admin-form">
          <h3>{editingItem ? 'Editar Item del Carrusel' : 'Agregar Item al Carrusel'}</h3>

          <div className="form-group">
            <label>Producto *</label>
            {products.length === 0 ? (
              <div style={{ padding: '15px', border: '1px solid #e74c3c', borderRadius: '4px', backgroundColor: '#fee' }}>
                <p style={{ color: '#e74c3c', marginBottom: '10px', fontWeight: 'bold' }}>
                  ⚠️ No se pudieron cargar los productos
                </p>
                <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                  Posibles causas:
                </p>
                <ul style={{ fontSize: '0.9em', color: '#666', marginLeft: '20px', marginBottom: '10px' }}>
                  <li>Error de conexión con el servidor</li>
                  <li>No hay productos en la base de datos</li>
                  <li>Problema de autenticación</li>
                </ul>
                <p style={{ fontSize: '0.85em', color: '#999', marginBottom: '10px' }}>
                  Abre la consola del navegador (F12) para ver los detalles del error.
                </p>
                <button type="button" onClick={loadData} className="btn btn--secondary">
                  🔄 Reintentar
                </button>
              </div>
            ) : productsWithImages.length === 0 ? (
              <div style={{ padding: '15px', border: '1px solid #ffa500', borderRadius: '4px', backgroundColor: '#fff8e1' }}>
                <p style={{ color: '#f57c00', marginBottom: '10px', fontWeight: 'bold' }}>
                  ⚠️ No hay productos con imágenes disponibles
                </p>
                <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                  Total de productos cargados: <strong>{products.length}</strong>
                </p>
                <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '10px' }}>
                  Para agregar productos al carrusel, primero debes:
                </p>
                <ol style={{ fontSize: '0.9em', color: '#666', marginLeft: '20px', marginBottom: '10px' }}>
                  <li>Ir a la sección "Productos"</li>
                  <li>Editar un producto</li>
                  <li>Subir al menos una imagen</li>
                  <li>Guardar el producto</li>
                </ol>
                <p style={{ fontSize: '0.85em', color: '#999' }}>
                  Los productos sin imágenes no pueden agregarse al carrusel.
                </p>
              </div>
            ) : (
              <>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', fontSize: '1em', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">-- Seleccionar producto ({productsWithImages.length} disponibles) --</option>
                  {productsWithImages.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.images?.length || 0} imagen(es)
                    </option>
                  ))}
                </select>
                <p className="form-help" style={{ marginTop: '5px' }}>
                  ✅ Se muestran {productsWithImages.length} de {products.length} productos (solo los que tienen imágenes)
                </p>
              </>
            )}
          </div>

          <div className="form-group">
            <label>Orden de Visualización *</label>
            <input
              type="number"
              min="1"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
              required
            />
            <p className="form-help">Los items se mostrarán en orden ascendente (1, 2, 3...)</p>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span>Activo (mostrar en el carrusel)</span>
            </label>
          </div>

          <div className="form-group">
            <label>Título Personalizado (opcional)</label>
            <input
              type="text"
              maxLength="255"
              value={formData.customTitle}
              onChange={(e) => setFormData({ ...formData, customTitle: e.target.value })}
              placeholder="Dejar vacío para usar el nombre del producto"
            />
          </div>

          <div className="form-group">
            <label>Subtítulo Personalizado (opcional)</label>
            <input
              type="text"
              maxLength="500"
              value={formData.customSubtitle}
              onChange={(e) => setFormData({ ...formData, customSubtitle: e.target.value })}
              placeholder="Dejar vacío para usar la descripción de la categoría"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn--primary">
              {editingItem ? 'Actualizar' : 'Agregar'}
            </button>
            {editingItem && (
              <button type="button" onClick={resetForm} className="btn btn--secondary">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-list">
        <h3>Items del Carrusel ({carouselItems.length})</h3>
        {carouselItems.length === 0 ? (
          <p className="empty-message">No hay items en el carrusel. Agrega productos para comenzar.</p>
        ) : (
          <div className="items-grid">
            {carouselItems.map((item) => {
              const product = item.product;
              const imageUrl = product?.images?.[0]?.imageUrl;
              const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
              const fullImageUrl = imageUrl?.startsWith('http') 
                ? imageUrl 
                : `${API_BASE_URL}${imageUrl}`;

              return (
                <div key={item.id} className={`item-card ${!item.isActive ? 'inactive' : ''}`}>
                  <div className="item-image">
                    {fullImageUrl ? (
                      <img src={fullImageUrl} alt={product?.name} />
                    ) : (
                      <div className="no-image">Sin imagen</div>
                    )}
                    <div className="item-order">Orden: {item.displayOrder}</div>
                    {!item.isActive && <div className="item-badge inactive-badge">Inactivo</div>}
                  </div>
                  <div className="item-info">
                    <h4>{item.customTitle || product?.name}</h4>
                    <p className="item-subtitle">{item.customSubtitle || product?.category?.description || 'Sin subtítulo'}</p>
                    <p className="item-product">Producto: {product?.name}</p>
                    <div className="item-actions">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="btn btn--small btn--primary"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="btn btn--small btn--danger"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarouselManagement;

