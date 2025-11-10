import React from 'react';

import contactImg from '../assets/contact_image.png'; 

const ContactUs = () => {
  return (
    <div className="contact-us-page">
      <div className="container">
        <h1>Contact Us</h1>
        <div className="contact-content">
          <div className="contact-image-container">
            <img src={contactImg} alt="Doctor with patient" className="contact-image" />
          </div>
          <div className="contact-info">
            <div className="office-info">
              <h3>Our Office</h3>
              <p>5470V Wilms Station</p>
              <p>Kolhapur, Maharashtra, India</p>
              <p>Tel: +91 1234567890</p>
              <p>Email: contact@quickdoc.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;