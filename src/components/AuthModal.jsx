import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { logIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await logIn(email, password);
      } else {
        if (!fullName.trim()) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName);
        setError('Check your email for verification link');
        setTimeout(() => {
          onClose();
          setEmail('');
          setPassword('');
          setFullName('');
        }, 2000);
      }
      onClose();
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }} onClick={onClose}>
      
      <div style={{
        background: '#fff', width: '100%', maxWidth: '400px', borderRadius: 'var(--radius-lg)',
        padding: 'clamp(1.5rem, 5vw, 2rem)', boxShadow: 'var(--shadow-lg)', position: 'relative'
      }} onClick={e => e.stopPropagation()}>
        
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--clr-text-muted)'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{
          color: 'var(--clr-teal-dark)', fontSize: '1.8rem', fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <p style={{
          color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '2rem'
        }}>
          {isLogin ? 'Sign in to your account' : 'Join us to explore Confier products'}
        </p>

        {error && (
          <div style={{
            background: error.includes('Check your') ? '#d4edda' : '#f8d7da',
            border: error.includes('Check your') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
            color: error.includes('Check your') ? '#155724' : '#721c24',
            padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem',
            display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {!isLogin && (
            <div>
              <label style={{
                display: 'block', fontSize: '0.9rem', fontWeight: 600,
                color: 'var(--clr-text-main)', marginBottom: '0.5rem'
              }}>
                Full Name
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={18} style={{
                  position: 'absolute', left: '12px', color: 'var(--clr-text-muted)'
                }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%', padding: '12px', paddingLeft: '40px',
                    border: '1px solid var(--clr-border)', borderRadius: '8px',
                    fontSize: '0.95rem', transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{
              display: 'block', fontSize: '0.9rem', fontWeight: 600,
              color: 'var(--clr-text-main)', marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{
                position: 'absolute', left: '12px', color: 'var(--clr-text-muted)'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%', padding: '12px', paddingLeft: '40px',
                  border: '1px solid var(--clr-border)', borderRadius: '8px',
                  fontSize: '0.95rem', transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block', fontSize: '0.9rem', fontWeight: 600,
              color: 'var(--clr-text-main)', marginBottom: '0.5rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{
                position: 'absolute', left: '12px', color: 'var(--clr-text-muted)'
              }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%', padding: '12px', paddingLeft: '40px',
                  border: '1px solid var(--clr-border)', borderRadius: '8px',
                  fontSize: '0.95rem', transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'var(--clr-text-muted)' : 'var(--clr-orange-warm)',
              color: '#fff', padding: '12px 1rem', borderRadius: '8px',
              border: 'none', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', transition: 'all 0.2s'
            }}
          >
            {loading && <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem',
          color: 'var(--clr-text-muted)'
        }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setEmail('');
              setPassword('');
              setFullName('');
            }}
            style={{
              background: 'none', border: 'none', color: 'var(--clr-orange-warm)',
              cursor: 'pointer', fontWeight: 700, marginLeft: '0.5rem'
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
