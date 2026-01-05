import React from 'react';
import '../styles/Footer.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h2 className="logo">StayNest</h2>
          <p className="footer-description">
            Your trusted partner in finding the perfect accommodation. We connect students and professionals with verified, safe, and affordable PGs and hostels.
          </p>
          <h4>About StayNest</h4>
          <ul>
            <li>Our Story</li>
            <li>Team</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Browse PGs</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li>FAQs</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Safety Guidelines</li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Contact</h4>
          <p><FaEnvelope /> staynest06@gmail.com </p>
          <p><FaPhone /> +91 90962 47010</p>
          <p><FaMapMarkerAlt /> Pune, Maharastra, India</p>
          <div className="social-icons">
            <FaFacebook />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedin />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 StayNest. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookies</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

