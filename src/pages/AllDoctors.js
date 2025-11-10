import React, { useEffect, useState } from 'react';
import DoctorCard from '../components/DoctorCard';
import api from '../api';
import { getDoctorImage } from '../assets/images';

const FilterSidebar = ({ specialities, selected, onSelect }) => {
  return (
    <aside className="filter-sidebar">
      <h4>Speciality</h4>
      <ul>
        <li className={!selected ? 'active' : ''} onClick={() => onSelect(null)}>All</li>
        {specialities.map((spec, index) => (
          <li key={index} className={selected === spec ? 'active' : ''} onClick={() => onSelect(spec)}>
            {spec}
          </li>
        ))}
      </ul>
    </aside>
  );
};

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);

  const specialities = [
    "General physician", "Dermatologist", "Pediatricians",
    "Neurologist", "Gastroenterologist", "Gynecologist"
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getDoctors(selectedSpeciality)
      .then(data => {
        if (!mounted) return;
        setDoctors((data || []).map(d => ({
          id: d._id || d.id,
          name: d.name,
          speciality: d.specialty,
          isAvailable: d.available,
          image: getDoctorImage(d.picture)
        })));
      })
      .catch(err => console.error('Failed to load doctors', err))
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [selectedSpeciality]);

  return (
    <div className="all-doctors-page">
      <div className="container">
        <div className="page-header">
          <h2>Browse through the doctors specialist.</h2>
        </div>
        <div className="doctors-layout">
          <FilterSidebar specialities={specialities} selected={selectedSpeciality} onSelect={setSelectedSpeciality} />
          <main className="doctors-grid-container">
            <div className="doctors-grid all-doctors">
              {loading ? <p>Loading doctors...</p> : doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.name}
                  speciality={doctor.speciality}
                  isAvailable={doctor.isAvailable}
                  image={doctor.image}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllDoctors;