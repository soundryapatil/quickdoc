import React from 'react';

import asset from "../assets/appointment_img.png";

const CTA = () => {
  return (
    <section className="cta-container">
        <div className="cta">
            <div className="container cta-content">
                <div className="cta-text">
                <h2>Book Appointment <br /> With 100+ Trusted Doctors</h2>
                <button className="btn btn-light">Create account</button>
                </div>
                <div className="cta-image">
                <img src={asset} alt="Doctor pointing" />
                </div>
            </div>
        </div>
    </section>
  );
};

export default CTA;