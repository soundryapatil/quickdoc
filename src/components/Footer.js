import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Link to="/" className="logo">QuickDoc</Link>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
        </div>
        <div className="footer-links">
          <h4>COMPANY</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/doctors">All Doctors</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
            <li><Link to="/privacy">Privacy policy</Link></li>
          </ul>
        </div>
        <div className="footer-contact">
          <h4>GET IN TOUCH</h4>
          <p>+1-212-456-7890</p>
          <p>quickdoc@gmail.com</p>
        </div>
      </div>
      <div className="footer-copyright">
        <p>Copyright © 2024 QuickDoc. All Right Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;