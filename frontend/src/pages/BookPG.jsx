import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaPhone, FaWifi, FaUtensils, FaSnowflake, FaTshirt, FaCar, FaLock, FaBroom, FaDumbbell, FaFemale, FaMale, FaUsers, FaArrowLeft, FaCheck, FaTimes, FaLaptopHouse, FaCalendarAlt, FaUser } from 'react-icons/fa';
import axios from 'axios';
import '../styles/BookPG.css';
import TenantDashboardNavbar from '../components/TenantDashboardNavbar';
import bookingService from '../services/BookingService';
import { getReviewsByListing } from '../services/ReviewService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const getRatingText = (rating) => {
  switch (rating) {
    case 1: return 'Poor';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Very Good';
    case 5: return 'Excellent';
    default: return '';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const parseFeedbackString = (feedbackString) => {
  const lines = feedbackString.split('\n').filter(line => line.trim() !== '');
  let reviewText = '';
  const extraReviewFields = {};

  lines.forEach(line => {
    if (line.toLowerCase().startsWith('review:')) {
      reviewText = line.substring('review:'.length).trim();
    } else {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts.slice(1).join(':').trim();
        extraReviewFields[key] = value;
      }
    }
  });

  return { reviewText, extraReviewFields };
};

const extraReviewQuestions = [
  { name: 'cleanliness', displayTitle: 'Cleanliness' },
  { name: 'noise', displayTitle: 'Noise Level' },
  { name: 'location', displayTitle: 'Location' },
  { name: 'owner', displayTitle: 'Owner Interaction' },
  { name: 'internet', displayTitle: 'Internet' },
  { name: 'security', displayTitle: 'Security' },
  { name: 'value', displayTitle: 'Value for Money' },
];

