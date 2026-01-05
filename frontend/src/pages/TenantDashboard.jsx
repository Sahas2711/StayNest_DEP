import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TenantDashboard.css";
import { FaRegCalendarAlt, FaMapMarkerAlt, FaSearch, FaUser, FaRegCommentDots, FaCog, FaArrowRight, FaHome, FaStar, FaChevronDown } from "react-icons/fa";
import bookingService from "../services/BookingService";
import userService from "../services/UserService";
import {getReviewsByTenant} from "../services/ReviewService";
const genderOptions = [
  { label: 'Girls', value: 'girls' },
  { label: 'Boys', value: 'boys' },
  { label: 'Unisex', value: 'unisex' },
];

const budgetOptions = [
  { label: 'Below ₹5,000', value: [1000, 5000] },
  { label: '₹5,000 - ₹10,000', value: [5000, 10000] },
  { label: '₹10,000 - ₹20,000', value: [10000, 20000] },
  { label: 'Above ₹20,000', value: [20000, 50000] },
];

const extraReviewQuestions = [
      { label: 'Was the PG clean and hygienic?', name: 'cleanliness', displayTitle: 'Cleanliness' },
      { label: 'Was the food quality good?', name: 'food', displayTitle: 'Food Quality' },
      { label: 'Was the PG quiet and peaceful?', name: 'noise', displayTitle: 'Noise Level' },
      { label: 'Was the PG in a safe and accessible area?', name: 'location', displayTitle: 'Location Safety' },
      { label: 'Was it close to public transport or college?', name: 'transport', displayTitle: 'Proximity' },
      { label: 'Was the owner/manager friendly and helpful?', name: 'owner', displayTitle: 'Owner/Manager' },
      { label: 'Was Wi-Fi speed and stability good?', name: 'internet', displayTitle: 'Internet/Wi-Fi' },
      { label: 'Did you face water issues?', name: 'water', displayTitle: 'Water Availability' },
      { label: 'Were there proper security measures?', name: 'security', displayTitle: 'Security' },
      { label: 'Was the PG worth the price?', name: 'value', displayTitle: 'Value for Money' }
    ];

    // UPDATED: Use your enum values directly for answer options
    const answerOptions = ['Excellent', 'Good', 'Fair', 'Poor'];

   const extraQuestionMap = {
        'Was the PG clean and hygienic?': 'cleanliness',
        'Was the food quality good?': 'food',
        'Was the PG quiet and peaceful?': 'noise',
        'Was the PG in a safe and accessible area?': 'location',
        'Was it close to public transport or college?': 'transport',
        'Was the owner/manager friendly and helpful?': 'owner',
        'Was Wi-Fi speed and stability good?': 'internet',
        'Did you face water issues?': 'water',
        'Were there proper security measures?': 'security',
        'Was the PG worth the price?': 'value'
    };

    // This map is primarily for parsing, ensuring consistency if backend sends full question
    const extraQuestionReverseMap = Object.fromEntries(
        Object.entries(extraQuestionMap).map(([key, value]) => [value, key])
    );
    const getRatingText = (rating) => {
  switch (rating) {
    case 1:
      return 'Terrible';
    case 2:
      return 'Poor';
    case 3:
      return 'Average';
    case 4:
      return 'Good';
    case 5:
      return 'Excellent';
    default:
      return '';
  }
};



const TenantDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState('');
  const [reviews, setReviews] = useState([]);

  //Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 6;


  const [extraReviewFields, setExtraReviewFields] = useState({
      cleanliness: '',
      food: '',
      noise: '',
      location: '',
      transport: '',
      owner: '',
      internet: '',
      water: '',
      security: '',
      value: ''
    });

  useEffect(() => {
   const fetchData = async () => {
  try {
    const user = await userService.getCurrentUser();
    setUserName(user.name || 'User');
    localStorage.setItem('userFirstLetter', user.name[0]);

    const bookingData = await bookingService.getMyBookings();
    const mappedBookings = bookingData.map((b) => ({
      id: b.id,
      name: b.listing?.title || "N/A",
      location: b.listing?.address || "N/A",
      checkIn: b.startDate ? new Date(b.startDate).toLocaleDateString() : "N/A",
      checkOut: b.endDate ? new Date(b.endDate).toLocaleDateString() : "N/A",
      status: b.status || "N/A",
    }));
    setBookings(mappedBookings.reverse());

    const userReviews = await getReviewsByTenant(localStorage.getItem('id'));

const published = userReviews.map(r => {
  const { id, rating, feedback, createdAt, listing = {} } = r;
  const { title: pgName, address: location } = listing;

  let mainReview = '';
  const parsedExtraFields = {};

  if (feedback) {
    // A regular expression to find the main review text and key-value pairs
    const parts = feedback.split(/ (cleanliness|food|noise|location|transport|owner|internet|water|security|value):/i);

    // The first element is the main review, if it exists
    if (parts.length > 0) {
      mainReview = parts[0].replace('Review: ', '').trim();
    }

    // Iterate through the rest of the array to find key-value pairs
    for (let i = 1; i < parts.length; i += 2) {
      const key = parts[i].trim();
      const value = parts[i + 1] ? parts[i + 1].trim().split(/\s+(?=cleanliness|food|noise|location|transport|owner|internet|water|security|value:|$)/)[0] : '';
      
      const question = extraReviewQuestions.find(q => q.name === key);
      if (question && value) {
        parsedExtraFields[question.displayTitle] = value;
      }
    }
  }

  return {
    id,
    rating,
    reviewText: mainReview,
    extraReviewFields: parsedExtraFields,
    date: createdAt,
    pgName,
    location,
    // ... other fields
  };
});
console.log("Published reviews:", published);
setReviews(published);
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err);
  }
};

    fetchData();
  }, []);

  // Calculate active bookings count
  const activeBookingsCount = bookings.filter(booking => booking.status === 'PENDING').length;

  // Calculate average rating and total reviews
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviewsCount).toFixed(1)
    : '0.0'; // Default to '0.0' if no reviews

  // Function to add new booking (kept for existing functionality)
  const addNewBooking = (newBooking) => {
    setBookings(prevBookings => [newBooking, ...prevBookings]);
  };

  // Listen for new bookings from localStorage or other sources (kept for existing functionality)
  useEffect(() => {
    const checkForNewBookings = () => {
      const newBookings = JSON.parse(localStorage.getItem('newBookings') || '[]');
      if (newBookings.length > 0) {
        newBookings.forEach(booking => {
          addNewBooking({
            id: Date.now() + Math.random(), // Generate unique ID
            name: booking.pgName,
            location: booking.location,
            checkIn: booking.checkInDate,
            checkOut: booking.checkOutDate,
            status: "Booked",
          });
        });
        localStorage.removeItem('newBookings');
      }
    };
    checkForNewBookings();
  }, []);


  const handleViewDetails = (bookingId) => {
    navigate(`/booking-details/${bookingId}`);
  };

  const handleUpdateProfile = () => {
    navigate('/my-profile');
  };

  const handleAccountSettings = () => {
    navigate('/account-settings');
  };

  // const handleContactSupport = () => {
  //    navigate('/contact-support');
  // };

  const handleBrowsePGs = () => {
    navigate('/listings');
  };

  // Pagination Logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-container">
      <section className="hero-section">
        <div className="hero-card-gradient">
          <div className="hero-card-header">
            <div>
              <h1 className="hero-welcome hero-welcome-dark">Hi {userName}, welcome back to StayNest!</h1>
              <p className="hero-subtitle hero-subtitle-orange">Here's a quick look at your upcoming stays and reviews.</p>
            </div>
            <div className="hero-icon-box">
              <FaHome />
            </div>
          </div>
          <div className="stats-pills">
            <div className="stat-pill">
              <span className="stat-number">{activeBookingsCount}</span>
              <span className="stat-label">Active Bookings</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number">{averageRating}</span>
              <span className="stat-label"><span className="star">★</span> Avg Rating</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number">{totalReviewsCount}</span>
              <span className="stat-label">Total Reviews</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ marginTop: '3.5rem' }}>
        <h2>My Bookings</h2>
        <div className="card-grid">
          {currentBookings.map((booking) => (
            <div className="card" key={booking.id}>
              <div className={`status-label status-${booking.status.toLowerCase()}`}>
                {booking.status}
              </div>
              <h3>{booking.name}</h3>
              <p><FaMapMarkerAlt /> {booking.location}</p>
              <p><FaRegCalendarAlt /> Check-in: {booking.checkIn}</p>
              <p><FaRegCalendarAlt /> Check-out: {booking.checkOut}</p>
              <button
                className="view-all-btn"
                onClick={() => handleViewDetails(booking.id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="section quick-actions-section">
        <h2 className="quick-actions-title">Quick Actions</h2>
        <p className="quick-actions-subtitle">Everything you need is just a click away</p>
        <div className="quick-actions-grid">
          <div className="quick-action-card green" onClick={handleBrowsePGs} style={{cursor:'pointer'}}>
            <div className="icon-bg"><FaSearch /></div>
            <div className="action-content">
              <div className="action-title-row">
                <h3>Browse New PGs</h3>
                <FaArrowRight className="action-arrow" />
              </div>
              <p className="action-desc">Discover more amazing places</p>
              <div className="accent-bar green"></div>
            </div>
          </div>
          <div className="quick-action-card yellow" onClick={handleUpdateProfile}>
            <div className="icon-bg"><FaUser /></div>
            <div className="action-content">
              <div className="action-title-row">
                <h3>Update My Profile</h3>
                <FaArrowRight className="action-arrow" />
              </div>
              <p className="action-desc">Keep your info current</p>
              <div className="accent-bar yellow"></div>
            </div>
          </div>
          <div className="quick-action-card green" onClick={() => navigate('/contactsupport')}>
            <div className="icon-bg"><FaRegCommentDots /></div>
            <div className="action-content">
              <div className="action-title-row">
                <h3>Contact Support</h3>
                <FaArrowRight className="action-arrow" />
              </div>
              <p className="action-desc">We're here to help 24/7</p>
              <div className="accent-bar green"></div>
            </div>
          </div>
          <div className="quick-action-card gray" onClick={handleAccountSettings} style={{cursor:'pointer'}}>
            <div className="icon-bg"><FaCog /></div>
            <div className="action-content">
              <div className="action-title-row">
                <h3>Account Settings</h3>
                <FaArrowRight className="action-arrow" />
              </div>
              <p className="action-desc">Privacy & preferences</p>
              <div className="accent-bar gray"></div>
            </div>
          </div>
          <div className="quick-action-card purple" onClick={() => navigate('/my-reviews')}>
            <div className="icon-bg"><FaStar /></div>
            <div className="action-content">
              <div className="action-title-row">
                <h3>View Reviews</h3>
                <FaArrowRight className="action-arrow" />
              </div>
              <p className="action-desc">See all your reviews and ratings</p>
              <div className="accent-bar purple"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
  <h2>My Reviews & Ratings</h2>
  <div className="card-grid">
    {reviews.length === 0 && (
      <strong>
        <p className="action-desc">No reviews found. Start exploring and leave your feedback!</p>
      </strong>
    )}
    {reviews.map((review, index) => (
      <div className="card new-review-card" key={index}>
        <div className="card-body">
          <h3>{review.pgName}</h3>
          <p className="pg-location">
            <FaMapMarkerAlt />
            {review.location}
          </p>
          <p className="review-date-info">
            <FaRegCalendarAlt />
            Reviewed on {new Date(review.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
          <div className="rating-display">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} className={`star ${star <= review.rating ? 'filled' : ''}`} />
            ))}
            <span className="rating-text">{getRatingText(review.rating)}</span>
          </div>
          {/* <div className="review-details">
            <h4>Overall Review:</h4>
            <p className="overall-review-text">{review.reviewText}</p>
            {Object.keys(review.extraReviewFields).length > 0 && (
              <div className="specific-feedback">
                <h4>Specific Feedback:</h4>
                <ul className="feedback-list">
                  {Object.entries(review.extraReviewFields).map(([key, value], idx) => (
                    <li key={idx}>
                      <span><strong>{key}:</strong></span>
                      <span className="feedback-value">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div> */}
        </div>
      </div>
    ))}
  </div>
</section>
      <div className="footer-spacing"></div>
    </div>
  );
};

export default TenantDashboard;