import React from 'react';
import '../styles/About.css';
import { FaSearch, FaClipboardCheck, FaHome, FaStar } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-heading">
        How <span>STAYNEST</span> Works
      </h2>
      <p className="about-subtext">
        Finding your perfect accommodation has never been easier. Follow these
        simple steps to secure your next home.
      </p>

      <div className="steps-container">
        <div className="step-card">
          <div className="step-number">1</div>
          <div className="step-icon">
            <FaSearch />
          </div>
          <h3>Search & Explore</h3>
          <p>Find PGs tailored to your needs with our smart search filters.</p>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <div className="step-icon yellow">
            <FaClipboardCheck />
          </div>
          <h3>Book Instantly</h3>
          <p>Secure your room online in a few clicks with our seamless booking.</p>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <div className="step-icon">
            <FaHome />
          </div>
          <h3>Move In</h3>
          <p>Enjoy a comfortable, safe stay in your verified accommodation.</p>
        </div>

        <div className="step-card">
          <div className="step-number">4</div>
          <div className="step-icon yellow">
            <FaStar />
          </div>
          <h3>Rate & Review</h3>
          <p>Share your experience and help build our community.</p>
        </div>
      </div>

      <p className="about-cta-text">
        Ready to get started? Join thousands of happy tenants.
      </p>
      <a href="/login" className="start-search-btn">Start Your Search</a>
    </div>
  );
};

export default About;
