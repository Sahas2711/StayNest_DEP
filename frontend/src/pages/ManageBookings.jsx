import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStar } from 'react-icons/fa';
import '../styles/ManageBookings.css';
import bookingService from '../services/BookingService';
import userIcon from '../assets/images/user_icon.jpg';

const ManageBookings = () => {
  const id = localStorage.getItem('id');
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await bookingService.getBookingsByOWner();

        const mapped = res.map(req => {
          let uiStatus = 'unknown';
          switch (req.status) {
            case 'PENDING': uiStatus = 'pending'; break;
            case 'ACCEPTED':
            case 'CONFIRMED': uiStatus = 'confirmed'; break;
            case 'NOT BOOKED': uiStatus = 'cancelled'; break;
            case 'REJECTED': uiStatus = 'cancelled'; break;
          }

          return {
            id: req.id,
            tenantName: req.tenant?.name,
            tenantEmail: req.tenant?.email,
            tenantPhone: req.tenant?.phoneNumber,
            tenantRating: '4.5',
            tenantImage: userIcon, // Placeholder for tenant image
            pgName: req.listing?.title,
            location: req.listing?.address,
            sharing: req.listing?.roomType,
            checkInDate: formatDate(req.startDate),
            checkOutDate: formatDate(req.endDate),
            requestDate: new Date(req.id).toLocaleString(),
            price: req.listing?.rent,
            sharing: req.roomType,
            status: uiStatus
          };
        });

        // Sort the requests array by requestDate in ascending order
        const sortedRequests = mapped.sort((a, b) => {
          return new Date(a.id) - new Date(b.id);
        });

        setRequests(sortedRequests);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirmBooking = (requestId) => {
    try {
      bookingService.bookingAction(requestId, 'ACCEPT');
      alert("Booking confirmed successfully");
    } catch (error) {
      console.error("Failed to confirm booking:", error);
    }
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: 'confirmed' }
          : request
      )
    );
  };

  const handleCancelBooking = (requestId) => {
    try {
      bookingService.bookingAction(requestId, 'REJECT');
      alert("Booking cancelled successfully");
    } catch (error) {
      console.error("Failed to confirm booking:", error);
    }
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: 'cancelled' }
          : request
      )
    );
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'confirmed': return '#4CAF50';
      case 'cancelled': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="manage-bookings-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading booking requests...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="manage-bookings-container">
        <div className="header-section">
          <h1>Manage Booking Requests</h1>
          <p>Review and manage booking requests for your properties</p>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h3>{requests.length}</h3>
            <p>Total Requests</p>
          </div>
          <div className="stat-card">
            <h3>{requests.filter(r => r.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{requests.filter(r => r.status === 'confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
          <div className="stat-card">
            <h3>{requests.filter(r => r.status === 'cancelled').length}</h3>
            <p>Cancelled</p>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({requests.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button
              className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed ({requests.filter(r => r.status === 'confirmed').length})
            </button>
            <button
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilter('cancelled')}
            >
              Cancelled ({requests.filter(r => r.status === 'cancelled').length})
            </button>
          </div>
        </div>

        <div className="requests-grid">
          {filteredRequests.map((request) => (
            <div key={request.id} className={`request-card ${request.status}`}>
              <div className="request-header">
                <div className="tenant-info">
                  <img
                    src={userIcon}
                    alt={request.tenantName}
                    className="tenant-avatar"
                  />
                  <div className="tenant-details">
                    <h3>{request.tenantName}</h3>
                    <div className="tenant-rating">
                      <FaStar className="star-icon" />
                      <span>{request.tenantRating}</span>
                    </div>
                  </div>
                </div>
                <div className="status-badge" style={{ backgroundColor: getStatusColor(request.status) }}>
                  {getStatusText(request.status)}
                </div>
              </div>

              <div className="property-info">
                <h4>{request.pgName}</h4>
                <p><FaMapMarkerAlt /> {request.location}</p>
                <p><FaCalendarAlt /> {request.checkInDate} - {request.checkOutDate}</p>
                <p className="sharing-info">{request.sharing}</p>
                <p className="price-info">₹{request.price.toLocaleString()}/month</p>
              </div>

              <div className="contact-info">
                <p><FaEnvelope /> {request.tenantEmail}</p>
                <p><FaPhone /> {request.tenantPhone}</p>
                <p><FaClock /> Requested on {request.requestDate}</p>
              </div>

              {request.status === 'pending' && (
                <div className="action-buttons">
                  <button
                    className="confirm-btn"
                    onClick={() => handleConfirmBooking(request.id)}
                  >
                    <FaCheck /> Confirm Booking
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelBooking(request.id)}
                  >
                    <FaTimes /> Cancel Request
                  </button>
                </div>
              )}

              {request.status === 'confirmed' && (
                <div className="confirmed-info">
                  <FaCheck className="confirmed-icon" />
                  <span>Booking confirmed</span>
                </div>
              )}

              {request.status === 'cancelled' && (
                <div className="cancelled-info">
                  <FaTimes className="cancelled-icon" />
                  <span>Request cancelled</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="no-requests">
            <div className="no-requests-icon">📋</div>
            <h3>No requests found</h3>
            <p>There are no {filter === 'all' ? '' : filter} requests at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageBookings;