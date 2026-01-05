import React, { useState } from 'react';
import { FaUserCog, FaMoon, FaSun, FaPalette, FaLock, FaDownload, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/AccountSettings.css';
import {updateOwner} from '../services/OwnerService';

const TABS = [
  { label: 'UI Theme Preferences', value: 'theme' },
  { label: 'Password & Security', value: 'security' },
  { label: 'Privacy & Data Settings', value: 'privacy' },
];

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('theme');
  // Theme Preferences
  const [theme, setTheme] = useState('light');
  const [themePreview, setThemePreview] = useState('light');
  const [themeToast, setThemeToast] = useState('');
  // Privacy & Data
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowEmail, setAllowEmail] = useState(true);
  const [privacyToast, setPrivacyToast] = useState('');
  // Profile Info
  const [profile, setProfile] = useState({
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    fullName: 'Shreya Newaskar',
    email: 'shreya@email.com',
    phone: '+91 98765 43210',
    userType: 'Owner',
    city: 'Bangalore',
    locality: 'Koramangala',
    dob: '1998-05-15',
    gender: 'Female',
    language: 'English',
  });
  const [profileEdit, setProfileEdit] = useState(profile);
  const [profileChanged, setProfileChanged] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  // Password & Security
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Notification Preferences
  const [prefs, setPrefs] = useState({
    email: true,
    sms: false,
    push: true,
    booking: true,
    message: true,
    review: true,
    urgent: true,
    chat: true,
    payment: true,
  });
  // Toast
  const [toast, setToast] = useState('');
  // Delete Account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handlers
  const handleProfileChange = (field, value) => {
    setProfileEdit(prev => ({ ...prev, [field]: value }));
    setProfileChanged(true);
  };
  const handleProfileSave = () => {
    setProfile(profileEdit);
    setProfileChanged(false);
    setToast('✅ Changes saved successfully');
    setTimeout(() => setToast(''), 1800);
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileEdit(prev => ({ ...prev, avatar: ev.target.result }));
        setProfileChanged(true);
      };
      reader.readAsDataURL(file);
    }
    setShowAvatarModal(false);
  };
  // Password
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
     const res =  updateOwner({password :passwordData.newPassword});
      
    // Here you would typically send to backend
    setShowPasswordForm(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };
  // Notification
  const handlePrefToggle = (field) => {
    setPrefs(prev => ({ ...prev, [field]: !prev[field] }));
    setToast('✅ Preferences updated');
    setTimeout(() => setToast(''), 1200);
  };
  // DeleteF
  const handleDelete = () => {
    setShowDeleteConfirm(false);
    setToast('❌ Account deleted (mock)');
    setTimeout(() => setToast(''), 1800);
  };

  // Theme
  const handleThemePreview = (val) => setThemePreview(val);
  const handleThemeApply = () => {
    setTheme(themePreview);
    setThemeToast('✅ Theme applied!');
    setTimeout(() => setThemeToast(''), 1500);
  };

  // Privacy
  const handlePrivacySave = () => {
    setPrivacyToast('✅ Privacy settings saved!');
    setTimeout(() => setPrivacyToast(''), 1500);
  };
  const handleExportData = () => {
    setPrivacyToast('📥 Data export requested! (mock)');
    setTimeout(() => setPrivacyToast(''), 1500);
  };

  // Tab content
  return (
    <>
      <div className={`account-settings-page theme-${theme}`}>
        {toast && <div className="settings-toast">{toast}</div>}
        {themeToast && <div className="settings-toast">{themeToast}</div>}
        {privacyToast && <div className="settings-toast">{privacyToast}</div>}
        <div className="settings-header-section">
          <div className="settings-header-content">
            <div className="settings-header-icon"><FaUserCog /></div>
            <h1>Account Settings</h1>
            <p>Personalize your experience, manage security, notifications, and privacy.</p>
          </div>
        </div>
        <div className="settings-main">
          <nav className="settings-tabs">
            {TABS.map(tab => (
              <button
                key={tab.value}
                className={`settings-tab-btn${activeTab === tab.value ? ' active' : ''}${tab.isDanger ? ' danger' : ''}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="settings-content">
            {/* UI Theme Preferences */}
            {activeTab === 'theme' && (
              <section className="settings-section theme-section">
                <h2>UI Theme Preferences</h2>
                <div className="theme-radio-cards">
                  <label className={`theme-card${themePreview === 'dark' ? ' selected' : ''}`} onClick={() => handleThemePreview('dark')}>
                    <input type="radio" name="theme" value="dark" checked={themePreview === 'dark'} readOnly />
                    <FaMoon className="theme-icon" />
                    <span>Dark Mode</span>
                    <div className="theme-preview dark"></div>
                  </label>
                  <label className={`theme-card${themePreview === 'light' ? ' selected' : ''}`} onClick={() => handleThemePreview('light')}>
                    <input type="radio" name="theme" value="light" checked={themePreview === 'light'} readOnly />
                    <FaSun className="theme-icon" />
                    <span>Light Mode</span>
                    <div className="theme-preview light"></div>
                  </label>
                  <label className={`theme-card${themePreview === 'pastel' ? ' selected' : ''}`} onClick={() => handleThemePreview('pastel')}>
                    <input type="radio" name="theme" value="pastel" checked={themePreview === 'pastel'} readOnly />
                    <FaPalette className="theme-icon" />
                    <span>Pastel Mode</span>
                    <div className="theme-preview pastel"></div>
                  </label>
                </div>
                <button className="settings-save-btn" onClick={handleThemeApply}>Apply Theme</button>
              </section>
            )}
            {/* Password & Security */}
            {activeTab === 'security' && (
              <section className="settings-section security-section">
                <h2>Password & Security</h2>
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
                    Password updated successfully!
                  </div>
                )}
              </section>
            )}
            {/* Notification Preferences */}
            {activeTab === 'notifications' && (
              <section className="settings-section notifications-section">
                <h2>Notification Preferences</h2>
                <div className="notif-pref-block single">
                  <div className="notif-toggle-row">
                    <span className="notif-label">Booking alerts</span>
                    <label className="toggle-switch" title="Get notified for new bookings">
                      <input type="checkbox" checked={prefs.booking} onChange={() => handlePrefToggle('booking')} />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notif-toggle-row">
                    <span className="notif-label">Payment confirmations</span>
                    <label className="toggle-switch" title="Receive payment status updates">
                      <input type="checkbox" checked={prefs.payment} onChange={() => handlePrefToggle('payment')} />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notif-toggle-row">
                    <span className="notif-label">Chat messages</span>
                    <label className="toggle-switch" title="Get notified for new chat messages">
                      <input type="checkbox" checked={prefs.chat} onChange={() => handlePrefToggle('chat')} />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="notif-toggle-row">
                    <span className="notif-label">Promotional emails</span>
                    <label className="toggle-switch" title="Receive special offers and updates">
                      <input type="checkbox" checked={prefs.promos || false} onChange={() => handlePrefToggle('promos')} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <button className="settings-save-btn" onClick={() => setToast('✅ Preferences saved!')}>Save Preferences</button>
              </section>
            )}
            {/* Privacy & Data Settings */}
            {activeTab === 'privacy' && (
              <section className="settings-section privacy-section">
                <h2>Privacy & Data Settings</h2>
                <div className="privacy-options">
                  <div className="privacy-toggle-row">
                    <label className="toggle-switch">
                      <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(v => !v)} />
                      <span className="slider"></span>
                    </label>
                    <span className="privacy-label">Make profile private</span>
                  </div>
                  <div className="privacy-toggle-row">
                    <label className="toggle-switch">
                      <input type="checkbox" checked={allowEmail} onChange={() => setAllowEmail(v => !v)} />
                      <span className="slider"></span>
                    </label>
                    <span className="privacy-label">Allow tenants to view email</span>
                  </div>
                  <button className="settings-save-btn" onClick={handlePrivacySave}>Save Privacy Settings</button>
                </div>
                {/* <div className="data-export">
                  <button className="export-btn" onClick={handleExportData}><FaDownload /> Export My Data</button>
                </div> */}
              </section>
            )}
            {/* Delete Account */}
            {/* {activeTab === 'delete' && (
              <section className="settings-section delete-section">
                <h2 className="delete-title">Delete My Account</h2>
                <div className="delete-warning">
                  <FaLock />
                  <span>This action is irreversible. You’ll lose all your data, bookings, and reviews.</span>
                </div>
                <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>Delete My Account</button>
                {showDeleteConfirm && (
                  <div className="delete-confirm-modal">
                    <div className="delete-confirm-card">
                      <p>Are you sure you want to delete your account? This cannot be undone.</p>
                      <div className="delete-confirm-actions">
                        <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                        <button className="delete-btn" onClick={handleDelete}>Yes, Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )} */}
          </div>
        </div>
        {/* Avatar Modal */}
        {showAvatarModal && (
          <div className="avatar-modal-overlay">
            <div className="avatar-modal-card">
              <h3>Change Profile Photo</h3>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
              <button className="close-btn" onClick={() => setShowAvatarModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AccountSettings; 