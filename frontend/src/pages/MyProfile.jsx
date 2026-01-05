import React, { useState, useEffect } from 'react';
import {
  FaEdit,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaBell,
  FaShieldAlt,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import '../styles/MyProfile.css';
import userService from '../services/UserService';
import authService from '../services/AuthService';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const user = await userService.getCurrentUser();
        setProfileData({
          fullName: user.name,
          email: user.email,
          phone: user.phoneNumber,
          dateOfBirth: user.dateOfBirth || '',
          gender: capitalize(user.gender),
          preferredCity: user.preferredCity || '',
          preferredLocality: user.preferredLocality || ''
        });
        setFormData({
          fullName: user.name,
          email: user.email,
          phone: user.phoneNumber,
          dateOfBirth: user.dateOfBirth || '',
          gender: capitalize(user.gender),
          preferredCity: user.preferredCity || '',
          preferredLocality: user.preferredLocality || ''
        });
        setError('');
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function capitalize(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const updateData = {
        name: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        preferredCity: formData.preferredCity,
        preferredLocality: formData.preferredLocality
      };
      const updated = await userService.updateUser(updateData);
      setProfileData({
        fullName: updated.name,
        email: updated.email,
        phone: updated.phoneNumber,
        dateOfBirth: updated.dateOfBirth,
        gender: capitalize(updated.gender),
        preferredCity: updated.preferredCity,
        preferredLocality: updated.preferredLocality
      });
      setIsEditing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    language: 'English',
    defaultCity: 'Bangalore'
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEditProfile = () => {
    setFormData({ ...profileData });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    const res =  authService.updatePassword({password :passwordData.newPassword});
  //  console.log('Password updated:', res);
    setShowPasswordForm(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="profile-container">
      <section className="header-section">
        <div className="header-content">
          <h1>My Profile</h1>
          <p>Manage your personal details and preferences.</p>
        </div>
      </section>

      <section className="profile-overview-section">
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-details">
              <h2>{profileData?.fullName}</h2>
              <div className="detail-item">
                <FaEnvelope />
                <span>{profileData?.email}</span>
              </div>
              <div className="detail-item">
                <FaPhone />
                <span>{profileData?.phone}</span>
              </div>
              <div className="detail-item">
                <FaMapMarkerAlt />
                <span>{profileData?.preferredCity}, {profileData?.preferredLocality}</span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              <FaEdit />
              Edit Profile
            </button>
          )}
        </div>
      </section>

      <section className="tabs-section">
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser />
            Profile Details
          </button>
          <button
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <FaBell />
            Preferences
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FaShieldAlt />
            Security
          </button>
        </div>
      </section>

      {activeTab === 'profile' && (
        <section className="form-section">
          <div className="form-card">
            <h3>Personal Information</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData?.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isEditing}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              {/* <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={formData?.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div> */}

              <div className="form-group">
                <label>Gender</label>
                <select
                  value={formData?.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred City</label>
                <input
                  type="text"
                  value={formData?.preferredCity}
                  onChange={(e) => handleInputChange('preferredCity', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Preferred Locality</label>
                <input
                  type="text"
                  value={formData?.preferredLocality}
                  onChange={(e) => handleInputChange('preferredLocality', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
                <button className="save-btn" onClick={handleSaveProfile}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === 'preferences' && (
        <section className="form-section">
          <div className="form-card">
            <h3>Account Preferences</h3>

            <div className="preferences-grid">
              <div className="preference-item">
                <div className="preference-header">
                  <FaBell />
                  <h4>Email Notifications</h4>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-header">
                  <FaPhone />
                  <h4>SMS Notifications</h4>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.smsNotifications}
                    onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-header">
                  <FaMapMarkerAlt />
                  <h4>Default City</h4>
                </div>
                <select
                  value={preferences.defaultCity}
                  onChange={(e) => handlePreferenceChange('defaultCity', e.target.value)}
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Indore">Indore</option>
                  <option value="Surat">Surat</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Patna">Patna</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Kanpur">Kanpur</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Faridabad">Faridabad</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Ranchi">Ranchi</option>
                  <option value="Guwahati">Guwahati</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                  <option value="Mysore">Mysore</option>
                  <option value="Aurangabad">Aurangabad</option>
                  <option value="Jodhpur">Jodhpur</option>
                  <option value="Noida">Noida</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="Agra">Agra</option>
                  <option value="Allahabad">Allahabad</option>
                  <option value="Howrah">Howrah</option>
                  <option value="Gwalior">Gwalior</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Jabalpur">Jabalpur</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Raipur">Raipur</option>
                  <option value="Kota">Kota</option>
                  <option value="Salem">Salem</option>
                  <option value="Aligarh">Aligarh</option>
                  <option value="Dehradun">Dehradun</option>
                  <option value="Bareilly">Bareilly</option>
                  <option value="Moradabad">Moradabad</option>
                  <option value="Gorakhpur">Gorakhpur</option>
                  <option value="Bhubaneswar">Bhubaneswar</option>
                  <option value="Tiruchirappalli">Tiruchirappalli</option>
                  <option value="Jalandhar">Jalandhar</option>
                  <option value="Warangal">Warangal</option>
                  <option value="Bhilai">Bhilai</option>
                  <option value="Cuttack">Cuttack</option>
                  <option value="Firozabad">Firozabad</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                  <option value="Durgapur">Durgapur</option>
                  <option value="Asansol">Asansol</option>
                  <option value="Rourkela">Rourkela</option>
                  <option value="Nanded">Nanded</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Ajmer">Ajmer</option>
                  <option value="Akola">Akola</option>
                  <option value="Gulbarga">Gulbarga</option>
                  <option value="Jamnagar">Jamnagar</option>
                  <option value="Ujjain">Ujjain</option>
                  <option value="Loni">Loni</option>
                  <option value="Siliguri">Siliguri</option>
                  <option value="Jhansi">Jhansi</option>
                  <option value="Ulhasnagar">Ulhasnagar</option>
                  <option value="Jammu">Jammu</option>
                  <option value="Sangli-Miraj & Kupwad">Sangli-Miraj & Kupwad</option>
                  <option value="Mangalore">Mangalore</option>
                  <option value="Erode">Erode</option>
                  <option value="Belgaum">Belgaum</option>
                  <option value="Kurnool">Kurnool</option>
                  <option value="Ambattur">Ambattur</option>
                  <option value="Rajahmundry">Rajahmundry</option>
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Malegaon">Malegaon</option>
                  <option value="Gaya">Gaya</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Maheshtala">Maheshtala</option>
                  <option value="Dhanbad">Dhanbad</option>
                  <option value="Saharanpur">Saharanpur</option>
                  <option value="Gorakhpur">Gorakhpur</option>
                  <option value="Bikaner">Bikaner</option>
                  <option value="Amravati">Amravati</option>
                  <option value="Jamshedpur">Jamshedpur</option>
                  <option value="Bhilai">Bhilai</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Hisar">Hisar</option>
                  <option value="Bilaspur">Bilaspur</option>
                  <option value="Rohtak">Rohtak</option>
                  <option value="Panipat">Panipat</option>
                  <option value="Darbhanga">Darbhanga</option>
                  <option value="Kakinada">Kakinada</option>
                  <option value="Bathinda">Bathinda</option>
                  <option value="Mathura">Mathura</option>
                  <option value="Karnal">Karnal</option>
                  <option value="Rampur">Rampur</option>
                  <option value="Shivamogga">Shivamogga</option>
                  <option value="Junagadh">Junagadh</option>
                  <option value="Raichur">Raichur</option>
                  <option value="Sambalpur">Sambalpur</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Naihati">Naihati</option>
                  <option value="Haldia">Haldia</option>
                  <option value="Hapur">Hapur</option>
                  <option value="Silchar">Silchar</option>
                  <option value="Uluberia">Uluberia</option>
                  <option value="Kharagpur">Kharagpur</option>
                  <option value="Darjeeling">Darjeeling</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'security' && (
        <section className="form-section">
          <div className="form-card">
            <h3>Security Settings</h3>

            <div className="security-section">
              <div className="security-item">
                <div className="security-info">
                  <h4>Change Password</h4>
                  <p>Update your password to keep your account secure</p>
                </div>
                <button
                  className="change-password-btn"
                  onClick={() => setShowPasswordForm(true)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {showPasswordForm && (
        <div className="modal-overlay">
          <div className="password-modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button
                className="close-btn"
                onClick={() => setShowPasswordForm(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <div className="password-input">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="password-input">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="update-btn"
                  onClick={handleUpdatePassword}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="success-message">
          <FaCheck />
          Your profile has been updated successfully!
        </div>
      )}
    </div>
  );
};

export default MyProfile;
