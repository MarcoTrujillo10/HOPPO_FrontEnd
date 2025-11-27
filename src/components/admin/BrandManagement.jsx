import { useState, useEffect } from 'react';
import { brandService } from '../../services/api';
import './AdminComponents.css';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
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
    
    if (!formData.name.trim()) {
      setStatus({ type: 'error', message: 'El nombre de la marca es requerido' });
      return;
    }
    
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, formData);
        setStatus({ type: 'success', message: 'Marca actualizada exitosamente' });
      } else {
        await brandService.createBrand(formData);
        setStatus({ type: 'success', message: 'Marca creada exitosamente' });
      }
      await loadBrands();
      resetForm();
    } catch (error) {
      console.error('Error saving brand:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al guardar la marca' 
      });
    }
  };
  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name
    });
    setShowForm(true);
  };
  const requestDelete = (brandId) => {
    setPendingDeleteId(brandId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    
    try {
      await brandService.deleteBrand(pendingDeleteId);
      await loadBrands();
      setStatus({ type: 'success', message: 'Marca eliminada exitosamente' });
    } catch (error) {
      console.error('Error deleting brand:', error);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al eliminar la marca' 
      });
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };
  const resetForm = () => {
    setFormData({ name: '' });
    setEditingBrand(null);
    setShowForm(false);
    setStatus({ type: '', message: '' });
  };
  if (loading) {
    return <div className="loading">Cargando marcas...</div>;
  }
  return (
    <div className="brand-management">
      <div className="section-header">
        <h2>Gestión de Marcas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Agregar Marca
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
              <h3>{editingBrand ? 'Editar Marca' : 'Nueva Marca'}</h3>
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
                 Editar
              </button>
              <button 
                className="btn btn-delete"
                onClick={() => requestDelete(brand.id)}
              >
                 Eliminar
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

      {confirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>¿Estás seguro de que quieres eliminar esta marca?</p>
            <p className="warning-text">
              Esta acción no se puede deshacer y puede afectar productos existentes.
            </p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={cancelDelete}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmDelete}
              >
                 Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagement;
