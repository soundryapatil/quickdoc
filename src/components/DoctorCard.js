import React from 'react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ id, name, speciality, isAvailable, image }) => {
  const to = id ? `/doctor-details?id=${encodeURIComponent(id)}` : '/doctor-details';
  return (
    <Link to={to} className="doctor-card-link">
      <div className="doctor-card">
        {isAvailable && <span className="availability-tag">● Available</span>}
        <img src={image} alt={`Dr. ${name}`} />
        <h3>{name}</h3>
        <p>{speciality}</p>
      </div>
    </Link>
  );
};

export default DoctorCard;