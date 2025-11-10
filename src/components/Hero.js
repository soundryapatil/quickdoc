import React from 'react';
import assets from '../assets/groupdoc.jpg'

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>Book Appointment With Trusted Doctors</h1>
          <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
          <button className="btn btn-light">Book Appointment &rarr;</button>
        </div>
        <div className="hero-image">
          <img src={assets} alt="Group of trusted doctors" />
        </div>
      </div>
    </section>
  );
};

export default Hero;