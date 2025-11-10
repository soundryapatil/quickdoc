import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import api from '../api';
import { getDoctorImage } from '../assets/images';

const DoctorDetails = () => {
  const [search] = useSearchParams();
  const id = search.get('id');
  const [doctor, setDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState('9:30 AM');

  const days = [
    { day: 'MON', date: '10' }, { day: 'TUE', date: '11' },
    { day: 'WED', date: '12' }, { day: 'THU', date: '13' },
    { day: 'FRI', date: '14' }, { day: 'SAT', date: '15' },
    { day: 'SUN', date: '16' }
  ];

  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM",
    "10:30 AM", "11:00 AM", "11:30 AM"
  ];

  useEffect(() => {
    if (!id) return;
    api.getDoctor(id).then(setDoctor).catch(err => console.error(err));
  }, [id]);

  const handleBook = async () => {
    try {
      await api.createAppointment(id, new Date().toISOString(), selectedTime);
      alert('Booked');
    } catch (err) {
      console.error(err);
      alert('Booking failed: ' + (err.response?.message || err.message));
    }
  };

  if (!doctor) return <div className="container"><p>Loading doctor...</p></div>;

  const relatedDoctors = [
    { name: "Dr. Emily Johnson", speciality: "General Physician", isAvailable: true, image: getDoctorImage('/assets/doc2.png') },
    { name: "Dr. Michael William", speciality: "General Physician", isAvailable: false, image: getDoctorImage('/assets/doc3.png') },
    { name: "Dr. Sarah Brown", speciality: "General Physician", isAvailable: true, image: getDoctorImage('/assets/doc5.png') },
    { name: "Dr. David Jones", speciality: "General Physician", isAvailable: true, image: getDoctorImage('/assets/doc4.png') },
    { name: "Dr. Jessica Garcia", speciality: "General physician", isAvailable: false, image: getDoctorImage('/assets/doc6.png') },
  ];

  return (
    <div className="doctor-details-page">
      <div className="container">
        <div className="doctor-profile-card">
          <div className="doctor-profile-img">
            <img src={getDoctorImage(doctor.picture)} alt={doctor.name} />
          </div>
          <div className="doctor-profile-info">
            <h2>{doctor.name} ●</h2>
            <p className="speciality-location">{doctor.experience} | {doctor.specialty}</p>
            <div className="about-doctor">
              <h4>About</h4>
              <p>{doctor.about || 'No additional information provided.'}</p>
            </div>
            <p className="appointment-fee">Appointment fee: ${doctor.fees || 0}</p>
          </div>
        </div>

        <div className="booking-slots-card">
          <h3>Booking slots</h3>
          <div className="day-selector">
            {days.map((day, index) => (
              <div
                key={index}
                className={`day-slot ${selectedDay === index ? 'selected' : ''}`}
                onClick={() => setSelectedDay(index)}
              >
                <p>{day.day}</p>
                <span>{day.date}</span>
              </div>
            ))}
          </div>
          <div className="time-selector">
            {timeSlots.map(time => (
              <button
                key={time}
                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <button className="btn btn-primary book-btn" onClick={handleBook}>Book an appointment</button>
        </div>

        <div className="related-doctors">
          <div className="section-header">
            <h2>Related Doctors</h2>
            <p>Simply browse through our extensive list of trusted doctors.</p>
          </div>
          <div className="doctors-grid">
            {relatedDoctors.map((doc, index) => (
              <DoctorCard
                key={index}
                id={index}
                name={doc.name}
                speciality={doc.speciality}
                isAvailable={doc.isAvailable}
                image={doc.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;