import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaStar } from 'react-icons/fa';
import '../styles/ManageBookings.css';
import bookingService from '../services/BookingService';
import userIcon from '../assets/images/user_icon.jpg'; 

const ListingBookings = () => {
  console.log('Params:', useParams());

  //const { pgId } = useParams();
 // console.log('PG ID:', pgId);
//option1
const { pgId } = useParams();

//console.log("Params:", { pgId });
//console.log("PG ID:", pgId);

  //option2
  const params = useParams();
//console.log("Params:", params);
//console.log("PG ID:", params.pgId);

 const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const statusAliasMap = {
  Pending: 'PENDING',
  Booked: 'ACCEPT',
  Confirmed: 'ACCEPT',
  Cancelled: 'REJECT',
  CancelledByTenant: 'REJECT',
  CancelledByOwner: 'REJECT',
  Rejected: 'REJECT'
};

// Map backend values to UI-friendly names ✅ THIS ONE IS USED IN YOUR JSX
const backendToUiStatusMap = {
  PENDING: 'Pending',
  ACCEPTED: 'Booked',
  CONFIRMED: 'Booked',
  'NOT BOOKED': 'Cancelled'
};
  useEffect(() => {
    if(!pgId){
      return;
    }
  const fetchRequests = async () => {
    try {
      //console.log("Fetching booking requests for PG ID:", pgId);
      const res =await bookingService.getBookingsByListingId(pgId);
      //console.log("Fetched booking requests:", res);
      const mapped = res.map(req => {
  // Normalize status properly
  let uiStatus = 'unknown';
  switch (req.status) {
    case 'PENDING':
      uiStatus = 'pending';
      break;
    case 'ACCEPTED':
    case 'CONFIRMED':
      uiStatus = 'confirmed';
      break;
    case 'NOT BOOKED':
      uiStatus = 'cancelled';
      break;
    case  'REJECTED' :
      uiStatus = 'cancelled';
      break;
      default:
      uiStatus = 'unknown';
  }

  return {
    ...req,
    status: uiStatus,
    tenantName: req.tenant?.name,
    tenantEmail: req.tenant?.email,
    tenantPhone: req.tenant?.phoneNumber,
    tenantRating: '4.5',
    tenantImage: 'userIcon',
    pgName: req.listing?.title,
    location: req.listing?.address,
    sharing: req.roomType,
    checkInDate: formatDate(req.startDate),
    checkOutDate: formatDate(req.endDate),
    requestDate: new Date(req.id).toLocaleString(),
    rent: req.listing?.rent
  };
});


setRequests(mapped);
      
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchRequests();
}, [pgId]);

  const handleConfirmBooking = (requestId) => {
    try{
      const res = bookingService.bookingAction(requestId, 'ACCEPT');
      alert("Booking confirmed successfully");
      //console.log("Booking confirmed:", res);
    }catch (error) {
      console.error("Failed to confirm booking:", error);}
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: 'confirmed' }
          : request
      )
    );

  };

  const handleCancelBooking = (requestId) => {
    try{
      const res = bookingService.bookingAction(requestId, 'REJECT');
      alert("Booking cancelled successfully");
      //console.log("Booking confirmed:", res);
      alert("Booking cancelled successfully");
      console.log("Booking confirmed:", res);
    }catch (error) {
      console.error("Failed to confirm booking:", error);}
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === requestId
          ? { ...request, status: 'cancelled' }
          : request
      )
    );
  };

  // Show all requests regardless of PG for easier testing
const filteredRequests = requests.filter(request => {
  if (filter === 'all') return true;
  return request.status === filter;
});


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
          <h1>All Booking Requests </h1>
          <p>Showing all tenant requests for easier testing. In production, this will filter by PG.</p>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h3>{filteredRequests.length}</h3>
            <p>Total Requests</p>
      </div>
          <div className="stat-card">
            <h3>{filteredRequests.filter(r => r.status === 'pending').length}</h3>
            <p>Pending</p>
        </div>
          <div className="stat-card">
            <h3>{filteredRequests.filter(r => r.status === 'confirmed').length}</h3>
            <p>Confirmed</p>
        </div>
          <div className="stat-card">
            <h3>{filteredRequests.filter(r => r.status === 'cancelled').length}</h3>
            <p>Cancelled</p>
        </div>
      </div>

        <div className="filter-section">
          <div className="filter-buttons">
          <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
              All ({filteredRequests.length})
          </button>
          <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
              Pending ({filteredRequests.filter(r => r.status === 'pending').length})
          </button>
          <button 
              className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
              Confirmed ({filteredRequests.filter(r => r.status === 'confirmed').length})
          </button>
          <button 
              className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
              Cancelled ({filteredRequests.filter(r => r.status === 'cancelled').length})
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
               <p><FaCalendarAlt /> {formatDate(request.startDate)} - {formatDate(request.endDate)}</p>
<p className="price-info">
  ₹{request.rent.toLocaleString() ?? 'N/A'}/month
</p>

              </div>

              <div className="contact-info">
                <p><FaEnvelope /> {request.tenantEmail}</p>
                <p><FaPhone /> {request.tenantPhone}</p>
                <p><FaClock /> Requested on {request.requestDate}</p>
            </div>

              {/* Removed message-section here */}

            {request.status === ('pending' || 'PENDING')&& (
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
}

function getStatusColor(status) {
  switch (status) {
    case 'pending': return '#FFA500';
    case 'confirmed': return '#4CAF50';
    case 'cancelled': return '#F44336';
    default: return '#666';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'pending': return 'Pending';
    case 'confirmed': return 'Confirmed';
    case 'cancelled': return 'Cancelled';
    default: return 'Unknown';
  }
}

export default ListingBookings; 