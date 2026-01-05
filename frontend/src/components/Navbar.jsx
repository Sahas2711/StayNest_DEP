import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import '../styles/NavBar.css';
import { FaHome, FaInfoCircle, FaPhoneAlt, FaBed, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // ✅ Added icons

const Navbar = () => {

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src="/logo.png" alt="StayNest Logo" className="navbar-logo-img" />
        </Link>
      </div>
     <div class="navbar-toggle" id="mobile-menu">
    <i class="fas fa-bars"></i>
  </div>
      {/* Center: Main navigation */}
      <div className="navbar-center-links">
        <Link to="/"><FaHome className="nav-icon" /> Home</Link>
        <Link to="/login"><FaBed className="nav-icon" /> Browse PGs</Link>
        <a href="/#about"><FaInfoCircle className="nav-icon" /> About</a>
        <HashLink smooth to="/#contact"><FaPhoneAlt className="nav-icon" /> Contact</HashLink>
      </div>

      {/* Right: Login/Register */}
      <div className="navbar-auth">
        <Link to="/login" className="login-link">
          <FaSignInAlt className="nav-icon" /> Login
        </Link>
        <Link to="/register" className="btn-register">
          <FaUserPlus className="nav-icon" /> Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;