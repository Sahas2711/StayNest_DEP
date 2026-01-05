import '../styles/Home.css';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import About from './about'; 
import WhyChoose from './WhyChoose';
import Cta from './Cta';
import ContactSupportHome from './ContactSupportHome';

const Home = () => {
  return (
    <>
      {/* --- Main home container --- */}
      <div className="home-container">
        <div className="text-section centered-text">
          <h1 className="hero-heading">
            Your nest away from home<br />
            <span>Find it. <strong>Book it.</strong> Live it.</span>
          </h1>
          <p>
            Explore verified PGs and hostels across your city in just a few clicks.
            Your next home away from home is waiting — safe, cozy, and affordable.
          </p>

          <div className="search-box">
            <FaMapMarkerAlt className="icon" />
            <input
              className="square-search-input"
              placeholder="Enter city or locality..."
            />
            <Link to="/login" className="square-search-btn" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,textDecoration:'none'}}>
              <FaSearch className="icon white-icon" />
              <span>Search PGs</span>
            </Link>
          </div>

          <div className="cta-buttons">
            <Link to="/register" className="btn lavender">Browse PGs</Link>
            <Link to="/register" className="btn outline">List Your PG</Link>
          </div>

          <div className="stats-bar">
            <div className="stat">
              <span className="highlight">1,00,000+</span><br />
              <span className="stat-label">Homes Rented / Sold</span>
            </div>
            <div className="stat">
              <span className="highlight">2,00,000+</span><br />
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat">
              <span className="highlight">1,00,000+</span><br />
              <span className="stat-label">Trusted Owners</span>
            </div>
          </div>
        </div> 
      </div>

      
      <div className="about-wrapper" id="about">
        <About />
      </div>

      <div className="whychoose-wrapper">
        <WhyChoose />
      </div>

      <div className="Cta-wrapper">
        <Cta />
      </div>

      {/* Contact Support Section (Home Page) */}
      <div className="contact-support-wrapper" id="contact">
        <ContactSupportHome />
      </div>
    </>
  );
};

export default Home;