const BookPG = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [duration, setDuration] = useState('3');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [totalRent, setTotalRent] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [mapCoordinates, setMapCoordinates] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  // Pagination State
  const reviewsPerPage = 2;
  const [currentPage, setCurrentPage] = useState(1);

  const defaultMapCenter = [18.5204, 73.8567]; // Latitude and Longitude for India

  const nextImage = () => {
    if (pgData && pgData.images && pgData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % pgData.images.length);
    }
  };

  const prevImage = () => {
    if (pgData && pgData.images && pgData.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + pgData.images.length) % pgData.images.length);
    }
  };
  //const puneCoordinates = [18.5204, 73.8567];
  useEffect(() => {
    const fetchPGData = async () => {
      try {
        const res = await axios.get(`http://localhost:8086/listing/${id}`);
        const data = res.data;
        console.log('Fetched PG Data:', data);

        const mappedImages = data.urls && data.urls.length > 0 ? data.urls : ['https://via.placeholder.com/600x400?text=No+Image+Available'];
        const mappedAmenities = [
          { id: 'ac', name: 'AC', icon: <FaSnowflake />, available: data.acAvilable },
          { id: 'wifi', name: 'Wi-Fi', icon: <FaWifi />, available: data.wifiAvilable },
          { id: 'meals', name: 'Meals', icon: <FaUtensils />, available: data.mealsAvilable },
          { id: 'laundry', name: 'Laundry', icon: <FaTshirt />, available: data.laudryAvilable },
          { id: 'cctv', name: 'CCTV', icon: <FaLock />, available: data.cctvAvilable },
          { id: 'parking', name: 'Parking', icon: <FaCar />, available: data.parkingAvilable },
          { id: 'common', name: 'Common Areas', icon: <FaBroom />, available: data.commonAreasAvilable },
          { id: 'study', name: 'Study Desk', icon: <FaLaptopHouse />, available: data.studyDeskAvilable },
        ];

        const mappedRoomOptions = data.roomDetails.map(room => ({
          type: room.roomType,
          rent: room.price > 0 ? room.price : data.rent,
          availability: room.bedsPerRoom > 0 ? "Available" : "Currently Not Available",
          bedsPerRoom: room.bedsPerRoom,
          roomCount: room.roomCount,
          avilableBedsPerRoom: room.avilableBedsPerRoom,
        }));

        let initialSelectedRoom = null;
        const firstAvailableRoom = mappedRoomOptions.find(room => room.bedsPerRoom > 0);
        if (firstAvailableRoom) {
          initialSelectedRoom = firstAvailableRoom;
        } else if (mappedRoomOptions.length > 0) {
          initialSelectedRoom = mappedRoomOptions[0];
        } else {
          initialSelectedRoom = { type: "Default", rent: data.rent || 0, availability: "Currently Not Available", bedsPerRoom: 0, roomCount: 0 };
        }

        const reviews = await getReviewsByListing(id);
        const processedReviews = reviews.map(review => {
          const { reviewText, extraReviewFields } = parseFeedbackString(review.feedback);
          return {
            ...review,
            pgName: review.listing?.title || 'Unknown PG',
            location: review.listing?.address || 'Unknown Location',
            thumbnail: review.listing?.urls?.[0] || 'https://via.placeholder.com/50',
            date: review.createdAt,
            reviewText: reviewText,
            extraReviewFields: extraReviewFields,
            checkInDate: review.listing?.startDate || null,
            checkOutDate: review.listing?.endDate || null,
            tenant: {
              name: review.tenant?.name || 'Anonymous',
              phone: review.tenant?.phoneNumber || 'N/A',
              icon: null,
              verified: true
            }
          };
        });
        processedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort reviews by date descending
        setReviews(processedReviews);
        const totalRatingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRatingSum / reviews.length).toFixed(1) : 0;

        setPgData({
          ...data,
          amenities: mappedAmenities,
          roomOptions: mappedRoomOptions,
          images: mappedImages,
          reviews: reviews,
          owner: {
            name: data.owner?.name || 'Owner',
            phone: data.owner?.phoneNumber || 'N/A',
            icon: null,
            verified: true
          },
          name: data.title,
          location: data.address,
          rating: averageRating,
          totalReviews: reviews.length,
          availability: "Available",
          securityDeposit: data.deposite || 0,
          bookingFee: data.bookingFee || 0,
          discount: data.discount || 0
        });

        setSelectedRoom(initialSelectedRoom);
        setTotalRent(initialSelectedRoom.bedsPerRoom > 0 ? initialSelectedRoom.rent * parseInt(duration) : 0);

      } catch (err) {
        console.error('Failed to fetch PG:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPGData();
  }, [id, navigate]);
// Remove this line as it's not specific to Pune.
// const defaultMapCenter = [20.5937, 78.9629]; // Latitude and Longitude for India 

const puneCoordinates = [18.5204, 73.8567]; // Pune's coordinates

useEffect(() => {
    const geocodeAddress = async () => {
      // Ensure pgData exists before proceeding
      if (!pgData) {
        setMapLoading(false);
        return;
      }

      // Check if a location address is provided
      if (pgData.location && pgData.location.trim() !== '') {
        try {
          setMapLoading(true);
          // Use the provided address to search for coordinates
          const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pgData.location)}&limit=1`);
          
          if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            setMapCoordinates([parseFloat(lat), parseFloat(lon)]);
          } else {
            console.warn("Nominatim geocoding API did not return results for address:", pgData.location);
            // Fallback to Pune if the address is not found
            setMapCoordinates(puneCoordinates);
          }
        } catch (error) {
          console.error("Location Feature is down currently or network error:", error);
          // Fallback to Pune on API error
          setMapCoordinates(puneCoordinates);
        } finally {
          setMapLoading(false);
        }
      } else {
        // If the address is not available or is empty, default to Pune
        console.log("No address available, defaulting to Pune.");
        setMapCoordinates(puneCoordinates);
        setMapLoading(false);
      }
    };

    geocodeAddress();
  }, [pgData]);
  useEffect(() => {
    if (selectedRoom) {
      setTotalRent(selectedRoom.bedsPerRoom > 0 ? selectedRoom.rent * parseInt(duration) : 0);
    }
  }, [selectedRoom, duration]);

  useEffect(() => {
    let intervalId;
    if (pgData && pgData.images && pgData.images.length > 1) {
      intervalId = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % pgData.images.length);
      }, 3000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [pgData]);

  if (loading) return <div>Loading PG details...</div>;
  if (!pgData) return <div>No PG found.</div>;

  const discountAmount = (pgData.discount / 100) * totalRent;
  const finalTotalAmount = selectedRoom?.bedsPerRoom > 0 ? ((pgData.bookingFee || 0) + (pgData.securityDeposit || 0) + totalRent - discountAmount) : 0;

  const handleBookNow = () => {
    if (!termsAccepted) {
      alert('Please accept terms & conditions');
      return;
    }
    if (!checkInDate) {
      alert('Please select a check-in date.');
      return;
    }
    if (!selectedRoom || selectedRoom.bedsPerRoom === 0) {
      alert('Please select an available room type.');
      return;
    }
    setShowBookingModal(true);
  };

 const handleConfirmBooking = async () => {
  // Set loading state to true
  setIsBookingLoading(true);

  try {
    const bookingData = {
      id: Date.now(),
      listing: { id: id },
      startDate: checkInDate,
      endDate: new Date(new Date(checkInDate).setMonth(new Date(checkInDate).getMonth() + parseInt(duration))).toISOString().split('T')[0],
      totalRent: finalTotalAmount,
      roomType: selectedRoom?.type
    };
    const response = await bookingService.createBooking(bookingData);
    alert('Booking Request sent!');
    navigate('/tenant/dashboard');
  } catch (err) {
    console.error('Booking failed:', err);
    alert('Failed to book PG. Please try again later.');
  } finally {
    // Set loading state to false, regardless of success or failure
    setIsBookingLoading(false);
    setShowBookingModal(false);
  }
};

  // --- Pagination Logic ---
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <>
      <div className="book-pg-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />Back
        </button>

        <section className="hero-section">
          <div className="image-carousel">
            {pgData.images && pgData.images.length > 0 ? (
              <img
                src={pgData.images[currentImageIndex]}
                alt={pgData.name}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Image+Load+Error'; }}
              />
            ) : (
              <img src="https://via.placeholder.com/600x400?text=No+Image+Available" alt="No Image" />
            )}
            {pgData.images && pgData.images.length > 1 && (
              <>
                <button className="carousel-btn prev" onClick={prevImage}>‹</button>
                <button className="carousel-btn next" onClick={nextImage}>›</button>
              </>
            )}
            {pgData.images && pgData.images.length > 0 && (
              <div className="carousel-dots">
                {pgData.images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="hero-overlay">
            <div className="hero-content">
              <div className="pg-basic-info">
                <h1>{pgData.name}</h1>
                <p className="location"><FaMapMarkerAlt />{pgData.location}</p>
                <div className="rating">
                  <FaStar /><span>{pgData.rating}</span>
                  <span className="review-count">({pgData.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="quick-info-card">
              <div className="price-info">
                <span className="amount">₹{pgData.rent?.toLocaleString() || 'N/A'}</span>
                <span className="period">/month</span>
              </div>
              <div className="status-badge available"><FaCheck />{pgData.availability}</div>
              <div className="gender-badge">
                {pgData.gender?.toLowerCase() === "female" ? <FaFemale /> : pgData.gender?.toLowerCase() === "male" ? <FaMale /> : <FaUsers />}
                {pgData.gender} PG
              </div>
              {pgData.verified && <div className="verified-badge">✓ Verified</div>}
            </div>
          </div>
        </section>

        <div className="content-wrapper">
          <div className="main-content">
            <section className="pg-overview">
              <h2>About This PG</h2>
              <p>{pgData.description || "No description available."}</p>
              <div className="amenities-grid">
                <h3>Amenities</h3>
                <div className="amenities-list">
                  {pgData.amenities.map(amenity => (
                    <div key={amenity.id} className={`amenity-item ${amenity.available ? 'available' : 'unavailable'}`}>
                      <span className="amenity-icon">{amenity.icon}</span>
                      <span className="amenity-name">{amenity.name}</span>
                      {!amenity.available && <span className="unavailable-mark"><FaTimes /></span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="room-options">
                <h3>Room Options</h3>
                <div className="room-table">
                  <div className="room-header">
                    <span>Type</span>
                    <span>Rent</span>
                    <span>Rooms Available</span>
                    <span>Availability</span>
                  </div>
                  {pgData.roomOptions.length > 0 ? (
                    pgData.roomOptions.map((room, index) => (
                      <div key={index} className={`room-row ${room.bedsPerRoom === 0 ? 'not-available-row' : ''}`}>
                        <span>{room.type} ({room.bedsPerRoom} Beds)</span>
                        <span>{`₹${room.rent?.toLocaleString()}/month`}</span>
                        <span className="availability">
                          {(room.type) === "private" ? <p>{room.roomCount} Rooms</p> : <p>{room.avilableBedsPerRoom} Beds</p>}
                        </span>
                        <span className="availability">
                          {(room.roomCount === 0 && room.roomType === "private") || (room.avilableBedsPerRoom === 0 && room.roomType === "shared") ?
                            <span className="red-text">Unavailable</span> :
                            <span className="green-text">{room.availability}</span>
                          }
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No specific room options listed. General rent applies.</p>
                  )}
                </div>
              </div>
            </section>

            <section className="location-section">
              <h2>Location</h2>
              <div className="map-placeholder">
                {mapLoading ? (
                  <div>Loading map...</div>
                ) : (
                  mapCoordinates ? (
                    <MapContainer
                      key={mapCoordinates[0] + '-' + mapCoordinates[1]}
                      center={mapCoordinates}
                      zoom={15}
                      scrollWheelZoom={false}
                      style={{ height: '400px', width: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={mapCoordinates}>
                        <Popup>
                          {pgData.name}<br />{pgData.location}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <p>Map not available for this location. ({pgData.location})</p>
                  )
                )}
              </div>
            </section>

            <section className="owner-section">
              <h2>Owner Information</h2>
              <div className="owner-card">
                <div className="owner-avatar">{pgData.owner.icon || (pgData.owner.name ? pgData.owner.name.charAt(0).toUpperCase() : 'O')}</div>
                <div className="owner-details">
                  <h3>{pgData.owner.name}</h3>
                  {pgData.owner.verified && <span className="verified-badge">✓ Verified Owner</span>}
                  <p className="owner-phone"><FaPhone />{pgData.owner.phone}</p>
                </div>
              </div>
            </section>

            <section className="reviews-section">
              <h2>Reviews ({reviews.length})</h2>
              <div className="reviews-grid">
                {Array.isArray(currentReviews) && currentReviews.length > 0 ? (
                  currentReviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="owner-avatar">{(review.tenant?.name ? review.tenant?.name.charAt(0).toUpperCase() : 'R')}</div>
                        <div className="pg-info">
                          <h3>{review.tenant?.name}</h3>
                        </div>
                      </div>
                      <div className="pg-details">
                        <p className="date">
                          {review.checkInDate && review.checkOutDate && (
                            <>Stayed From: {formatDate(review.checkInDate)}<br />Stayed Upto: {formatDate(review.checkOutDate)}</>
                          )}
                        </p>
                      </div>
                      <div className="review-content">
                        <div className="rating-display">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} className={`star ${star <= review.rating ? 'filled' : ''}`} />
                          ))}
                          <span className="rating-text">{getRatingText(review.rating)}</span>
                        </div>
                        <div className="review-text">
                          <h4>Overall Review:</h4>
                          <p>{review.reviewText}</p>
                          {Object.keys(review.extraReviewFields || {}).length > 0 && (
                            <div className="extra-details">
                              <h4>Specific Feedback:</h4>
                              <ul>
                                {extraReviewQuestions.map((q, idx) => {
                                  const answer = review.extraReviewFields[q.name];
                                  return answer ? (
                                    <li key={idx}><strong>{q.displayTitle}:</strong> {answer}</li>
                                  ) : null;
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      <p>Reviewed on {formatDate(review.date)}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-reviews-message">No published reviews yet. Be the first to review this PG!</p>
                )}
              </div>
              
              {totalPages > 1 && (
                <div className="pagination-controls">
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      onClick={() => setCurrentPage(number + 1)}
                      className={currentPage === number + 1 ? 'active' : ''}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="booking-panel">
            <div className="booking-card">
              <h3>Book This PG</h3>
              <div className="booking-form">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    value={selectedRoom?.type || ''}
                    onChange={(e) => setSelectedRoom(pgData.roomOptions.find(r => r.type === e.target.value))}
                    disabled={pgData.roomOptions.length === 0}
                  >
                    {pgData.roomOptions.length > 0 ? (
                      pgData.roomOptions.map(room => (
                        <option key={room.type} value={room.type} disabled={room.bedsPerRoom === 0}>
                          {room.type} - {`₹${room.rent?.toLocaleString()}/month`}
                        </option>
                      ))
                    ) : (
                      <option value="">No specific room types available</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Duration (months)</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={selectedRoom?.bedsPerRoom === 0}
                  >
                    <option value="1">1 month</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>
                <div className="price-breakdown">
                  <h4>Price Breakdown</h4>
                  <div className="price-item">
                    <span>Rent ({duration} {duration === '1' ? 'month' : 'months'})</span>
                    <span>₹{totalRent.toLocaleString()}</span>
                  </div>
                  <div className="price-item">
                    <span>Security Deposit</span>
                    <span>₹{pgData.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="price-item">
                    <span>Booking Fee</span>
                    <span>₹{pgData.bookingFee.toLocaleString()}</span>
                  </div>
                  {pgData.discount > 0 && (
                    <div className="price-item discount">
                      <span>Discount ({pgData.discount}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="price-item total">
                    <span>Total Amount Payable</span>
                    <span>₹{finalTotalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="terms-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      disabled={selectedRoom?.bedsPerRoom === 0}
                    />
                    <span>I agree to the terms and conditions</span>
                  </label>
                </div>
                <button
                  className="book-now-btn"
                  onClick={handleBookNow}
                  disabled={!termsAccepted || !checkInDate || !selectedRoom || selectedRoom.bedsPerRoom === 0}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

       {showBookingModal && (
  <div className="modal-overlay">
    <div className="booking-modal">
      <h2>Confirm Your Booking</h2>
      <div className="booking-summary">
        <p><strong>PG:</strong> {pgData.name}</p>
                <p><strong>Room Type:</strong> {selectedRoom?.type}</p>
                <p><strong>Check-in:</strong> {checkInDate}</p>
                <p><strong>Duration:</strong> {duration} months</p>
                <p><strong>Total Amount:</strong> ₹{finalTotalAmount.toFixed(2)}</p>
      </div>
      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() => setShowBookingModal(false)}
          disabled={isBookingLoading} // Disable cancel button during loading
        >
          Cancel
        </button>
        <button
          className="confirm-btn"
          onClick={handleConfirmBooking}
          disabled={isBookingLoading} // Disable confirm button during loading
        >
          {isBookingLoading ? (
            <span className="spinner"></span> // Use a CSS spinner here
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
};

export default BookPG;