import React, { useEffect, useState } from 'react';
import api from '../api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.getAdminAppointments().then(setAppointments).catch(err => console.error(err));
  }, []);

  const getAge = (dob) => {
    if (!dob) return '-';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.updateAppointment(id, { status: 'cancelled' });
      // Refresh
      const updated = await api.getAdminAppointments();
      setAppointments(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel');
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.updateAppointment(id, { status: 'completed' });
      // Refresh
      const updated = await api.getAdminAppointments();
      setAppointments(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to complete');
    }
  };

  return (
    <div className="admin-appointments">
      <h2>All Appointments</h2>
      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Age</th>
              <th>Date & Time</th>
              <th>Doctor</th>
              <th>Fees</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, i) => (
              <tr key={a.id || a._id || i}>
                <td>{i+1}</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#ddd'}}></div>
                    {a.user?.name || a.user?.email || 'N/A'}
                  </div>
                </td>
                <td>{getAge(a.user?.dob)}</td>
                <td>{new Date(a.date).toLocaleDateString()} {a.slot || '12:00 PM'}</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#ddd'}}></div>
                    {a.doctor?.name || 'N/A'}
                  </div>
                </td>
                <td>${a.doctor?.fees || '-'}</td>
                <td>
                  {a.status === 'cancelled' ? (
                    <span style={{color: 'red'}}>Cancelled</span>
                  ) : a.status === 'completed' ? (
                    <span style={{color: 'green'}}>Completed</span>
                  ) : (
                    <div style={{display: 'flex', gap: '4px'}}>
                      <button onClick={() => handleCancel(a.id || a._id)} style={{padding: '4px 8px', cursor: 'pointer', background: '#fff', border: '1px solid #ddd', borderRadius: '4px'}}>✕</button>
                      <button onClick={() => handleComplete(a.id || a._id)} style={{padding: '4px 8px', cursor: 'pointer', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px'}}>✓</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
