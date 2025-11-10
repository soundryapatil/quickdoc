import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('prescripto_token') : null;
  const user = token ? (() => {
    try { const p = token.split('.')[1]; return JSON.parse(atob(p)); } catch (e) { return null }
  })() : null;
  const [showMenu, setShowMenu] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('prescripto_token');
    navigate('/');
  };

  // Hide the global header only on admin and doctor panel routes (exact or nested)
  // Avoid hiding for routes like '/doctors' which start with '/doctor'
  const hideForAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
  const hideForDoctor = location.pathname === '/doctor' || location.pathname.startsWith('/doctor/');
  if (hideForAdmin || hideForDoctor) return null;

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">QuickDoc</Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/doctors">All Doctors</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          {token ? (
            <div className="header-actions">
              {user && user.role === 'admin' && <Link to="/admin/dashboard" className="btn btn-link">Admin Panel</Link>}
              {user && user.role === 'doctor' && <Link to="/doctor/dashboard" className="btn btn-link">Doctor Panel</Link>}
              {/* My Appointments moved into the profile dropdown to match the design */}
              {/* user avatar dropdown for profile/appointments/logout */}
              <div className="user-menu" onClick={() => setShowMenu(s => !s)} style={{ position: 'relative' }}>
                {/* prefer user's avatar when available (profile upload), otherwise use placeholder SVG */}
                <img src={(user && user.avatar) ? user.avatar : '/avatar-placeholder.svg'} alt="user" className="avatar-small" />
                {showMenu && (
                  <div className="user-dropdown">
                    <Link to="/profile">My Profile</Link>
                    <Link to="/appointments">My Appointments</Link>
                    <button onClick={handleLogout} style={{background: 'none', border: 'none', padding: 0, margin: 0, color: '#333', cursor: 'pointer'}}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary">Create account</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;