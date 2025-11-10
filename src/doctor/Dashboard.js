import React, { useEffect, useState } from 'react';
import api from '../api';
import { getAvatar } from '../assets/images';

const Dashboard = () => {
  const [stats, setStats] = useState({ earnings: 0, appointments: 0, patients: 0 });
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get appointments for this doctor
      const doctorAppts = await api.getDoctorAppointments();

      // Calculate stats
      const earnings = doctorAppts
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.doctor?.fees || 0), 0);
      
      const uniquePatients = new Set(doctorAppts.map(a => a.user?.id || a.user?._id)).size;

      setStats({
        earnings,
        appointments: doctorAppts.length,
        patients: uniquePatients
      });

      // Get latest bookings
      setAppointments(doctorAppts.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.updateAppointment(id, { status: 'cancelled' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.updateAppointment(id, { status: 'completed' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="doctor-dashboard" style={{padding: '20px'}}>
      <div className="stats-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px'}}>
        <div className="stat-card" style={{padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div style={{fontSize: '40px', background: '#e8f5e9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>💵</div>
          <div>
            <div style={{fontSize: '28px', fontWeight: 'bold', color: '#333'}}>${stats.earnings}</div>
            <div style={{color: '#666', fontSize: '14px', marginTop: '4px'}}>Earnings</div>
          </div>
        </div>
        <div className="stat-card" style={{padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div style={{fontSize: '40px', background: '#e3f2fd', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>📅</div>
          <div>
            <div style={{fontSize: '28px', fontWeight: 'bold', color: '#333'}}>{stats.appointments}</div>
            <div style={{color: '#666', fontSize: '14px', marginTop: '4px'}}>Appointments</div>
          </div>
        </div>
        <div className="stat-card" style={{padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div style={{fontSize: '40px', background: '#f3e5f5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>👥</div>
          <div>
            <div style={{fontSize: '28px', fontWeight: 'bold', color: '#333'}}>{stats.patients}</div>
            <div style={{color: '#666', fontSize: '14px', marginTop: '4px'}}>Patients</div>
          </div>
        </div>
      </div>

      <div className="latest-bookings" style={{marginTop: '30px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginBottom: '20px'}}>📋 Latest Bookings</h3>
        <div className="bookings-list">
          {appointments.length === 0 && <p style={{color: '#666'}}>No bookings yet</p>}
          {appointments.map(a => (
            <div key={a.id || a._id} className="booking-item" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #eee'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#ddd', overflow: 'hidden'}}>
                  <img src={getAvatar(a.user?.picture)} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} onError={(e) => e.target.style.display = 'none'} />
                </div>
                <div>
                  <div><strong>{a.user?.name || 'Patient'}</strong></div>
                  <div style={{fontSize: '12px', color: '#666'}}>
                    Booking on {new Date(a.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                {a.status === 'cancelled' ? (
                  <span style={{color: '#ef4444', fontSize: '14px'}}>Cancelled</span>
                ) : a.status === 'completed' ? (
                  <span style={{color: '#10b981', fontSize: '14px'}}>Completed</span>
                ) : (
                  <>
                    <button 
                      onClick={() => handleCancel(a.id || a._id)}
                      style={{padding: '6px 10px', cursor: 'pointer', background: '#fff', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px'}}
                      title="Cancel"
                    >
                      ✕
                    </button>
                    <button 
                      onClick={() => handleComplete(a.id || a._id)}
                      style={{padding: '6px 10px', cursor: 'pointer', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px'}}
                      title="Complete"
                    >
                      ✓
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
