import { useState, useRef } from 'react';
const ImageUploadTest = ({ images = [], onImagesChange }) => {
  const fileInputRef = useRef(null);
  console.log('ImageUploadTest render - images:', images);
  const handleFileSelect = (files) => {
    console.log('Files selected:', files);
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Solo archivos de imagen');
      return;
    }
    const newImages = imageFiles.map(file => ({
      file: file,
      url: URL.createObjectURL(file),
      name: file.name,
      isNew: true
    }));
    console.log('New images:', newImages);
    onImagesChange([...images, ...newImages]);
  };
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };
  return (
    <div style={{ border: '2px solid #ccc', padding: '20px', margin: '20px 0' }}>
      <h3>Test Image Upload</h3>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            handleFileSelect(e.target.files);
          }
          e.target.value = '';
        }}
        style={{ marginBottom: '10px' }}
      />
      
      <div>
        <strong>Imágenes cargadas: {images.length}</strong>
        {images.map((img, index) => (
          <div key={index} style={{ margin: '10px 0', border: '1px solid #ddd', padding: '10px' }}>
            <img src={img.url} alt={img.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <div>{img.name}</div>
            <button onClick={() => removeImage(index)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImageUploadTest;
