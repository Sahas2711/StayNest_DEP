import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import authService from '../services/AuthService';
import { FaCheckCircle } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "TENANT",
    gender: "",
    userType: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const newErrors = {};
    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    const lastTen = phoneDigits.slice(-10);

    if (!/^[a-zA-Z\s]+$/.test(formData.name))
      newErrors.name = "Enter a valid name.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!/^[6-9]\d{9}$/.test(lastTen))
      newErrors.phoneNumber = "Enter a valid 10-digit Indian mobile number (starts with 6-9).";
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password))
      newErrors.password = "Min 8 chars, 1 letter, 1 number. Special chars allowed.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.gender) newErrors.gender = "Please select gender.";
    if (formData.role === "TENANT" && !formData.userType)
      newErrors.userType = "Please select tenant type.";
    if (!formData.agree) newErrors.agree = "You must accept the terms.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    // Pick correct API based on role
    let res;
    if (formData.role === "OWNER") {
      res = await authService.registerOwner(formData);
    } else {
      res = await authService.registerUser(formData);
    }
    setSuccessMsg("Account created successfully! Please login.");
    setTimeout(() => {
      navigate('/login');
    }, 500);
  } catch (err) {
    alert("Email already exists. Please try another one.");
  }
 }
  return (
    <>
      {successMsg && (
        <div className="register-success-popup">
          <FaCheckCircle style={{ marginRight: '8px', verticalAlign: 'middle', color: '#2AB7CA', fontSize: '1.3em' }} />
          {successMsg}
        </div>
      )}
      <div className="register-page">
        <div className="register-container">
        <div className="role-toggle">
          <button
            className={formData.role === "TENANT" ? "active" : ""}
            onClick={() => setFormData({ ...formData, role: "TENANT" })}
          >
            I'm a Tenant
          </button>
          <button
            className={formData.role === "OWNER" ? "active" : ""}
            onClick={() =>
              setFormData({ ...formData, role: "OWNER", userType: "" })
            }
          >
            I'm an Owner
          </button>
        </div>

        <div className="register-icon">
          <FontAwesomeIcon icon={faUserPlus} />
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}

          {formData.role === "TENANT" && (
            <>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="">Select Tenant Type</option>
                <option value="Student">Student</option>
                <option value="Working Professional">
                  Working Professional
                </option>
              </select>
              {errors.userType && <p className="error">{errors.userType}</p>}
            </>
          )}

          <div className="checkbox-container">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="checkbox-new"
              style={{ width: "10%" }}
            />
            <label>
              I agree to StayNest’s <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>
            </label>
          </div>
          {errors.agree && <p className="error">{errors.agree}</p>}

          <button type="submit" className="submit-btn">
            Create Account →
          </button>

          {/* ✅ Login Redirect Link */}
          <div className="login-redirect">
            Already have an account? <a href="/login">Login</a>
          </div>
        </form>

        {/* <div className="social-login">
          <div className="or-divider">
            Or continue with
            <div className="social-buttons">
              <button className="social google">Google</button>
              <button className="social facebook">Facebook</button>
            </div>
          </div>
        </div>*/}
        </div>
      </div>
    </>
  );
};

export default Register;