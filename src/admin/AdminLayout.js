import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './admin.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('prescripto_token');
    navigate('/');
  };

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">Prescripto <span className="badge">Admin</span></div>
        <nav className="admin-nav">
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/appointments">Appointments</Link></li>
            <li><Link to="/admin/add-doctor">Add Doctor</Link></li>
            <li><Link to="/admin/doctors-list">Doctors List</Link></li>
          </ul>
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-top-left" />
          <div className="admin-top-right">
            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
