import { useState, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext.jsx';
import './AdminComponents.css';
const ImageUpload = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  console.log('ImageUpload render - images:', images, 'onImagesChange:', typeof onImagesChange);
  const handleFileSelect = (files) => {
    console.log('handleFileSelect called with files:', files);
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    console.log('Filtered image files:', imageFiles);
    
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
    console.log('New image URLs:', newImageUrls);
    console.log('Current images:', images);
    console.log('Combined images:', [...images, ...newImageUrls]);
    onImagesChange([...images, ...newImageUrls]);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
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
      <p className="form-help">
        Puedes subir hasta {maxImages} imágenes. Arrastra y suelta o haz clic para seleccionar.
      </p>
      
      <div className="image-upload-area">
        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <div className="drop-zone-content">
            <div className="drop-zone-icon">📷</div>
            <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
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
      <div className="image-upload-info">
        <p><strong>Consejos:</strong></p>
        <ul>
          <li>Usa imágenes de alta calidad (mínimo 800x600px)</li>
          <li>El formato JPG es recomendado para fotos</li>
          <li>PNG es mejor para imágenes con transparencia</li>
          <li>La primera imagen será la imagen principal del producto</li>
        </ul>
      </div>
    </div>
  );
};
export default ImageUpload;
