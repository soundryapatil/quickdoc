import React, { useEffect, useState } from 'react';
import api from '../api';
import { getDoctorImage } from '../assets/images';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    api.getDoctors().then(setDoctors).catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-doctors-list">
      <h2>All Doctors</h2>
      <div className="doctors-grid admin-grid">
        {doctors.map(doc => (
          <div className="doctor-card admin-card" key={doc._id || doc.id}>
            <img src={getDoctorImage(doc.picture)} alt={doc.name} />
            <h4>{doc.name}</h4>
            <p>{doc.specialty}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
