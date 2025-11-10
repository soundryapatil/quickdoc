import React from "react";

import assets1 from "../assets/General_physician.svg";
import assets2 from "../assets/Gynecologist.svg";
import assets3 from "../assets/Dermatologist.svg";
import assets4 from "../assets/Pediatricians.svg";
import assets5 from "../assets/Neurologist.svg";
import assets6 from "../assets/Gastroenterologist.svg";

const SpecialityItem = ({ name, icon }) => (
  <div className="speciality-item">
    <div className="speciality-icon">
      <img src={icon} alt={`${name} Icon`} />
    </div>
    <p>{name}</p>
  </div>
);

const Speciality = () => {
  const specialities = [
    { name: "General physician", icon: assets1 },
    { name: "Gynaecologist", icon: assets2 },
    { name: "Dermatologist", icon: assets3 },
    { name: "Pediatrician", icon: assets4 },
    { name: "Neurologist", icon: assets5 },
    { name: "Gastroenterologist", icon: assets6 },
  ];

  return (
    <section className="speciality">
      <div className="container">
        <div className="section-header">
          <h2>Find by Speciality</h2>
          <p>
            Simply browse through our extensive list of trusted doctors, schedule your
            appointment hassle-free.
          </p>
        </div>
        <div className="speciality-grid">
          {specialities.map((spec) => (
            <SpecialityItem key={spec.name} name={spec.name} icon={spec.icon} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speciality;