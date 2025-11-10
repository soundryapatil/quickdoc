import React, { useEffect, useState } from 'react';
import api from '../api';
import { getAvatar } from '../assets/images';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.getProfile().then(res => { setProfile(res); setForm(res); }).catch(err => console.error(err));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      const res = await api.updateProfile(form);
      setProfile(res);
      setEditing(false);
      alert('Saved');
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  if (!profile) return <div className="container"><p>Loading profile...</p></div>;

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
          <img src={getAvatar(profile.picture)} alt={profile.name} className="profile-avatar" />
        </div>
        <div>
          <h2>{profile.name}</h2>
          <p className="muted">{profile.email}</p>
        </div>
      </div>

      <div className="profile-section">
        <h4>Contact Information</h4>
        <div className="field"><label>Email id:</label><span>{profile.email}</span></div>
        <div className="field"><label>Phone:</label><span>{profile.phone || '-'}</span></div>
        <div className="field"><label>Address:</label><span>{profile.address || '-'}</span></div>
      </div>

      <div className="profile-section">
        <h4>Basic Information</h4>
        <div className="field"><label>Gender:</label><span>{profile.gender || 'Male'}</span></div>
        <div className="field"><label>Birthday:</label><span>{profile.dob || profile.birthday || '1995-01-01'}</span></div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
        <button className="btn" onClick={() => setEditing(true)}>Edit</button>
      </div>

      {editing && (
        <div className="profile-edit" style={{ marginTop: 18 }}>
          <h4>Edit Profile</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input name="name" placeholder="Full name" value={form.name || ''} onChange={onChange} />
            <input name="phone" placeholder="Phone" value={form.phone || ''} onChange={onChange} />
            <input name="address" placeholder="Address" value={form.address || ''} onChange={onChange} />
            <input name="gender" placeholder="Gender" value={form.gender || ''} onChange={onChange} />
            <input name="birthday" placeholder="Birthday (YYYY-MM-DD)" value={form.birthday || ''} onChange={onChange} />
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={save}>Save information</button>
            <button className="btn btn-secondary" onClick={() => { setEditing(false); setForm(profile); }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
