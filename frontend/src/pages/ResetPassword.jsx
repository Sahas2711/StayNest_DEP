import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ForgotPassword.css';
import authService from '../services/AuthService';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
 const [email , setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
 
  const validateEmail = (email) => {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
const location = useLocation();
//const queryParams = new URLSearchParams(location.search);
//const email = queryParams.get('email');
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    //console.log('Resetting password for:', email);
    
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Simulate API call
    const res = authService.resetPassword({ email, password:newPassword });
   // console.log(res);
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="logo-section">
            <h1 className="logo">StayNest</h1>
          </div>
          <div className="success-content">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <h2>Password Reset Successful</h2>
            <p className="success-message">
              Your password has been updated. You can now log in with your new password.
            </p>
            <Link to="/login" className="back-to-login-btn">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="logo-section">
          <h1 className="logo">StayNest</h1>
        </div>
        <div className="content-section">
          <div className="header-content">
            <h2>Set a New Password</h2>
            <p>Enter your new password below.</p>
          </div>
          <form onSubmit={handleSubmit} className="forgot-form">
            { <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={error && (!email || error.toLowerCase().includes('email')) ? 'error' : ''}
                autoComplete="email"
              />
            </div> }
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={error && error.toLowerCase().includes('password') ? 'error' : ''}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={error && error.toLowerCase().includes('password') ? 'error' : ''}
                autoComplete="new-password"
              />
            </div>
            {error && <span className="error-message">{error}</span>}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Resetting...</span>
                </>
              ) : (
                'Set New Password'
              )}
            </button>
          </form>
          <div className="footer-links">
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 