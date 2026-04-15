import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useAuth } from '../AuthContext';
import AuthModal from './AuthModal';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, logOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.products'), href: '#products' },
    { name: t('nav.results'), href: '#stories' },
    { name: t('nav.rnd'), href: '#rnd' },
    { name: t('nav.updates'), href: '#events' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(12px)', zIndex: 50,
      borderBottom: scrolled ? '1px solid var(--clr-border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      padding: '0.8rem 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* LOGO */}
        <a href="#home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          {/* Logo element placeholder pointing to public/logo.png */}
          <div style={{ height: '56px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/logo.png" 
              alt="Confier International" 
              onError={(e) => {
                 e.target.style.display='none'; 
                 e.target.nextSibling.style.display='flex'; 
              }} 
              style={{ maxHeight: '100%', objectFit: 'contain' }} 
            />
            {/* Fallback styling looking exactly like their uploaded font if PNG is missing */}
            <div style={{ display: 'none', flexDirection: 'column', lineHeight: 1.1 }}>
              <strong style={{ fontFamily: '"Nunito", "DM Sans", sans-serif', fontSize: '1.4rem', color: 'var(--clr-orange-warm)' }}>CONFIER</strong>
              <small style={{ fontFamily: '"Nunito", "DM Sans", sans-serif', fontSize: '0.85rem', color: 'var(--clr-orange-warm)' }}>INTERNATIONAL</small>
            </div>
          </div>
        </a>

        {/* DESKTOP NAV */}
        <div style={{ display: 'none' }} className="desktop-nav">
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {navLinks.map((link, idx) => (
              <a key={idx} href={link.href} style={{
                textDecoration: 'none', color: 'var(--clr-text-main)', fontSize: '0.875rem', fontWeight: 600, transition: 'color 0.2s'
              }} onMouseOver={(e) => e.target.style.color = 'var(--clr-teal)'} onMouseOut={(e) => e.target.style.color = 'var(--clr-text-main)'}>
                {link.name}
              </a>
            ))}
            <a href="#contact" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>{t('nav.contact')}</a>
            
            {/* Auth Buttons */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    background: 'var(--clr-teal-light)', border: 'none', color: 'var(--clr-teal-dark)',
                    padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}
                >
                  <User size={18} /> {user.email?.split('@')[0]}
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, background: '#fff',
                    border: '1px solid var(--clr-border)', borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)', marginTop: '0.5rem', zIndex: 1000,
                    minWidth: '200px'
                  }}>
                    <a href="#account" onClick={() => setUserMenuOpen(false)} style={{
                      display: 'block', padding: '0.75rem 1rem', color: 'var(--clr-text-main)',
                      textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid var(--clr-border)',
                      transition: 'background 0.2s'
                    }} onMouseOver={(e) => e.target.style.background = 'var(--clr-bg-surface)'} onMouseOut={(e) => e.target.style.background = ''}>
                      My Account
                    </a>
                    {user.user_metadata?.role === 'admin' && (
                      <a href="#admin" onClick={() => setUserMenuOpen(false)} style={{
                        display: 'block', padding: '0.75rem 1rem', color: 'var(--clr-text-main)',
                        textDecoration: 'none', fontSize: '0.9rem', borderBottom: '1px solid var(--clr-border)',
                        transition: 'background 0.2s'
                      }} onMouseOver={(e) => e.target.style.background = 'var(--clr-bg-surface)'} onMouseOut={(e) => e.target.style.background = ''}>
                        Admin Panel
                      </a>
                    )}
                    <button
                      onClick={async () => {
                        await logOut();
                        setUserMenuOpen(false);
                      }}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none',
                        color: '#d32f2f', fontSize: '0.9rem', textAlign: 'left', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = 'var(--clr-bg-surface)'}
                      onMouseOut={(e) => e.target.style.background = ''}
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                style={{
                  background: 'var(--clr-orange-warm)', border: 'none', color: '#fff',
                  padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 600, transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--clr-orange)'}
                onMouseOut={(e) => e.target.style.background = 'var(--clr-orange-warm)'}
              >
                Login / Register
              </button>
            )}
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)} 
          style={{ background: 'none', border: 'none', color: 'var(--clr-text-main)' }}>
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE NAV DROPDOWN */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, 
          background: '#fff', borderBottom: '1px solid var(--clr-border)',
          padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          {navLinks.map((link, idx) => (
            <a key={idx} href={link.href} onClick={() => setMobileOpen(false)} style={{
              textDecoration: 'none', color: 'var(--clr-text-main)', fontSize: '1rem', fontWeight: 600,
              padding: '0.5rem 0', borderBottom: '1px solid var(--clr-border)'
            }}>
              {link.name}
            </a>
          ))}
          <a href="#contact" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ marginTop: '0.5rem', textAlign: 'center' }}>{t('nav.contact')}</a>
          
          {/* Mobile Auth */}
          {user ? (
            <>
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--clr-border)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem' }}>
                  Signed in as: <strong>{user.email?.split('@')[0]}</strong>
                </div>
                <a href="#account" onClick={() => setMobileOpen(false)} style={{
                  display: 'block', padding: '0.5rem 0', color: 'var(--clr-teal-dark)',
                  textDecoration: 'none', fontWeight: 600, marginBottom: '0.5rem'
                }}>
                  My Account
                </a>
                <button
                  onClick={async () => {
                    await logOut();
                    setMobileOpen(false);
                  }}
                  style={{
                    width: '100%', padding: '0.5rem', background: '#d32f2f', color: '#fff',
                    border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => {
                setAuthModalOpen(true);
                setMobileOpen(false);
              }}
              style={{
                background: 'var(--clr-orange-warm)', border: 'none', color: '#fff',
                padding: '0.75rem 1rem', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 600, marginTop: '0.5rem'
              }}
            >
              Login / Register
            </button>
          )}
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Extra CSS for media queries since we used inline styles for speed */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: block !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
