import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Cpu, LogOut } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

// Navigation component that uses Router hooks
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isDashboard = location.pathname === '/admin';
  const isLoginPage = location.pathname === '/login';

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1200px',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      borderRadius: '50px',
      background: 'rgba(10, 16, 25, 0.65)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0, 223, 137, 0.15)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,223,137,0.05)'
    }}>
      {/* Brand Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-secondary) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0,223,137,0.4)'
        }}>
          <span style={{ color: '#000', fontWeight: '900', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>D</span>
        </div>
        <span style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>
          DYNESSCO
        </span>
      </Link>

      {/* Desktop Navigation Links */}
      {!isDashboard && !isLoginPage ? (
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }} className="desktop-menu">
          <a href="#home" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'var(--transition-smooth)' }}>Home</a>
          <a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'var(--transition-smooth)' }} onMouseOver={e=>e.target.style.color='var(--accent-color)'} onMouseOut={e=>e.target.style.color='var(--text-muted)'}>Services</a>
          <a href="#projects" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'var(--transition-smooth)' }} onMouseOver={e=>e.target.style.color='var(--accent-color)'} onMouseOut={e=>e.target.style.color='var(--text-muted)'}>Projects</a>
          <a href="#skills-experience" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'var(--transition-smooth)' }} onMouseOver={e=>e.target.style.color='var(--accent-color)'} onMouseOut={e=>e.target.style.color='var(--text-muted)'}>Who We Are</a>
          <a href="#contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', transition: 'var(--transition-smooth)' }} onMouseOver={e=>e.target.style.color='var(--accent-color)'} onMouseOut={e=>e.target.style.color='var(--text-muted)'}>Contact</a>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>← Public Portfolio</Link>
        </div>
      )}

      {/* Right-side action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-menu">
        {isAuthenticated ? (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/admin" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
              Dashboard
            </Link>
            <button onClick={logout} className="btn" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', padding: '6px' }}>
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <a href="#contact" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            Start Project <ArrowUpRight size={14} />
          </a>
        )}
      </div>

      {/* Mobile menu toggle */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="mobile-toggle"
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'white', 
          cursor: 'pointer', 
          display: 'none', // Overridden by media styles in index.css / layout stylesheet
          padding: '6px'
        }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer (Absolute overlay below nav) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '0',
          width: '100%',
          background: 'rgba(10, 16, 25, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 223, 137, 0.15)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
        }}>
          {!isDashboard && !isLoginPage ? (
            <>
              <a href="#home" onClick={handleNavClick} style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '600' }}>Home</a>
              <a href="#services" onClick={handleNavClick} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1rem' }}>Services</a>
              <a href="#projects" onClick={handleNavClick} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1rem' }}>Projects</a>
              <a href="#skills-experience" onClick={handleNavClick} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1rem' }}>Who We Are</a>
              <a href="#contact" onClick={handleNavClick} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '1rem' }}>Contact</a>
            </>
          ) : (
            <Link to="/" onClick={handleNavClick} style={{ color: 'white', textDecoration: 'none' }}>Public Portfolio</Link>
          )}
          {isAuthenticated ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid var(--border-dim)', paddingTop: '16px' }}>
              <Link to="/admin" onClick={handleNavClick} style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>Admin Dashboard</Link>
              <span onClick={() => { logout(); handleNavClick(); }} style={{ color: '#ef4444', cursor: 'pointer' }}>Logout</span>
            </div>
          ) : (
            <Link to="/login" onClick={handleNavClick} style={{ color: 'var(--accent-color)', textDecoration: 'none', borderTop: '1px solid var(--border-dim)', paddingTop: '16px' }}>Admin Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-dim)',
      background: '#04070b',
      padding: '60px 8% 40px',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#000', fontWeight: '900', fontSize: '0.9rem' }}>D</span>
            </div>
            <span style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>DYNESSCO</span>
          </div>
          <p style={{ lineHeight: '1.6', maxWidth: '300px' }}>
            Transforming corporate landscapes with cutting-edge designs and custom MERN software solutions.
          </p>
        </div>
        
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem' }}>Navigation</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="#home" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
            <a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Services</a>
            <a href="#projects" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Projects</a>
            <a href="#contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '1rem' }}>Contact Info</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p>Email: contact@dynessco.com</p>
            <p>Phone: +94 702 167 589</p>
            <p>Colombo, Sri Lanka</p>
            <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.8rem', marginTop: '10px' }}>Admin login</Link>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ borderTop: '1px solid var(--border-dim)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <p>&copy; {new Date().getFullYear()} Dynessco Portfolio. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

// Add styles injection to make mobile menu buttons display correctly
const StylesInjector = () => (
  <style>{`
    @media (max-width: 768px) {
      .desktop-menu { display: none !important; }
      .mobile-toggle { display: block !important; }
    }
  `}</style>
);

const App = () => {
  return (
    <Router>
      <StylesInjector />
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
