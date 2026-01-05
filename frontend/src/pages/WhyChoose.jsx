import { FaShieldAlt, FaDollarSign, FaLock, FaHeart } from 'react-icons/fa';
import '../styles/WhyChoose.css';

const WhyChoose = () => {
  return (
    <div className="whychoose-container">
      <h2 className="whychoose-heading">
        Why Choose <span>STAYNEST?</span>
      </h2>
      <p className="whychoose-subtext">
        We’re not just another platform. We’re your trusted partner in finding the perfect accommodation.
      </p>

      <div className="whychoose-features">
        <div className="feature-card">
          <div className="feature-icon purple-bg">
            <FaShieldAlt />
          </div>
          <h3>Verified Listings</h3>
          <p>We personally verify every property before listing to ensure quality and authenticity.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon orange-bg">
            <FaDollarSign />
          </div>
          <h3>Transparent Pricing</h3>
          <p>No hidden costs. All-inclusive rents with complete price breakdown upfront.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon purple-bg">
            <FaLock />
          </div>
          <h3>Secure Booking</h3>
          <p>Safe and seamless online booking with secure payment gateway protection.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon orange-bg">
            <FaHeart />
          </div>
          <h3>Owner Support</h3>
          <p>Get direct support from verified owners anytime with our dedicated helpline.</p>
        </div>
      </div>

      {/* <div className="whychoose-stats">
        <div className="stat-item">
          <span className="stat-number">1000+</span>
          <p>Verified Properties</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">50+</span>
          <p>Cities Covered</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">25K+</span>
          <p>Happy Tenants</p>
        </div>
        <div className="stat-item">
          <span className="stat-number">98%</span>
          <p>Satisfaction Rate</p>
        </div>
      </div> */}
    </div>
  );
};

export default WhyChoose;
