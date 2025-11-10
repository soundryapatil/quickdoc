import React, { useEffect, useState } from 'react';
import api from '../api';
import { getDoctorImage } from '../assets/images';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setError(null);
      const [user, doctor] = await Promise.all([api.getProfile(), api.getDoctorProfile()]);
      setProfile(user || null);
      setDoctorInfo(doctor || null);
      // populate form once loaded
      if (doctor) setForm({
        name: user?.name || '',
        degree: doctor.degree || '',
        specialty: doctor.specialty || '',
        experience: doctor.experience || '',
        fees: doctor.fees || '',
        about: doctor.about || '',
        address1: doctor.address1 || '',
        address2: doctor.address2 || '',
        available: !!doctor.available,
        picture: doctor.picture || ''
      });
      if (!doctor) setError('Doctor profile not found');
    } catch (err) {
      console.error('Failed to load profile', err);
      // show a friendly message instead of keeping the page in Loading state
      const msg = err.response?.message || err.message || 'Failed to load profile';
      setError(msg);
    }
  };

  if (error) return <div style={{padding:20}}><p style={{color:'#c00'}}>{error}</p></div>;
  if (!profile || !doctorInfo) return <p>Loading...</p>;

  return (
    <div className="doctor-profile">
      <div style={{maxWidth: '600px'}}>
        <img 
          src={getDoctorImage(doctorInfo.picture)} 
          alt={profile.name}
          style={{width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px'}}
        />
        
        {!editing ? (
          <>
            <h2 style={{marginTop: '20px'}}>{profile.name}</h2>
            <p style={{color: '#666', marginTop: '4px'}}>
              {doctorInfo.degree || 'MBBS'} - {doctorInfo.specialty}
            </p>
            <p style={{marginTop: '8px'}}>{doctorInfo.experience}</p>
          </>
        ) : (
          <div style={{display:'grid', gap:8}}>
            <input value={form.name || ''} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Full name" />
            <input value={form.degree || ''} onChange={e => setForm(f => ({...f, degree: e.target.value}))} placeholder="Degree" />
            <input value={form.specialty || ''} onChange={e => setForm(f => ({...f, specialty: e.target.value}))} placeholder="Specialty" />
            <input value={form.experience || ''} onChange={e => setForm(f => ({...f, experience: e.target.value}))} placeholder="Experience (e.g. 5 years)" />
            <input value={form.fees || ''} onChange={e => setForm(f => ({...f, fees: e.target.value}))} placeholder="Fees" />
          </div>
        )}

        <div style={{marginTop: '24px'}}>
          <h3>About :</h3>
          {!editing ? (
            <p style={{color: '#666', lineHeight: '1.6', marginTop: '8px'}}>
              {doctorInfo.about || 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.'}
            </p>
          ) : (
            <textarea value={form.about || ''} onChange={e => setForm(f => ({...f, about: e.target.value}))} rows={6} />
          )}
        </div>

        <div style={{marginTop: '24px'}}>
          <h3>Appointment fee: <span style={{color: '#5f6fff'}}>${doctorInfo.fees}</span></h3>
        </div>

        <div style={{marginTop: '24px'}}>
          <h3>Address:</h3>
          {!editing ? (
            <p style={{color: '#666', marginTop: '8px'}}>
              {doctorInfo.address1 || '24 main street'}<br />
              {doctorInfo.address2 || '10 clause road'}
            </p>
          ) : (
            <div style={{display:'grid', gap:8}}>
              <input value={form.address1 || ''} onChange={e => setForm(f => ({...f, address1: e.target.value}))} placeholder="Address line 1" />
              <input value={form.address2 || ''} onChange={e => setForm(f => ({...f, address2: e.target.value}))} placeholder="Address line 2" />
            </div>
          )}
        </div>

        <div style={{marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          {!editing ? (
            <>
              <input type="checkbox" checked={doctorInfo.available} readOnly />
              <label>Available</label>
            </>
          ) : (
            <>
              <label style={{display:'flex', alignItems:'center', gap:8}}>
                <input type="checkbox" checked={!!form.available} onChange={e => setForm(f => ({...f, available: e.target.checked}))} /> Available
              </label>
            </>
          )}
        </div>

        {!editing ? (
          <button onClick={() => setEditing(true)} style={{
            marginTop: '24px',
            padding: '10px 24px',
            background: '#5f6fff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>Edit</button>
        ) : (
          <div style={{display:'flex', gap:12, marginTop:24}}>
            <button onClick={async () => {
              // save
              try {
                const docId = doctorInfo.id || doctorInfo._id;
                const docPayload = {
                  degree: form.degree,
                  specialty: form.specialty,
                  experience: form.experience,
                  fees: Number(form.fees) || 0,
                  about: form.about,
                  address1: form.address1,
                  address2: form.address2,
                  available: !!form.available,
                  picture: form.picture
                };
                await api.updateDoctor(docId, docPayload);
                // update user name as well
                await api.updateProfile({ name: form.name });
                await loadProfile();
                setEditing(false);
                alert('Saved');
              } catch (err) {
                console.error(err);
                alert('Save failed: ' + (err.response?.message || err.message));
              }
            }} style={{padding:'10px 18px', background:'#4CAF50', color:'white', border:'none', borderRadius:6}}>Save</button>
            <button onClick={() => { setEditing(false); setForm({
              name: profile?.name || '',
              degree: doctorInfo.degree || '',
              specialty: doctorInfo.specialty || '',
              experience: doctorInfo.experience || '',
              fees: doctorInfo.fees || '',
              about: doctorInfo.about || '',
              address1: doctorInfo.address1 || '',
              address2: doctorInfo.address2 || '',
              available: !!doctorInfo.available,
              picture: doctorInfo.picture || ''
            }); }} style={{padding:'10px 18px', background:'#ddd', border:'none', borderRadius:6}}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
