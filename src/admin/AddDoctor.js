import React, { useState } from 'react';
import api from '../api';

const AddDoctor = () => {
  const [form, setForm] = useState({ name: '', specialty: '', experience: '', fees: '', about: '', picture: '' });
  const [msg, setMsg] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createDoctor(form);
      setMsg('Doctor added');
      setForm({ name: '', specialty: '', experience: '', fees: '', about: '', picture: '' });
    } catch (err) {
      console.error(err);
      setMsg('Failed to add doctor');
    }
  };

  return (
    <div className="admin-add-doctor">
      <h2>Add Doctor</h2>
      <form onSubmit={handleSubmit} className="add-doctor-form">
        <div className="row">
          <input name="name" value={form.name} onChange={onChange} placeholder="Doctor name" />
          <input name="specialty" value={form.specialty} onChange={onChange} placeholder="Speciality" />
        </div>
        <div className="row">
          <input name="experience" value={form.experience} onChange={onChange} placeholder="Experience" />
          <input name="fees" value={form.fees} onChange={onChange} placeholder="Fees" />
        </div>
        <div className="row">
          <input name="picture" value={form.picture} onChange={onChange} placeholder="Picture URL" />
        </div>
        <div>
          <textarea name="about" value={form.about} onChange={onChange} placeholder="About" />
        </div>
        <button className="btn btn-primary" type="submit">Add doctor</button>
        {msg && <p>{msg}</p>}
      </form>
    </div>
  );
};

export default AddDoctor;
