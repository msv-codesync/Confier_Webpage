import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Shield, Loader } from 'lucide-react';
import { useAuth } from '../AuthContext';
import supabase from '../supabaseClient';

export default function AdminSetup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!supabase) throw new Error('Supabase not initialized');

      // Create admin user in Supabase
      if (!supabase.auth.admin) {
        throw new Error('Admin API not available in this client configuration');
      }
      const { data, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: 'admin' }
      });

      if (signUpError) throw signUpError;

      // Create admin profile
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            email,
            full_name: fullName,
            role: 'admin',
            is_active: true,
            created_at: new Date()
          }]);

        if (profileError) throw profileError;

        setSuccess(`✅ Admin account created successfully!\nEmail: ${email}\n\nYou can now log in with these credentials.`);
        setEmail('');
        setPassword('');
        setFullName('');
        setTimeout(() => setStep(2), 2000);
      }
    } catch (err) {
      setError(err.message || 'Error creating admin account');
      console.error('Admin setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if already an admin
  if (user && isAdmin) {
    return (
      <div style={{
        padding: '2rem', textAlign: 'center', background: 'var(--clr-bg-surface)',
        borderRadius: '12px', border: '2px solid var(--clr-teal)'
      }}>
        <CheckCircle2 size={48} color="var(--clr-teal)" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: 'var(--clr-teal-dark)', marginBottom: '0.5rem' }}>
          Welcome Admin, {user.email}
        </h2>
        <p style={{ color: 'var(--clr-text-muted)' }}>
          You have full administrative access to the system.
        </p>
      </div>
    );
  }

  // If not logged in
  if (!user) {
    return (
      <div style={{
        padding: '2rem', background: 'var(--clr-bg-surface)',
        borderRadius: '12px', border: '1px solid var(--clr-border)', textAlign: 'center'
      }}>
        <Shield size={48} color="var(--clr-orange)" style={{ marginBottom: '1rem', margin: '0 auto 1rem' }} />
        <h2 style={{ color: 'var(--clr-text-main)', marginBottom: '1rem' }}>Admin Setup</h2>
        <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem' }}>
          Please log in first to continue with admin setup.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '500px', margin: '0 auto', padding: '2rem',
      background: '#fff', borderRadius: '12px',
      border: '1px solid var(--clr-border)', boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Shield size={32} color="var(--clr-orange)" />
        <h2 style={{ color: 'var(--clr-teal-dark)', fontSize: '1.5rem' }}>
          Create Admin Account
        </h2>
      </div>

      {/* Step Indicator */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '2rem', justifyContent: 'center'
      }}>
        {[1, 2].map(s => (
          <div key={s} style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: step >= s ? 'var(--clr-orange)' : 'var(--clr-border)',
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700,
            transition: 'all 0.2s'
          }}>
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          {error && (
            <div style={{
              background: '#f8d7da', border: '1px solid #f5c6cb',
              color: '#721c24', padding: '1rem', borderRadius: '8px',
              marginBottom: '1.5rem', display: 'flex', gap: '0.5rem',
              alignItems: 'flex-start'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              background: '#d4edda', border: '1px solid #c3e6cb',
              color: '#155724', padding: '1rem', borderRadius: '8px',
              marginBottom: '1.5rem', display: 'flex', gap: '0.5rem',
              alignItems: 'flex-start'
            }}>
              <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
              <span style={{ whiteSpace: 'pre-line' }}>{success}</span>
            </div>
          )}

          <form onSubmit={handleCreateAdmin} style={{
            display: 'flex', flexDirection: 'column', gap: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block', fontSize: '0.9rem', fontWeight: 600,
                color: 'var(--clr-text-main)', marginBottom: '0.5rem'
              }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Admin Name"
                required
                style={{
                  width: '100%', padding: '12px', border: '1px solid var(--clr-border)',
                  borderRadius: '8px', fontSize: '0.95rem', outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: '0.9rem', fontWeight: 600,
                color: 'var(--clr-text-main)', marginBottom: '0.5rem'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@confier.com"
                required
                style={{
                  width: '100%', padding: '12px', border: '1px solid var(--clr-border)',
                  borderRadius: '8px', fontSize: '0.95rem', outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block', fontSize: '0.9rem', fontWeight: 600,
                color: 'var(--clr-text-main)', marginBottom: '0.5rem'
              }}>
                Password (Min 6 characters)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: '100%', padding: '12px', border: '1px solid var(--clr-border)',
                  borderRadius: '8px', fontSize: '0.95rem', outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--clr-teal)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--clr-border)'}
              />
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
              Create Admin Account
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <div style={{ textAlign: 'center' }}>
          <CheckCircle2 size={64} color="var(--clr-teal)" style={{ marginBottom: '1.5rem' }} />
          <h3 style={{ color: 'var(--clr-teal-dark)', marginBottom: '1rem' }}>
            Setup Complete!
          </h3>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Your admin account has been created. You can now log in and start managing the system.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'var(--clr-teal)', color: '#fff',
              padding: '12px 2rem', borderRadius: '8px', border: 'none',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            Return to Home
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
