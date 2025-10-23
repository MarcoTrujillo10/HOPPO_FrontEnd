import { useState, useEffect } from 'react';
import { brandService } from '../../services/api';
import './AdminComponents.css';
const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: ''
  });
  useEffect(() => {
    loadBrands();
  }, []);
  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await brandService.getBrands();
      setBrands(response.data || []);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, formData);
      } else {
        await brandService.createBrand(formData);
      }
      await loadBrands();
      resetForm();
      alert(editingBrand ? 'Marca actualizada exitosamente' : 'Marca creada exitosamente');
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('Error al guardar la marca');
    }
  };
  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name
    });
    setShowForm(true);
  };
  const handleDelete = async (brandId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta marca?')) {
      try {
        await brandService.deleteBrand(brandId);
        await loadBrands();
        alert('Marca eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Error al eliminar la marca');
      }
    }
  };
  const resetForm = () => {
    setFormData({ name: '' });
    setEditingBrand(null);
    setShowForm(false);
  };
  if (loading) {
    return <div className="loading">Cargando marcas...</div>;
  }
  return (
    <div className="brand-management">
      <div className="section-header">
        <h2>🏷️ Gestión de Marcas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Agregar Marca
        </button>
      </div>
      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <div className="form-header">
              <h3>{editingBrand ? '✏️ Editar Marca' : '➕ Nueva Marca'}</h3>
              <button className="close-btn" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="brand-form">
              <div className="form-group">
                <label>Nombre de la Marca</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Intel, AMD, NVIDIA..."
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBrand ? 'Actualizar' : 'Crear'} Marca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="brands-grid">
        {brands.map(brand => (
          <div key={brand.id} className="brand-card">
            <div className="brand-info">
              <h3>🏷️ {brand.name}</h3>
              <p>ID: {brand.id}</p>
            </div>
            
            <div className="brand-actions">
              <button 
                className="btn btn-edit"
                onClick={() => handleEdit(brand)}
              >
                ✏️ Editar
              </button>
              <button 
                className="btn btn-delete"
                onClick={() => handleDelete(brand.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      {brands.length === 0 && (
        <div className="empty-state">
          <p>No hay marcas registradas.</p>
        </div>
      )}
    </div>
  );
};
export default BrandManagement;
