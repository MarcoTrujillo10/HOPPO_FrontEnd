import { useState, useEffect } from 'react';
import { bannerService } from '../../services/api';
import ImageUpload from './ImageUpload';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: '',
    discount: '',
    link: '',
    image: null,
    isActive: true,
    order: 0
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerService.getBanners();
      setBanners(response.data);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, formData);
      } else {
        await bannerService.createBanner(formData);
      }
      setShowForm(false);
      setEditingBanner(null);
      resetForm();
      loadBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      price: banner.price,
      discount: banner.discount,
      link: banner.link,
      image: null,
      isActive: banner.isActive,
      order: banner.order
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este banner?')) {
      try {
        await bannerService.deleteBanner(id);
        loadBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      price: '',
      discount: '',
      link: '',
      image: null,
      isActive: true,
      order: 0
    });
  };

  if (loading) return <div>Cargando banners...</div>;

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2>Gestión de Banners</h2>
        <button 
          className="btn btn--primary"
          onClick={() => {
            resetForm();
            setEditingBanner(null);
            setShowForm(true);
          }}
        >
          Nuevo Banner
        </button>
      </div>

      {showForm && (
        <div className="admin-form">
          <h3>{editingBanner ? 'Editar Banner' : 'Nuevo Banner'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Subtítulo</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="$1,599"
                />
              </div>

              <div className="form-group">
                <label>Descuento</label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  placeholder="20% OFF"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Enlace</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                placeholder="/productos/pc-gamer"
              />
            </div>

            <div className="form-group">
              <label>Imagen</label>
              <ImageUpload
                onImageSelect={(image) => setFormData({...formData, image})}
                currentImage={editingBanner?.imageUrl}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Orden</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Activo
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                {editingBanner ? 'Actualizar' : 'Crear'} Banner
              </button>
              <button 
                type="button" 
                className="btn btn--secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Orden</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title}
                    style={{width: '50px', height: '30px', objectFit: 'cover'}}
                  />
                </td>
                <td>{banner.title}</td>
                <td>{banner.price}</td>
                <td>{banner.discount}</td>
                <td>{banner.order}</td>
                <td>
                  <span className={`status ${banner.isActive ? 'active' : 'inactive'}`}>
                    {banner.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn--small btn--secondary"
                    onClick={() => handleEdit(banner)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn--small btn--danger"
                    onClick={() => handleDelete(banner.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerManagement;
