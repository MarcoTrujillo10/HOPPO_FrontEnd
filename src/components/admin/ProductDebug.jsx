import { useState } from 'react';
import { productService, categoryService, brandService } from '../../services/api';

const ProductDebug = () => {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const loadBasicData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands()
      ]);
      
      setCategories(categoriesRes.data.content || categoriesRes.data || []);
      setBrands(brandsRes.data || []);
      
      setDebugData({
        success: true,
        message: 'Datos básicos cargados',
        categories: categoriesRes.data,
        brands: brandsRes.data
      });
    } catch (error) {
      console.error('Error loading basic data:', error);
      setDebugData({
        success: false,
        error: error.response?.data || error.message,
        message: 'Error al cargar datos básicos'
      });
    } finally {
      setLoading(false);
    }
  };

  const testProductCreation = async () => {
    setLoading(true);
    try {
      // Usar datos reales si están disponibles
      const categoryId = categories.length > 0 ? categories[0].id : 1;
      const brandId = brands.length > 0 ? brands[0].id : 1;
      
      const testProduct = {
        name: 'Producto Test Debug',
        description: 'Descripción de prueba para debug',
        price: 99.99,
        stock: 5,
        categoryId: categoryId,
        brandId: brandId,
        discount: 0,
        imageUrls: []
      };

      console.log('Sending test product:', testProduct);
      
      const response = await productService.createProduct(testProduct);
      console.log('Response:', response);
      
      setDebugData({
        success: true,
        data: response.data,
        message: 'Producto creado exitosamente',
        product: testProduct
      });
    } catch (error) {
      console.error('Test error:', error);
      setDebugData({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: 'Error al crear producto',
        details: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8081/products');
      const data = await response.json();
      
      setDebugData({
        success: true,
        message: 'Conexión con backend exitosa',
        status: response.status,
        data: data
      });
    } catch (error) {
      console.error('Backend connection error:', error);
      setDebugData({
        success: false,
        error: error.message,
        message: 'Error de conexión con backend',
        suggestion: 'Verifica que el backend esté corriendo en http://localhost:8081'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🔧 Debug de Productos</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testBackendConnection}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Probando...' : '🔗 Probar Conexión Backend'}
        </button>
        
        <button 
          onClick={loadBasicData}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Cargando...' : '📊 Cargar Datos Básicos'}
        </button>
        
        <button 
          onClick={testProductCreation}
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
        >
          {loading ? 'Probando...' : '➕ Probar Crear Producto'}
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>📋 Información del Sistema:</h4>
        <p><strong>Frontend:</strong> http://localhost:5179</p>
        <p><strong>Backend:</strong> http://localhost:8081</p>
        <p><strong>Categorías disponibles:</strong> {categories.length}</p>
        <p><strong>Marcas disponibles:</strong> {brands.length}</p>
      </div>

      {debugData && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: debugData.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${debugData.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px'
        }}>
          <h4>{debugData.message}</h4>
          <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProductDebug;
