import React from 'react';

import aboutUsImg from '../assets/about_image.png'; 

const AboutUs = () => {
  return (
    <div className="about-us-page">
      <div className="container">
        <div className="about-header">
          <img src={aboutUsImg} alt="Doctors smiling" className="about-image" />
          <div className="about-text">
            <h1>About Us</h1>
            <p>Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling doctor appointments and accessing timely medical advice.</p>
            <p>Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here to support you every step of the way.</p>
            <h2>Our Vision</h2>
            <p>Our vision at Prescripto is to create a seamless healthcare experience for everyone. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
          </div>
        </div>

        <div className="why-choose-us">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Efficiency</h3>
              <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
            </div>
            <div className="feature-item">
              <h3>Convenience</h3>
              <p>Access to a network of trusted healthcare professionals in your area.</p>
            </div>
            <div className="feature-item">
              <h3>Personalization</h3>
              <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;