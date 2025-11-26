import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../hooks/useCart.jsx";
import { useToast } from "../contexts/ToastContext.jsx";
import {
  selectCheckoutState,
  updateCheckoutField,
  setCheckoutErrors,
  resetCheckoutState,
  processCheckoutPayment,
} from "../redux/checkoutSlice";
import "./PaymentForm.css";

const PaymentForm = ({ onPaymentSuccess, onPaymentCancel }) => {
  const { cart, getCartTotal } = useCart();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { formData, errors, loading } = useSelector(selectCheckoutState);

  const clearFieldError = useCallback(
    (field) => {
      if (!errors[field]) return;
      const nextErrors = { ...errors };
      delete nextErrors[field];
      dispatch(setCheckoutErrors(nextErrors));
    },
    [dispatch, errors]
  );

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch(updateCheckoutField({ name, value }));
      clearFieldError(name);
    },
    [dispatch, clearFieldError]
  );

  const validateForm = () => {
    const newErrors = {};

   
    if (!formData.cardNumber || formData.cardNumber.length !== 16) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 ';
    }

    
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'El nombre del titular es obligatorio';
    }

   
    if (!formData.expiryDate || !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'La fecha debe estar en formato MM/YY';
    }

    
    if (!formData.cvv || (formData.cvv.length !== 3 && formData.cvv.length !== 4)) {
      newErrors.cvv = 'El CVV debe tener 3 o 4 dígitos';
    }

    
    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'La dirección de facturación es obligatoria';
    }

    
    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'El código postal es obligatorio';
    }

    dispatch(setCheckoutErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(
        processCheckoutPayment({ totalAmount: getCartTotal() })
      ).unwrap();

      if (result.success) {
        onPaymentSuccess(result);
        dispatch(resetCheckoutState());
      } else {
        showToast(`Error en el pago: ${result.message}`, "error");
      }
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Error procesando el pago. Inténtalo de nuevo.";
      showToast(errorMessage, "error");
      dispatch(
        setCheckoutErrors({
          ...errors,
          submit: errorMessage,
        })
      );
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "").replace(/\D/g, "");
    if (cleaned.length <= 16) {
      return cleaned;
    }
    return cleaned.substring(0, 16);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="payment-form">
        <div className="payment-form__empty">
          <h2>Carrito vacío</h2>
          <p>No hay productos en tu carrito para procesar el pago.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-form">
      <div className="payment-form__header">
        <h2>Información de Pago</h2>
        <div className="payment-form__total">
          Total: ${getCartTotal().toFixed(2)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form__form">
        <div className="payment-form__section">
          <h3>Información de la Tarjeta</h3>
          
          <div className="payment-form__field">
            <label htmlFor="cardNumber">Número de Tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => {
                dispatch(
                  updateCheckoutField({
                    name: "cardNumber",
                    value: formatCardNumber(e.target.value),
                  })
                );
                clearFieldError("cardNumber");
              }}
              placeholder="1234567890123456"
              maxLength="16"
              className={errors.cardNumber ? "error" : ""}
            />
            {errors.cardNumber && (
              <span className="error-message">{errors.cardNumber}</span>
            )}
          </div>

          <div className="payment-form__field">
            <label htmlFor="cardHolderName">Nombre del Titular</label>
            <input
              type="text"
              id="cardHolderName"
              name="cardHolderName"
              value={formData.cardHolderName}
              onChange={handleInputChange}
              placeholder="Juan Pérez"
              className={errors.cardHolderName ? 'error' : ''}
            />
            {errors.cardHolderName && <span className="error-message">{errors.cardHolderName}</span>}
          </div>

          <div className="payment-form__row">
            <div className="payment-form__field">
              <label htmlFor="expiryDate">Fecha de Expiración</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
              onChange={(e) => {
                dispatch(
                  updateCheckoutField({
                    name: "expiryDate",
                    value: formatExpiryDate(e.target.value),
                  })
                );
                clearFieldError("expiryDate");
              }}
                placeholder="MM/YY"
                maxLength="5"
              className={errors.expiryDate ? "error" : ""}
              />
            {errors.expiryDate && (
              <span className="error-message">{errors.expiryDate}</span>
            )}
            </div>

            <div className="payment-form__field">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
              onChange={(e) => {
                dispatch(
                  updateCheckoutField({
                    name: "cvv",
                    value: e.target.value.replace(/\D/g, "").substring(0, 4),
                  })
                );
                clearFieldError("cvv");
              }}
                placeholder="123"
                maxLength="4"
              className={errors.cvv ? "error" : ""}
              />
            {errors.cvv && (
              <span className="error-message">{errors.cvv}</span>
            )}
            </div>
          </div>

          <div className="payment-form__field">
            <label htmlFor="paymentMethod">Método de Pago</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="credit_card">Tarjeta de Crédito</option>
              <option value="debit_card">Tarjeta de Débito</option>
            </select>
          </div>
        </div>

        <div className="payment-form__section">
          <h3>Dirección de Facturación</h3>
          
          <div className="payment-form__field">
            <label htmlFor="billingAddress">Dirección</label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="Av. Corrientes 1234"
              className={errors.billingAddress ? 'error' : ''}
            />
            {errors.billingAddress && <span className="error-message">{errors.billingAddress}</span>}
          </div>

          <div className="payment-form__row">
            <div className="payment-form__field">
              <label htmlFor="city">Ciudad</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Buenos Aires"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="payment-form__field">
              <label htmlFor="postalCode">Código Postal</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="1000"
                className={errors.postalCode ? 'error' : ''}
              />
              {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
            </div>
          </div>

          <div className="payment-form__field">
            <label htmlFor="country">País</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Argentina"
            />
          </div>
        </div>

        <div className="payment-form__actions">
          <button
            type="button"
            onClick={() => {
              dispatch(resetCheckoutState());
              onPaymentCancel();
            }}
            className="btn btn--ghost"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Procesar Pago'}
          </button>
          {errors.submit && (
            <span className="error-message submit-error">{errors.submit}</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
