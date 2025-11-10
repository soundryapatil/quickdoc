import React, { useEffect, useState } from 'react';
import api from '../api';


const Dashboard = () => {
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [latestBookings, setLatestBookings] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const doctors = await api.getDoctors();
      setDoctorsCount(doctors.length);

      const appointments = await api.getAdminAppointments();
      setAppointmentsCount(appointments.length);
      
      const patients = Array.from(new Set((appointments || []).map(x => x.user && (x.user.id || x.user._id || x.user.email))));
      setPatientsCount(patients.length);

      // Get latest 5 bookings
      setLatestBookings(appointments.slice(0, 5));
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
    <div className="admin-dashboard">
      <div className="stats-row" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px'}}>
        <div className="stat-card" style={{padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '32px', marginBottom: '8px'}}>👨‍⚕️</div>
          <h3 style={{fontSize: '28px', margin: '8px 0'}}>{doctorsCount}</h3>
          <p style={{color: '#666'}}>Doctors</p>
        </div>
        <div className="stat-card" style={{padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '32px', marginBottom: '8px'}}>📅</div>
          <h3 style={{fontSize: '28px', margin: '8px 0'}}>{appointmentsCount}</h3>
          <p style={{color: '#666'}}>Appointments</p>
        </div>
        <div className="stat-card" style={{padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize: '32px', marginBottom: '8px'}}>👥</div>
          <h3 style={{fontSize: '28px', margin: '8px 0'}}>{patientsCount}</h3>
          <p style={{color: '#666'}}>Patients</p>
        </div>
      </div>

      <section className="latest-appointments" style={{background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <h3 style={{marginBottom: '20px'}}>📋 Latest Bookings</h3>
        <div className="appt-list">
          {latestBookings.map(a => (
            <div key={a.id || a._id} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #eee'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#ddd'}}></div>
                <div>
                  <div><strong>{a.doctor?.name || 'Doctor'}</strong></div>
                  <div style={{fontSize: '12px', color: '#666'}}>Booking on {new Date(a.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                {a.status === 'cancelled' ? (
                  <span style={{color: 'red'}}>Cancelled</span>
                ) : a.status === 'completed' ? (
                  <span style={{color: 'green'}}>Completed</span>
                ) : (
                  <>
                    <button 
                      onClick={() => handleCancel(a.id || a._id)}
                      style={{padding: '4px 8px', cursor: 'pointer', background: '#fff', border: '1px solid #ddd', borderRadius: '4px'}}
                    >
                      ✕
                    </button>
                    <button 
                      onClick={() => handleComplete(a.id || a._id)}
                      style={{padding: '4px 8px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px'}}
                    >
                      ✓
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
