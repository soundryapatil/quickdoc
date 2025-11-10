import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../admin/admin.css';

const DoctorLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('prescripto_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <img src="/assets/logo.png" alt="Prescripto" style={{width: '40px', height: '40px'}} onError={(e) => e.target.style.display = 'none'} />
            <span style={{fontSize: '24px', fontWeight: 'bold'}}>Prescripto</span>
          </div>
          <span className="badge" style={{background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', marginTop: '8px'}}>Doctor</span>
        </div>
        <nav className="admin-nav" style={{marginTop: '30px'}}>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '8px'}}>
              <Link to="/doctor/dashboard" style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', color: '#333', borderRadius: '8px'}}>
                <span style={{fontSize: '20px'}}>🏠</span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li style={{marginBottom: '8px'}}>
              <Link to="/doctor/appointments" style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', color: '#333', borderRadius: '8px'}}>
                <span style={{fontSize: '20px'}}>📅</span>
                <span>Appointments</span>
              </Link>
            </li>
            <li style={{marginBottom: '8px'}}>
              <Link to="/doctor/profile" style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', textDecoration: 'none', color: '#333', borderRadius: '8px'}}>
                <span style={{fontSize: '20px'}}>👤</span>
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-top-left" />
          <div className="admin-top-right">
            <button className="btn btn-primary" onClick={handleLogout} style={{background: '#5f6fff', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '25px', cursor: 'pointer', fontSize: '14px'}}>
              Logout
            </button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
