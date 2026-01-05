import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ForgotPassword.css';
import authService from '../services/AuthService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    setError('Please enter your email address');
    return;
  }
  if (!email.includes('@')) {
    setError('Please enter a valid email address');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    //console.log('Forgot password request for:', email);
    await authService.forgotPassword(email);
    //alert("A password reset link has been sent to your email address.");
    setIsSuccess(true);
  } catch (err) {
    setError(
      err?.response?.data?.message ||
      "User not found. Please check your email or register if you don't have an account."
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleBackToLogin = () => {
    // Navigate back to login page
    window.history.back();
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
            
            <h2>Check Your Email</h2>
            <p className="success-message">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-subtitle">
              Click the link in your email to reset your password. The link will expire in 1 hour.
            </p>
            
            <button 
              className="back-to-login-btn"
              onClick={handleBackToLogin}
            >
              Back to Login
            </button>
            
            <div className="help-text">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button 
                className="resend-link"
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
              >
                try again
              </button>
            </div>
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
            <h2>Forgot your password?</h2>
            <p>No worries! Enter your email and we'll send you reset instructions.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={error ? 'error' : ''}
              />
              {error && <span className="error-message">{error}</span>}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Sending...</span>
                </>
              ) : (
                'Send Reset Link'
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

export default ForgotPassword; 