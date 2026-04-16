import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../CartContext';
import { useLanguage } from '../LanguageContext';

export default function Checkout({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateCartQuantity, clearCart, getCartTotal } = useCart();
  const { t } = useLanguage();
  const [step, setStep] = useState('cart'); // 'cart' | 'details' | 'payment'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const total = getCartTotal();
  const gst = total * 0.18; // 18% GST
  const finalTotal = total + gst;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Payment processing logic will go here
      // For now, we'll simulate payment
      setTimeout(() => {
        alert('Order placed successfully! Order ID: ORD-' + Date.now());
        clearCart();
        setStep('cart');
        onClose();
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        });
        setLoading(false);
      }, 1500);
    } catch (error) {
      alert('Payment failed: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10001, background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      
      <div style={{
        background: '#fff', width: '100%', maxWidth: '800px', borderRadius: 'var(--radius-lg)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--clr-teal-dark), var(--clr-ocean))',
          color: '#fff', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>Checkout</h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              Step {step === 'cart' ? '1' : step === 'details' ? '2' : '3'} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
              borderRadius: '50%', width: '36px', height: '36px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          
          {step === 'cart' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--clr-teal-dark)', fontWeight: 700 }}>
                Shopping Cart ({cartItems.length} items)
              </h3>

              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--clr-text-muted)' }}>
                  <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {cartItems.map(item => (
                      <div
                        key={item.id}
                        style={{
                          background: 'var(--clr-bg-surface)', padding: '1rem',
                          borderRadius: '12px', border: '1px solid var(--clr-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--clr-text-main)' }}>
                            {item.name}
                          </h4>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--clr-text-muted)' }}>
                            {item.subtitle}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--clr-border)', borderRadius: '8px', padding: '0.25rem' }}>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--clr-teal-dark)' }}
                            >
                              <Minus size={16} />
                            </button>
                            <span style={{ width: '24px', textAlign: 'center', fontWeight: 600 }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--clr-teal-dark)' }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--clr-orange)', padding: '0.5rem'
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div style={{
                    background: 'var(--clr-bg-surface)', padding: '1.5rem',
                    borderRadius: '12px', border: '1px solid var(--clr-border)'
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem',
                      paddingBottom: '0.75rem', borderBottom: '1px solid var(--clr-border)'
                    }}>
                      <span>Subtotal:</span>
                      <span style={{ fontWeight: 700 }}>₹{total.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'
                    }}>
                      <span>GST (18%):</span>
                      <span style={{ fontWeight: 700 }}>₹{gst.toFixed(2)}</span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem',
                      fontWeight: 700, color: 'var(--clr-teal-dark)', paddingTop: '0.75rem',
                      borderTop: '2px solid var(--clr-border)'
                    }}>
                      <span>Total:</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'details' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--clr-teal-dark)', fontWeight: 700 }}>
                Delivery & Contact Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'Full Name', name: 'fullName', required: true },
                  { label: 'Email', name: 'email', type: 'email', required: true },
                  { label: 'Phone', name: 'phone', required: true },
                  { label: 'Company', name: 'company' },
                  { label: 'Address', name: 'address', required: true },
                  { label: 'City', name: 'city', required: true },
                  { label: 'State/Province', name: 'state', required: true },
                  { label: 'Zip Code', name: 'zipCode', required: true },
                  { label: 'Country', name: 'country', required: true }
                ].map(field => (
                  <div key={field.name} style={{ gridColumn: field.name === 'address' ? '1 / -1' : 'auto' }}>
                    <label style={{
                      display: 'block', fontSize: '0.9rem', fontWeight: 600,
                      color: 'var(--clr-text-main)', marginBottom: '0.5rem'
                    }}>
                      {field.label} {field.required && '*'}
                    </label>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleFormChange}
                      required={field.required}
                      placeholder={field.label}
                      style={{
                        width: '100%', padding: '0.75rem', border: '1px solid var(--clr-border)',
                        borderRadius: '8px', fontSize: '0.95rem', outline: 'none',
                        transition: 'border 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--clr-teal-dark)', fontWeight: 700 }}>
                Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { id: 'stripe', label: 'Stripe / Credit Card', icon: '💳' },
                  { id: 'razorpay', label: 'Razorpay (UPI/Card/Net Banking)', icon: '📱' },
                  { id: 'bank', label: 'Bank Transfer', icon: '🏦' }
                ].map(method => (
                  <label key={method.id} style={{
                    display: 'flex', alignItems: 'center', padding: '1rem',
                    border: paymentMethod === method.id ? '2px solid var(--clr-teal)' : '1px solid var(--clr-border)',
                    borderRadius: '12px', cursor: 'pointer', background: paymentMethod === method.id ? 'var(--clr-teal-light)' : 'var(--clr-bg-surface)',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ marginRight: '1rem', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '1.2rem', marginRight: '1rem' }}>{method.icon}</span>
                    <span style={{ fontWeight: 600, color: 'var(--clr-text-main)' }}>{method.label}</span>
                  </label>
                ))}
              </div>

              <div style={{
                background: 'var(--clr-bg-surface)', padding: '1.5rem',
                borderRadius: '12px', border: '1px solid var(--clr-border)', marginBottom: '1.5rem'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--clr-teal-dark)', fontWeight: 700 }}>
                  Order Summary
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Items:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--clr-border)' }}>
                  <span>GST (18%):</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: 'var(--clr-teal-dark)' }}>
                  <span>Total Amount:</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem', borderTop: '1px solid var(--clr-border)',
          display: 'flex', justifyContent: 'space-between', gap: '1rem'
        }}>
          <button
            onClick={() => {
              if (step === 'cart') onClose();
              else setStep(step === 'details' ? 'cart' : 'details');
            }}
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '8px',
              border: '1px solid var(--clr-border)', background: '#fff',
              color: 'var(--clr-text-main)', cursor: 'pointer', fontWeight: 600
            }}
          >
            {step === 'cart' ? 'Close' : 'Back'}
          </button>

          <button
            onClick={() => {
              if (step === 'cart' && cartItems.length > 0) setStep('details');
              else if (step === 'details') setStep('payment');
              else if (step === 'payment') handlePayment();
            }}
            disabled={step === 'cart' && cartItems.length === 0 || loading}
            className="btn-primary"
            style={{
              padding: '0.75rem 1.5rem', opacity: step === 'cart' && cartItems.length === 0 ? 0.5 : 1
            }}
          >
            {loading ? 'Processing...' : step === 'cart' ? 'Continue' : step === 'details' ? 'Review Payment' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
