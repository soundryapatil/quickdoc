import React from 'react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ name, speciality, image }) => (
  <div className="doctor-card">
    <img src={image} alt={`Dr. ${name}`} />
    <h3>{name}</h3>
    <p>{speciality}</p>
  </div>
);

const TopDoctors = () => {
  const doctors = [
    { name: "Dr. Richard James", speciality: "General physician", image: require("../assets/doc1.png"), },
    { name: "Dr. Emily Johnson", speciality: "Dermatologist", image: require("../assets/doc2.png"), },
    { name: "Dr. Michael Williams", speciality: "Pediatrician", image: require("../assets/doc3.png"), },
    { name: "Dr. Sarah Brown", speciality: "Neurologist", image: require("../assets/doc5.png"), },
    { name: "Dr. David Jones", speciality: "Gastroenterologist", image: require("../assets/doc4.png"), },
    { name: "Dr. Jessica Garcia", speciality: "General physician", image: require("../assets/doc6.png"), },
    { name: "Dr. Daniel Miller", speciality: "Dermatologist", image: require("../assets/doc7.png"), },
    { name: "Dr. Linda Davis", speciality: "Pediatrician", image: require("../assets/doc9.png"), },
    { name: "Dr. Robert Rodriguez", speciality: "Neurologist", image: require("../assets/doc8.png"), },
    { name: "Dr. Patricia Martinez", speciality: "Gastroenterologist", image: require("../assets/doc10.png"), },
  ];

  return (
    <section className="top-doctors">
      <div className="container">
        <div className="section-header">
          <h2>Top Doctors to Book</h2>
          <p>Simply browse through our extensive list of trusted doctors.</p>
        </div>
        <div className="doctors-grid">
          {doctors.map((doctor, index) => (
            <DoctorCard key={index} name={doctor.name} speciality={doctor.speciality} image={doctor.image} />
          ))}
        </div>
        <div className="more-btn-container">
          <Link to="/doctors" className="btn btn-outline">more</Link>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;