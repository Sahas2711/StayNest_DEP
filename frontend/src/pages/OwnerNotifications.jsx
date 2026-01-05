// src/pages/OwnerNotifications.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { FaBell, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/OwnerNotifications.css';
import bookingService from '../services/BookingService';

const OwnerNotifications = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPendingBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingService.getBookingsByOWner();
//      console.log('Raw bookings data:', response);

      const pendingBookings = response.filter(booking => booking.status === 'PENDING');

      // ✅ FIX: Sort pending bookings by booking.id (which represents creation time)
      // We assume booking.id is a timestamp string or a number that new Date() can parse
      pendingBookings.sort((a, b) => new Date(b.id) - new Date(a.id));

      const mappedBookings = pendingBookings.map(booking => ({
        id: booking.id, // Keep the original ID
        isNew: true,
        tenant: booking.tenant?.name || 'Unknown Tenant',
        pgName: booking.listing?.title || 'Unknown PG',
        checkIn: new Date(booking.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
        checkOut: new Date(booking.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
        location: booking.listing?.address || 'N/A',
        // ✅ FIX: Use booking.id to generate the display timestamp
        displayTimestamp: new Date(booking.id).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
      }));

      setBookings(mappedBookings);
    } catch (err) {
      console.error('Error fetching pending bookings:', err.response?.data || err.message);
      setError('Failed to load pending booking requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingBookings();
  }, [fetchPendingBookings]);

  // const handleViewDetails = (bookingId) => {
  //   navigate(`/listing-bookings/${bookingId}`);
  // };

  return (
    <div className="owner-notifications-page">
      <div className="notif-header-section">
        <div className="notif-header">
          <div className="notif-title-row">
            <h1 className="notif-title">Pending Booking Requests</h1>
            <div className="notif-bell-wrapper">
              <FaBell className="notif-bell" />
              {bookings.length > 0 && <span className="notif-dot" />}
            </div>
          </div>
        </div>
      </div>

      <div className="notif-list">
        {loading && (
          <div className="notif-loading">
            <FaSpinner className="spinner-icon" /> Loading pending requests...
          </div>
        )}
        {error && (
          <div className="notif-error">
            {error} <button onClick={fetchPendingBookings}>Retry</button>
          </div>
        )}
        {!loading && !error && bookings.length === 0 && (
          <div className="notif-empty">No pending booking requests at the moment.</div>
        )}
        {!loading && !error && bookings.map((booking) => (
          <div
            key={booking.id}
            className="notif-card notif-slide-in notif-new"
          >
            <div className="notif-icon-block">🏠</div>
            <div className="notif-content">
              <div className="notif-main-row">
                <span className="notif-main-title">New Booking Request</span>
                <span className="notif-badge">New</span>
              </div>
              <div className="notif-subtext">
                <strong>{booking.tenant}</strong> has requested to book your PG: <strong>{booking.pgName}</strong>.
              </div>
              <div className="notif-details">
                <span><FaCalendarAlt /> Check-in: {booking.checkIn}</span>
                <span><FaCalendarAlt /> Check-out: {booking.checkOut}</span>
                <span><FaUser /> Tenant: {booking.tenant}</span>
                <span><FaMapMarkerAlt /> {booking.location}</span>
              </div>
              <div className="notif-actions-row">
               
                <span className="notif-timestamp">
                  <FaClock /> {booking.displayTimestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerNotifications;