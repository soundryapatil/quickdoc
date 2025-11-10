import React, { useEffect, useState } from 'react';
import api from '../api';
import { getDoctorImage } from '../assets/images';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.getAppointments()
      .then((items) => {
        // hide cancelled appointments from the user's active list
        const visible = (items || []).filter(a => a.status !== 'cancelled');
        setAppointments(visible);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    /* eslint-disable-next-line no-restricted-globals */
    if (!confirm('Cancel this appointment?')) return;
    try {
      await api.deleteAppointment(id);
      load();
    } catch (err) {
      console.error(err);
      alert('Failed to cancel');
    }
  };

  return (
    <div className="my-appointments container">
      <h2>My Appointments</h2>
      {loading ? <p>Loading...</p> : (
        <div className="appointments-list">
          {appointments.length === 0 && <p>No appointments found.</p>}
          {appointments.map(a => (
            <div key={a._id || a.id} className="appointment-row">
              <div className="appointment-left">
                <img src={getDoctorImage(a.doctor?.picture)} alt={a.doctor?.name} />
              </div>
              <div className="appointment-body">
                <h4>{a.doctor?.name}</h4>
                <p className="muted">{a.doctor?.specialty}</p>
                <p style={{marginTop:4}}>
                  <strong>Address:</strong><br />
                  {a.doctor?.address1 || '24 main street'}<br />
                  {a.doctor?.address2 || '10 clause road'}
                </p>
                <p style={{marginTop:8, color:'#666'}}>
                  <strong>Date & Time:</strong> {new Date(a.date).toLocaleDateString()} | {a.slot || '12:00 PM'}
                </p>
              </div>
              <div className="appointment-actions">
                <div style={{marginBottom: '8px', padding: '6px 12px', background: '#f0f0f0', borderRadius: '4px', display: 'inline-block'}}>
                  <strong>Payment:</strong> {a.payment || 'CASH'}
                </div>
                {/* show status to patient and only allow cancel when still booked */}
                {a.status === 'cancelled' ? (
                  <span style={{color: '#ef4444', fontWeight: '600'}}>Cancelled</span>
                ) : a.status === 'completed' ? (
                  <span style={{color: '#10b981', fontWeight: '600'}}>Completed</span>
                ) : (
                  <button onClick={() => handleCancel(a._id || a.id)} className="btn-danger">Cancel appointment</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
