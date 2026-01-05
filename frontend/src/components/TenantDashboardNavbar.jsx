import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/DashboardNavbar.css';
const TenantDashboardNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu visibility
  const menuRef = useRef(null); // Ref for the menu container
  const iconRef = useRef(null); // Ref for the menu icon

  const handleLogout = () => {
    console.log("User logged out!");
    setIsMenuOpen(false); // Close menu on logout
    navigate('/'); // Navigate to the home page or login page after logout
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotifications = () => {
    setIsMenuOpen(false);
    navigate('/owner/notifications');
  };

  const handleAccountSettings = () => {
    setIsMenuOpen(false);
    navigate('/account-settings');
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/logo.png" alt="StayNest" className="navbar-logo-img" />
          </Link>
        </div>
        <div className="navbar-center-links">
          <Link to="/tenant/dashboard">Dashboard</Link>
          <Link to="/listings">Browse PGs</Link>
          <Link to="/my-reviews">Review</Link>
          <Link to="/contactsupport">Contact</Link>
        </div>
        <div className="navbar-auth">
          {/* Avatar and Menu Toggle Icon */}
          <div className="header-avatar">{localStorage.getItem('userFirstLetter')?.toLocaleUpperCase() }</div>
          <i
            ref={iconRef}
            className="fas fa-bars menu-toggle-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          ></i>
        </div>
      </div>

      {/* Backdrop to close menu on outside click */}
      {isMenuOpen && <div className="backdrop" onClick={() => setIsMenuOpen(false)}></div>}

      {/* User Menu Container - Conditionally rendered and positioned */}
      <div ref={menuRef} className={`user-menu-wrapper ${isMenuOpen ? 'open' : ''}`}>
        {/* Header (User Menu Top Bar) - now inside the dropdown */}
        <div className="header">
          <div className="header-text">Account</div> {/* Changed text to 'Account' as per common dropdowns */}
          {/* No avatar or menu icon here, they are in the main navbar */}
        </div>

        {/* Main User Menu Card */}
        <div className="menu-card">
          <div className="menu-section">
            {/*<div className="menu-item" onClick={() => setIsMenuOpen(false)}><i className="far fa-comment-dots"></i><span>Messages</span></div>*/}
            <div className="menu-item" onClick={() => { navigate('/my-profile'); setIsMenuOpen(false); }}><i className="far fa-user"></i><span>Profile</span></div>
          </div>
          <div className="menu-section">
            {/* <div className="menu-item" onClick={handleNotifications}><i className="far fa-bell"></i><span>Notifications</span><span className="notification-badge">1</span></div> */}
            <div className="menu-item" onClick={handleAccountSettings}><i className="fas fa-cog"></i><span>Account settings</span></div>
          </div>
          <div className="menu-section">
            <div className="menu-item logout-item" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i><span>Log out</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TenantDashboardNavbar;