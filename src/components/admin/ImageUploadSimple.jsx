import { useState, useRef } from 'react';
import './AdminComponents.css';
const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Por favor selecciona solo archivos de imagen');
      return;
    }
    if (images.length + imageFiles.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }
    // Convertir archivos a URLs para preview
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
    // Limpiar el input para permitir seleccionar el mismo archivo otra vez
    e.target.value = '';
  };
  return (
    <div className="image-upload-container">
      <label className="form-label">Imágenes del Producto</label>
      <p className="form-help">
        Puedes subir hasta {maxImages} imágenes. Haz clic para seleccionar archivos.
      </p>
      
      <div className="image-upload-area">
        {/* Botón simple para seleccionar archivos */}
        <div
          className="drop-zone"
          onClick={openFileDialog}
        >
          <div className="drop-zone-content">
            <div className="drop-zone-icon">📷</div>
            <p>Haz clic para seleccionar imágenes</p>
            <small>JPG, PNG, GIF hasta 5MB cada una</small>
          </div>
        </div>
        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        {/* Preview de imágenes */}
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
