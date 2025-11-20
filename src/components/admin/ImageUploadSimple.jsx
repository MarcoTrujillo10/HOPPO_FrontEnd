import { useState, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext.jsx';
import './AdminComponents.css';
const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      showToast('Por favor selecciona solo archivos de imagen', 'error');
      return;
    }
    
    // Validar tamaño de archivos (10MB máximo)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB en bytes
    const oversizedFiles = imageFiles.filter(file => file.size > MAX_FILE_SIZE);
    
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.name).join(', ');
      showToast(`Los siguientes archivos exceden el tamaño máximo de 10MB: ${fileNames}. Por favor, comprime las imágenes o selecciona archivos más pequeños.`, 'error', 5000);
      return;
    }
    
    if (images.length + imageFiles.length > maxImages) {
      showToast(`Máximo ${maxImages} imágenes permitidas`, 'error');
      return;
    }

    const newImageUrls = imageFiles.map(file => ({
      file: file,
      url: URL.createObjectURL(file),
      name: file.name,
      isNew: true
    }));
    onImagesChange([...images, ...newImageUrls]);
  };
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
  
    e.target.value = '';
  };
  return (
    <div className="image-upload-container">
      <label className="form-label">Imágenes del Producto</label>
      
      
      <div className="image-upload-area">
        <div
          className="drop-zone"
          onClick={openFileDialog}
        >
          <div className="drop-zone-content">
            <div className="drop-zone-icon">📷</div>
            <p>Haz clic para seleccionar imágenes</p>
            <small>JPG, PNG, GIF hasta 10MB cada una</small>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        {images.length > 0 && (
          <div className="image-preview-grid">
            {images.map((image, index) => (
              <div key={index} className="image-preview-item">
                <img 
                  src={image.url || image.imageUrl} 
                  alt={`Preview ${index + 1}`}
                  className="image-preview"
                />
                <div className="image-preview-overlay">
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    title="Eliminar imagen"
                  >
                    ✕
                  </button>
                  <div className="image-info">
                    <span className="image-name">
                      {image.name || `Imagen ${index + 1}`}
                    </span>
                    {image.isNew && (
                      <span className="new-badge">Nueva</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ImageUpload;
