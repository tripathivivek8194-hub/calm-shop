import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote, ChevronLeft, ChevronRight, Check, CreditCard, Smartphone, Truck, Shield, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { formatPrice } from '../data/products';
import './Checkout.css';

const initialFormState = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'IN',
  phone: '',
  saveInfo: false,
  paymentMethod: 'card',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardName: '',
};

const validationRules = {
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
  firstName: { required: true, message: 'First name is required' },
  lastName: { required: true, message: 'Last name is required' },
  address: { required: true, message: 'Address is required' },
  city: { required: true, message: 'City is required' },
  state: { required: true, message: 'State is required' },
  zipCode: { required: true, pattern: /^[1-9]\d{5}$/, message: 'Enter a valid 6-digit PIN code' },
  phone: { required: true, pattern: /^(?:\+91[\s-]?)?[6-9]\d{9}$/, message: 'Enter a valid Indian mobile number' },
  cardNumber: { required: true, pattern: /^\d{16}$/, message: 'Enter a valid 16-digit card number' },
  cardExpiry: { required: true, pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Enter as MM/YY' },
  cardCvc: { required: true, pattern: /^\d{3,4}$/, message: 'Enter a valid CVC' },
  cardName: { required: true, message: 'Name on card is required' },
};

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
];

const showLegacyStates = import.meta.env.VITE_SHOW_LEGACY_STATES === 'true';

