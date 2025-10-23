import { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';
import './AdminComponents.css';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
 
  const [formData, setFormData] = useState({
    description: '',
    type: 'COMPONENTE'
  });
 
  useEffect(() => {
    loadCategories();
  }, []);
 
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      setCategories(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setStatus({ type: 'error', message: 'Error al cargar categorías' });
    } finally {
      setLoading(false);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        setStatus({ type: 'success', message: 'Categoría actualizada exitosamente' });
      } else {
        await categoryService.createCategory(formData);
        setStatus({ type: 'success', message: 'Categoría creada exitosamente' });
      }
      await loadCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      setStatus({ type: 'error', message: 'Error al guardar la categoría' });
    }
  };
 
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      description: category.description,
      type: category.type || 'COMPONENTE'
    });
    setShowForm(true);
  };
 
  const requestDelete = (categoryId) => {
    setPendingDeleteId(categoryId);
    setConfirmOpen(true);
  };
 
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await categoryService.deleteCategory(pendingDeleteId);
      await loadCategories();
      setStatus({ type: 'success', message: 'Categoría eliminada exitosamente' });
    } catch (error) {
      console.error('Error deleting category:', error);
      setStatus({ type: 'error', message: 'Error al eliminar la categoría' });
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
    setFormData({ description: '', type: 'COMPONENTE' });
    setEditingCategory(null);
    setShowForm(false);
  };
 
  if (loading) {
    return <div className="loading">Cargando categorías...</div>;
  }
 
  return (
    <div className="category-management">
      <div className="section-header">
        <h2>📂 Gestión de Categorías</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          ➕ Agregar Categoría
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
              <h3>{editingCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h3>
              <button className="close-btn" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label>Nombre de la Categoría</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej: Procesadores, Tarjetas Gráficas..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Tipo de Categoría</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="COMPONENTE">🔧 Componente</option>
                  <option value="PERIFERICO">🖱️ Periférico</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <div className="category-info">
              <h3>📂 {category.description}</h3>
              <p>ID: {category.id}</p>
              <span className={`category-type ${category.type?.toLowerCase()}`}>
                {category.type === 'COMPONENTE' ? '🔧 Componente' : '🖱️ Periférico'}
              </span>
            </div>
            <div className="category-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEdit(category)}
              >
                ✏️ Editar
              </button>
              <button
                className="btn btn-delete"
                onClick={() => requestDelete(category.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
 
      {categories.length === 0 && (
        <div className="empty-state">
          <p>No hay categorías registradas.</p>
        </div>
      )}
 
      {confirmOpen && (
        <div className="confirm-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-box">
            <p>¿Estás seguro de que quieres eliminar esta categoría?</p>
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
 
export default CategoryManagement;
 
 