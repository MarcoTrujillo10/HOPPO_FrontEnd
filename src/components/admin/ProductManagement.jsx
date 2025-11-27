import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUploadSimple from "./ImageUploadSimple";
import "./AdminComponents.css";
import {
  fetchAdminProducts,
  fetchAdminMetadata,
  fetchCarouselCount,
  checkProductInCarousel,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  toggleProductInCarousel,
  uploadProductImages,
  setFormData,
  resetFormData,
  setProductImages,
  setEditingProduct,
  setShowForm,
  setStatus,
  selectAdminProducts,
  selectAdminCategories,
  selectAdminBrands,
  selectAdminFormData,
  selectAdminProductImages,
  selectEditingProduct,
  selectShowForm,
  selectIsInCarousel,
  selectCarouselCount,
  selectAdminStatus,
  selectAdminLoading,
} from "../../redux/adminProductsSlice";
import { fetchCatalogProducts } from "../../redux/catalogSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAdminProducts);
  const categories = useSelector(selectAdminCategories);
  const brands = useSelector(selectAdminBrands);
  const formData = useSelector(selectAdminFormData);
  const productImages = useSelector(selectAdminProductImages);
  const editingProduct = useSelector(selectEditingProduct);
  const showForm = useSelector(selectShowForm);
  const isInCarousel = useSelector(selectIsInCarousel);
  const carouselCount = useSelector(selectCarouselCount);
  const status = useSelector(selectAdminStatus);
  const loading = useSelector(selectAdminLoading);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminMetadata());
    dispatch(fetchCarouselCount());
  }, [dispatch]);

  const handleFormDataChange = (field, value) => {
    dispatch(setFormData({ [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      dispatch(
        setStatus({ type: "error", message: "El nombre del producto es requerido" })
      );
      return;
    }
    if (!formData.price || formData.price <= 0) {
      dispatch(
        setStatus({ type: "error", message: "El precio debe ser mayor a 0" })
      );
      return;
    }
    if (!formData.categoryId) {
      dispatch(
        setStatus({ type: "error", message: "Debe seleccionar una categoría" })
      );
      return;
    }
    if (!formData.brandId) {
      dispatch(
        setStatus({ type: "error", message: "Debe seleccionar una marca" })
      );
      return;
    }

    try {
      const imgs = Array.isArray(productImages) ? productImages : [];
      const newFiles = imgs
        .filter((img) => img?.isNew && img?.file instanceof File)
        .map((img) => img.file);
      const existingUrls = imgs
        .filter((img) => !img?.isNew)
        .map((img) => img.url || img.imageUrl)
        .filter(Boolean);

      let uploadedUrls = [];
      if (newFiles.length > 0) {
        const uploadResult = await dispatch(uploadProductImages(newFiles));
        if (uploadProductImages.fulfilled.match(uploadResult)) {
          uploadedUrls = uploadResult.payload;
        } else {
          dispatch(
            setStatus({
              type: "error",
              message: "Error al subir imágenes",
            })
          );
          return;
        }
      }

      const imageUrls = [...existingUrls, ...uploadedUrls];

      const productData = {
        ...formData,
        price: Number(formData.price) || 0,
        stock: parseInt(formData.stock, 10) || 0,
        categoryId: parseInt(formData.categoryId, 10),
        brandId: parseInt(formData.brandId, 10),
        discount: parseInt(formData.discount, 10) || 0,
        imageUrls,
      };

      if (editingProduct?.id) {
        await dispatch(
          updateAdminProduct({ productId: editingProduct.id, productData })
        ).unwrap();
      } else {
        await dispatch(createAdminProduct(productData)).unwrap();
      }

      dispatch(resetFormData());
      dispatch(fetchCatalogProducts({}));
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = async (product) => {
    dispatch(setEditingProduct(product));
    const checkResult = await dispatch(checkProductInCarousel(product.id));
    if (checkProductInCarousel.fulfilled.match(checkResult)) {
      dispatch(fetchCarouselCount());
    }
  };

  const requestDelete = (productId) => {
    setPendingDeleteId(productId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await dispatch(deleteAdminProduct(pendingDeleteId)).unwrap();
      dispatch(fetchCatalogProducts({}));
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  const handleCarouselToggle = async (e) => {
    const checked = e.target.checked;
    if (!editingProduct?.id) return;

    try {
      await dispatch(
        toggleProductInCarousel({
          productId: editingProduct.id,
          add: checked,
        })
      ).unwrap();
    } catch (error) {
      e.target.checked = !checked;
    }
  };

  const resetForm = () => {
    dispatch(resetFormData());
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  if (loading && products.length === 0) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="product-management">
      <div className="section-header">
        <h2>📦 Gestión de Productos</h2>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(setShowForm(true))}
        >
          ➕ Agregar Producto
        </button>
      </div>

      {status.message && (
        <div className={`status-banner ${status.type}`}>{status.message}</div>
      )}

      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <div className="form-header">
              <h3>
                {editingProduct ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
              </h3>
              <button className="close-btn" onClick={resetForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Producto</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormDataChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      handleFormDataChange("price", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      handleFormDataChange("stock", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descuento (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) =>
                      handleFormDataChange("discount", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      handleFormDataChange("categoryId", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marca</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) =>
                      handleFormDataChange("brandId", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleccionar marca</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleFormDataChange("description", e.target.value)
                  }
                  rows="3"
                  required
                />
              </div>

              {editingProduct && (
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isInCarousel}
                      onChange={handleCarouselToggle}
                      disabled={carouselCount >= 5 && !isInCarousel}
                    />
                    <span>
                      Agregar al carrusel principal
                      {carouselCount >= 5 && !isInCarousel && (
                        <span
                          style={{
                            color: "#e74c3c",
                            fontSize: "0.9em",
                            marginLeft: "8px",
                          }}
                        >
                          (Máximo 5 productos - {carouselCount}/5)
                        </span>
                      )}
                      {isInCarousel && (
                        <span
                          style={{
                            color: "#27ae60",
                            fontSize: "0.9em",
                            marginLeft: "8px",
                          }}
                        >
                          ✓ En el carrusel ({carouselCount}/5)
                        </span>
                      )}
                    </span>
                  </label>
                  <p
                    className="form-help"
                    style={{
                      marginTop: "4px",
                      fontSize: "0.85em",
                      color: "#666",
                    }}
                  >
                    El carrusel muestra hasta 5 productos destacados en la página
                    principal. Solo productos con stock e imágenes pueden
                    agregarse.
                  </p>
                </div>
              )}

              <ImageUploadSimple
                images={productImages}
                onImagesChange={(images) => dispatch(setProductImages(images))}
              />

              <div className="form-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading
                    ? "Guardando..."
                    : editingProduct
                    ? "Actualizar"
                    : "Crear"}{" "}
                  Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].imageUrl}
                  alt={product.name}
                  className="product-img"
                />
              ) : (
                <div className="product-img-placeholder">📷 Sin imagen</div>
              )}
              {product.images && product.images.length > 1 && (
                <div className="image-count-badge">
                  +{product.images.length - 1}
                </div>
              )}
            </div>

            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">{formatPrice(product.price)}</p>
              {product.discount > 0 && (
                <p className="product-discount">Descuento: {product.discount}%</p>
              )}
              <p className="product-stock">Stock: {product.stock}</p>
              <p className="product-category">
                📂 {product.category?.description || "Sin categoría"}
              </p>
              <p className="product-brand">
                🏷️ {product.brand?.name || "Sin marca"}
              </p>
              <p className="product-description">{product.description}</p>
            </div>

            <div className="product-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEdit(product)}
              >
                ✏️ Editar
              </button>
              <button
                className="btn btn-delete"
                onClick={() => requestDelete(product.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <p>No hay productos registrados.</p>
        </div>
      )}

      {confirmOpen && (
        <div className="confirm-backdrop" role="dialog" aria-modal="true">
          <div className="confirm-box">
            <p>¿Estás seguro de que quieres eliminar este producto?</p>
            <div className="confirm-actions">
              <button
                className="btn btn-danger btn-small"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
              <button
                className="btn btn-secondary btn-small"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