export function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const shipping = subtotal >= 100 ? 0 : 12;
  const total = subtotal + shipping;

  if (items.length === 0 && !orderConfirmed) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <Link to="/shop" className="back-link">
              <ChevronLeft size={18} aria-hidden="true" />
              Continue Shopping
            </Link>
            <div className="empty-icon" aria-hidden="true">🛍️</div>
            <h1>Your cart is empty</h1>
            <p>Add some items to your cart before checking out.</p>
            <Link to="/shop" className="btn btn-primary">
              Browse Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="confirmation">
            <div className="confirmation-icon" aria-hidden="true">
              <Check size={48} />
            </div>
            <h1>Thank You for Your Order!</h1>
            <p className="order-number">Order <strong>#{orderNumber}</strong> has been confirmed</p>
            <p className="confirmation-email">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>
            <div className="confirmation-details">
              <div className="detail-item">
                <Mail size={18} aria-hidden="true" />
                <span>{formData.email}</span>
              </div>
              <div className="detail-item">
                <Truck size={18} aria-hidden="true" />
                <span>Free standard shipping</span>
              </div>
              <div className="detail-item">
                <Shield size={18} aria-hidden="true" />
                <span>Secure payment processed</span>
              </div>
            </div>
            <div className="confirmation-actions">
              <Link to="/account" className="btn btn-primary btn-lg">
                View Order Details
              </Link>
              <Link to="/" className="btn btn-secondary btn-lg" onClick={() => { setOrderConfirmed(false); }}>
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;
    if (rule.required && (!value || value.trim() === '')) {
      return rule.message;
    }
    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.message;
    }
    return null;
  };

  const validateStep = (stepNum) => {
    const stepFields = {
      1: ['email'],
      2: ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'phone'],
      3: formData.paymentMethod === 'card' ? ['cardNumber', 'cardExpiry', 'cardCvc', 'cardName'] : [],
    };
    const fields = stepFields[stepNum] || [];
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));

    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    // Create order
    const order = addOrder({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.color,
        slug: item.slug,
      })),
      subtotal,
      shipping: subtotal >= 100 ? 0 : 12,
      total: subtotal + (subtotal >= 100 ? 0 : 12),
    });

    setOrderNumber(order.id);
    setOrderConfirmed(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const formatCvc = (value) => {
    return value.replace(/\D/g, '').slice(0, 4);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-layout">
          <div className="checkout-main">
            <div className="checkout-header">
              <Link to="/cart" className="back-link">
                <ChevronLeft size={18} aria-hidden="true" />
                Back to Cart
              </Link>
              <div className="progress-steps" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
                <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Contact</span>
                </div>
                <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Shipping</span>
                </div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">Payment</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form" noValidate>
              {step === 1 && (
                <fieldset className="form-section" aria-labelledby="contact-heading">
                  <legend id="contact-heading" className="section-heading">Contact Information</legend>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <Mail size={18} className="input-icon" aria-hidden="true" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          autoComplete="email"
                          required
                          aria-invalid={errors.email && touched.email}
                          aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <p id="email-error" className="error-message" role="alert">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        name="saveInfo"
                        className="checkbox-input"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="saveInfo" className="checkbox-label">
                        Save this information for next time
                      </label>
                    </div>
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset className="form-section" aria-labelledby="shipping-heading">
                  <legend id="shipping-heading" className="section-heading">Shipping Address</legend>
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="firstName" className="form-label">First Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className={`form-input ${errors.firstName && touched.firstName ? 'error' : ''}`}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        autoComplete="given-name"
                        required
                        aria-invalid={errors.firstName && touched.firstName}
                      />
                      {errors.firstName && touched.firstName && <p className="error-message" role="alert">{errors.firstName}</p>}
                    </div>
                    <div className="form-group half">
                      <label htmlFor="lastName" className="form-label">Last Name <span className="required">*</span></label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className={`form-input ${errors.lastName && touched.lastName ? 'error' : ''}`}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        autoComplete="family-name"
                        required
                        aria-invalid={errors.lastName && touched.lastName}
                      />
                      {errors.lastName && touched.lastName && <p className="error-message" role="alert">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="address" className="form-label">Address <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <MapPin size={18} className="input-icon" aria-hidden="true" />
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className={`form-input ${errors.address && touched.address ? 'error' : ''}`}
                          value={formData.address}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          autoComplete="street-address"
                          required
                          aria-invalid={errors.address && touched.address}
                        />
                      </div>
                      {errors.address && touched.address && <p className="error-message" role="alert">{errors.address}</p>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="apartment" className="form-label">Apartment, Suite, etc. (optional)</label>
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        className="form-input"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        autoComplete="address-line2"
                      />
                    </div>
                  </div>
                  <div className="form-row three-column">
                    <div className="form-group">
                      <label htmlFor="city" className="form-label">City <span className="required">*</span></label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className={`form-input ${errors.city && touched.city ? 'error' : ''}`}
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        autoComplete="address-level2"
                        required
                        aria-invalid={errors.city && touched.city}
                      />
                      {errors.city && touched.city && <p className="error-message" role="alert">{errors.city}</p>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="state" className="form-label">State / Union Territory <span className="required">*</span></label>
                      <select
                        id="state"
                        name="state"
                        className={`form-input ${errors.state && touched.state ? 'error' : ''}`}
                        value={formData.state}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        autoComplete="address-level1"
                        required
                        aria-invalid={errors.state && touched.state}
                      >
                        <option value="">Select State / Union Territory</option>
                        {indianStates.map((state) => <option key={state} value={state}>{state}</option>)}
                        {showLegacyStates && (<>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                        </>)}
                      </select>
                      {errors.state && touched.state && <p className="error-message" role="alert">{errors.state}</p>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode" className="form-label">PIN Code <span className="required">*</span></label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        className={`form-input ${errors.zipCode && touched.zipCode ? 'error' : ''}`}
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        autoComplete="postal-code"
                        inputMode="numeric"
                        required
                        aria-invalid={errors.zipCode && touched.zipCode}
                        placeholder="110001"
                      />
                      {errors.zipCode && touched.zipCode && <p className="error-message" role="alert">{errors.zipCode}</p>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="phone" className="form-label">Phone <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <Phone size={18} className="input-icon" aria-hidden="true" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
                          value={formData.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          autoComplete="tel"
                          required
                          placeholder="+91 98765 43210"
                          aria-invalid={errors.phone && touched.phone}
                        />
                      </div>
                      {errors.phone && touched.phone && <p className="error-message" role="alert">{errors.phone}</p>}
                    </div>
                    <div className="form-group half">
                      <label htmlFor="country" className="form-label">Country <span className="required">*</span></label>
                      <select
                        id="country"
                        name="country"
                        className="form-input"
                        value={formData.country}
                        onChange={handleInputChange}
                        autoComplete="country"
                      >
                        <option value="IN">India</option>
                      </select>
                    </div>
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <fieldset className="form-section" aria-labelledby="payment-heading">
                  <legend id="payment-heading" className="section-heading">Payment</legend>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Payment Method</label>
                      <div className="payment-methods">
                        <label className={`payment-method ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={handleInputChange}
                          />
                          <div className="payment-method-content">
                            <CreditCard size={20} aria-hidden="true" />
                            <span>Credit / Debit Card</span>
                          </div>
                        </label>
                        <label className={`payment-method ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="upi"
                            checked={formData.paymentMethod === 'upi'}
                            onChange={handleInputChange}
                          />
                          <div className="payment-method-content">
                            <Smartphone size={20} aria-hidden="true" />
                            <span>UPI</span>
                          </div>
                        </label>
                        <label className={`payment-method ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={handleInputChange}
                          />
                          <div className="payment-method-content">
                            <Banknote size={20} aria-hidden="true" />
                            <span>Cash on Delivery</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'card' && (
                  <div className="card-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cardName" className="form-label">Name on Card <span className="required">*</span></label>
                        <div className="input-wrapper">
                          <User size={18} className="input-icon" aria-hidden="true" />
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            className={`form-input ${errors.cardName && touched.cardName ? 'error' : ''}`}
                            value={formData.cardName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            autoComplete="cc-name"
                            required
                            aria-invalid={errors.cardName && touched.cardName}
                          />
                        </div>
                        {errors.cardName && touched.cardName && <p className="error-message" role="alert">{errors.cardName}</p>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="cardNumber" className="form-label">Card Number <span className="required">*</span></label>
                        <div className="input-wrapper">
                          <CreditCard size={18} className="input-icon" aria-hidden="true" />
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            className={`form-input ${errors.cardNumber && touched.cardNumber ? 'error' : ''}`}
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange({ target: { name: 'cardNumber', value: formatCardNumber(e.target.value) } })}
                            onBlur={handleBlur}
                            autoComplete="cc-number"
                            required
                            placeholder="1234 5678 9012 3456"
                            aria-invalid={errors.cardNumber && touched.cardNumber}
                            maxLength={19}
                          />
                        </div>
                        {errors.cardNumber && touched.cardNumber && <p className="error-message" role="alert">{errors.cardNumber}</p>}
                      </div>
                    </div>
                    <div className="form-row three-column">
                      <div className="form-group">
                        <label htmlFor="cardExpiry" className="form-label">Expiry <span className="required">*</span></label>
                        <div className="input-wrapper">
                          <Lock size={18} className="input-icon" aria-hidden="true" />
                          <input
                            type="text"
                            id="cardExpiry"
                            name="cardExpiry"
                            className={`form-input ${errors.cardExpiry && touched.cardExpiry ? 'error' : ''}`}
                            value={formData.cardExpiry}
                            onChange={(e) => handleInputChange({ target: { name: 'cardExpiry', value: formatExpiry(e.target.value) } })}
                            onBlur={handleBlur}
                            autoComplete="cc-exp"
                            required
                            placeholder="MM/YY"
                            aria-invalid={errors.cardExpiry && touched.cardExpiry}
                            maxLength={5}
                          />
                        </div>
                        {errors.cardExpiry && touched.cardExpiry && <p className="error-message" role="alert">{errors.cardExpiry}</p>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="cardCvc" className="form-label">CVC <span className="required">*</span></label>
                        <div className="input-wrapper">
                          <Shield size={18} className="input-icon" aria-hidden="true" />
                          <input
                            type="text"
                            id="cardCvc"
                            name="cardCvc"
                            className={`form-input ${errors.cardCvc && touched.cardCvc ? 'error' : ''}`}
                            value={formData.cardCvc}
                            onChange={(e) => handleInputChange({ target: { name: 'cardCvc', value: formatCvc(e.target.value) } })}
                            onBlur={handleBlur}
                            autoComplete="cc-csc"
                            required
                            placeholder="123"
                            aria-invalid={errors.cardCvc && touched.cardCvc}
                            maxLength={4}
                          />
                        </div>
                        {errors.cardCvc && touched.cardCvc && <p className="error-message" role="alert">{errors.cardCvc}</p>}
                      </div>
                    </div>
                  </div>
                  )}
                  {formData.paymentMethod === 'upi' && (
                    <p className="payment-note">You will be redirected to your preferred UPI app to complete this prototype payment.</p>
                  )}
                  {formData.paymentMethod === 'cod' && (
                    <p className="payment-note">Pay in cash when your order is delivered. Cash on delivery is available for this prototype.</p>
                  )}
                </fieldset>
              )}

              <div className="form-actions">
                {step > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>
                    <ChevronLeft size={18} aria-hidden="true" />
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Continue
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : formData.paymentMethod === 'cod' ? 'Place Order' : `Pay ${formatPrice(total)}`}
                  </button>
                )}
              </div>

              <p className="secure-notice">
                <Lock size={14} aria-hidden="true" />
                Secure checkout • Your information is encrypted and protected
              </p>
            </form>
          </div>

          <aside className="checkout-summary">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              <ul className="summary-items">
                {items.map((item) => (
                  <li key={item.id} className="summary-item">
                    <div className="item-preview" aria-hidden="true">
                      <div
                        className="item-color-dot"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-total">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="shipping-notice">Add {formatPrice(100 - subtotal)} more for free shipping</p>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <div className="summary-guarantees">
                <div className="guarantee">
                  <Shield size={16} aria-hidden="true" />
                  <span>Secure checkout</span>
                </div>
                <div className="guarantee">
                  <Truck size={16} aria-hidden="true" />
                  <span>Free shipping over {formatPrice(100)}</span>
                </div>
                <div className="guarantee">
                  <ChevronRight size={16} aria-hidden="true" />
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
