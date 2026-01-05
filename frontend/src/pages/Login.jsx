import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css'; // Make sure path is correct
import authService from '../services/AuthService';

const Login = () => {
    const navigate = useNavigate();

    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showNotification, setShowNotification] = useState(false); // Controls visibility
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'TENANT'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous messages and hide notification before a new attempt
        setSuccessMsg("");
        setErrorMsg("");
        setShowNotification(false);

        try {
            let result;
            // Core login logic: calling authService based on role
            if (formData.role === 'TENANT') {
                result = await authService.login(formData);
            } else if (formData.role === 'OWNER') {
                result = await authService.ownerLogin(formData);
            }

            // Core login logic: setting localStorage
            localStorage.setItem('token', result.jwtToken);
            localStorage.setItem('id', result.userId);

            // Set success message and show notification
            setSuccessMsg("Login successful! Redirecting...");
            setShowNotification(true);

            // Delay navigation to allow the user to see the success notification
            setTimeout(() => {
                if (formData.role === 'TENANT') {
                    navigate('/tenant/dashboard');
                } else if (formData.role === 'OWNER') {
                    navigate('/owner/dashboard');
                }
            }, 1500); // Notification visible for 1.5 seconds

        } catch (err) {
            // Log error for debugging
            console.error("Login error:", err?.response?.data?.message || err.message || "Unknown error");

            // Set error message and show notification
            setErrorMsg("Login failed. Please check your credentials.");
            setShowNotification(true);

            // Optionally hide error notification after some time
            setTimeout(() => {
                setShowNotification(false);
                setErrorMsg(""); // Clear the message after hiding
            }, 3000); // Error notification visible for 3 seconds
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="login-page">
            {/* Notification Component - Renders based on showNotification state */}
            {showNotification && (
                <div className={`notification ${successMsg ? 'success' : 'error'}`}>
                    {successMsg || errorMsg}
                </div>
            )}

            <div className="login-container">
                <div className="logo-section">
                    <Link to="/">
                        <h1 className="logo">STAYNEST</h1>
                    </Link>
                </div>
                <div className="header-content">
                    <h2>Welcome Back</h2>
                    <p>Login to your account and manage your space</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select name="role" id="role" value={formData.role} onChange={handleChange}>
                            <option value="TENANT">Tenant</option>
                            <option value="OWNER">Owner</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="forgot-password">
                        <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
                    </div>
                    <button type="submit" className="login-btn">Sign In</button>
                </form>
                <div className="signup-text">
                    Don't have an account? <a href="/register">Sign up here</a>
                </div>
            </div>
        </div>
    );
};

export default Login;