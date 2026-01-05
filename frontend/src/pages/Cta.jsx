import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Cta.css';

const Cta = () => {
  return (
    <div className="cta-container">
      <div className="cta-icon">
        <FaHome />
      </div>
      <h2 className="cta-heading">
        Ready to find your next <span>home away from home?</span>
      </h2>
      <p className="cta-subtext">
        Join thousands of students and working professionals who have found their perfect stay through StayNest.
      </p>

      {/* <div className="cta-buttons">
        <Link to="/listings" className="cta-btn">
          <FaHome /> Browse PGs →
        </Link>
      </div> */}

      <div className="cta-stats">
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <p>Verified Properties</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">24/7</span>
          <p>Customer Support</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">Instant</span>
          <p>Booking Confirmation</p>
        </div>
      </div>
    </div>
  );
};

export default Cta;
