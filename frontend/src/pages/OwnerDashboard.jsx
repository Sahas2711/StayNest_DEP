import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OwnerDashboard.css';
import { FaHome, FaSearch, FaUser, FaRegCommentDots, FaHeart, FaCog, FaArrowRight, FaRegCalendarAlt, FaMapMarkerAlt, FaSpinner } from "react-icons/fa"; // Added FaSpinner
import listingService from '../services/ListingService';
import bookingService from '../services/BookingService'; // Import booking service
import {getCurrentOwner} from '../services/OwnerService'; // Import service to get current owner details

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [ownerListings, setOwnerListings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]); // New state for recent bookings
  const [loadingBookings, setLoadingBookings] = useState(true); // New loading state for bookings
  const [loadingListings, setLoadingListings] = useState(true); // Added for listings loading
  const[name, setName] = useState('');
  const [totalBookings, setTotalBookings] = useState(0); // New state for total bookings
  useEffect(() => {
    const ownerId = localStorage.getItem('id');
    if (!ownerId) {
      alert('Please log in as an owner to access this dashboard.');
      navigate('/login');
      return;
    }
        const fetchOwnerData = async () => { // Define an async function
      try {
        const owner = await getCurrentOwner(); // Await the Promise to get the actual owner object
        //console.log("Current owner (after await):", owner);

        if (owner && owner.name) { // Always check if owner and owner.name exist
          setName(owner.name); // Set the owner's name
          //console.log("Owner name:", owner.name);
          //console.log("Owner first letter:", owner.name[0]);
          localStorage.setItem('ownerFirstLetter', owner.name[0]); // Store the first letter
        } else {
          console.warn("Owner data or name not found.");
        }
      } catch (error) {
        console.error("Failed to fetch current owner:", error);
        // Handle error, e.g., redirect to login or show an error message
      }
    };// Store in localStorage if needed
    const fetchListings = async () => {
      try {
        setLoadingListings(true);
        const res = await listingService.getMyListings(ownerId);
       // console.log("Listings response:", res);
        if (Array.isArray(res)) {
          setOwnerListings(res);
        } else {
          console.error("Expected array but got:", res);
          setOwnerListings([]); // fallback to empty array to prevent crash
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setOwnerListings([]); // fallback on failure
      } finally {
        setLoadingListings(false);
      }
    };

    const fetchRecentBookings = async () => {
    try {
        setLoadingBookings(true);
        // Fetch ALL bookings for the owner
        const allBookings = await bookingService.getBookingsByOWner(); 

        // Update the total bookings count
        setTotalBookings(allBookings.length); 

        // Sort all bookings to get the most recent ones
        const sortedBookings = allBookings.sort((a, b) => b.id - a.id);
        
        // Take only the top 3 for the "Recent Bookings" section
        setRecentBookings(sortedBookings.slice(0, 3));
    } catch (error) {
        console.error('Error fetching bookings:', error);
        setTotalBookings(0);
        setRecentBookings([]);
    } finally {
        setLoadingBookings(false);
    }
};
    fetchOwnerData(); // Fetch owner data
    fetchListings();
    fetchRecentBookings(); // Call the new function to fetch bookings
  }, [navigate]); // navigate is a stable function, but good to include if it's used in useEffect's scope


  const handleAddListing = () => {
    navigate('/owner/create-listing');
  };

  // const handleEditListing = (listingId) => {
  //   navigate(`/owner/edit-listing/${listingId}`);
  // };

  // const handleAccountSettings = () => {
  //   navigate('/account-settings');
  // };

  // const handleManageBookings = () => {
  //   navigate('/manage-bookings');
  // };

  // const handleContactSupport = () => {
  //   navigate('/contact-support');
  // };

  // const handleContactSupportOwner = () => {
  //   navigate('/owner/contact-support');
  // };

  // const handleViewBookingDetails = (bookingId) => { // Modified to accept bookingId
  //   navigate(`/owner/booking-details/${bookingId}`); // Navigate to a detailed booking page
  // };

  // const handleDeleteListing = async (listingId, idx) => {
  //   if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
  //   try {
  //     if (listingId) {
  //       const listingService = (await import('../services/ListingService')).default;
  //       await listingService.deleteListing(listingId);
  //     }
  //     const updated = ownerListings.filter((_, i) => i !== idx);
  //     setOwnerListings(updated);
  //     alert('Listing deleted successfully.');
  //   } catch (err) {
  //     alert('Failed to delete listing.');
  //   }
  // };

  return (
    <div className="dashboard-container">
      {/* Hero Section with Stats */}
      <section className="hero-section">
        <div className="hero-card-gradient">
          <div className="hero-card-header">
            <div>
              <h1 className="hero-welcome hero-welcome-orange">Welcome back, {name.toLocaleUpperCase()}! </h1>
              <p className="hero-subtitle hero-subtitle-orange">Here's a quick look at your PG performance.</p>
            </div>
            <div className="hero-icon-box">
              <FaHome />
            </div>
          </div>
          <div className="stats-pills">
            <div className="stat-pill">
              <span className="stat-number">{ownerListings.length}</span> {/* Dynamic active listings */}
              <span className="stat-label">Active Listings</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number">
                {/* Calculate total tenants from recentBookings or from a dedicated API call */}
                {recentBookings.length > 0 ? recentBookings.length : '0'} {/* Placeholder: You'd need a separate count for all tenants across all bookings */}
              </span>
              <span className="stat-label">Total Tenants</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number">{totalBookings}</span>
              <span className="stat-label"><span className="star"></span> Total Bookings</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="listings-header">
          <h2>My PG Listings</h2>
          <button className="add-listing-btn" onClick={handleAddListing}>Add New Listing</button>
        </div>

        {loadingListings ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading listings...</p>
          </div>
        ) : ownerListings.length > 0 ? (
          <div className="listings-grid">
            {ownerListings.map((listing, idx) => (
              <div className="listing-card" key={listing.id}>
                <div className="listing-status">
                  <span className="status-badge active">Active</span>
                  <span className="status-badge verified">Verified</span>
                </div>

           {listing.urls && listing.urls.length > 0 ? (
                    <img
                      src={listing.urls[0] || listing.url} // Correctly access the first URL in the 'urls' array
                      alt="Listing"
                      className="listing-image-placeholder"
                      style={{ objectFit: 'cover', width: '100%', height: '120px', borderRadius: '12px' }}
                    />
                  ) : (
                    <div className="listing-image-placeholder"></div>
                  )}

                <div className="listing-content">
                  <h3>{listing.title}</h3>
                  <p className="listing-location">
                    <FaMapMarkerAlt /> {listing.address}
                  </p>
                 
                  <div className="listing-price-rating">
                    <span className="listing-price">
                      ₹{listing.rent}<span className="price-period">/month</span>
                    </span>
                    <span className="listing-rating"></span>
                  </div>
                </div>

                <div className="listing-actions">
                  <button className="action-btn edit-btn" onClick={() => navigate(`/owner/edit-listing/${listing.id}`)}>Edit</button>
                  <button className="action-btn bookings-btn" onClick={() => navigate(`/listing-bookings/${listing.id}`)}>Bookings</button>
                  {/* { <button className="action-btn delete-btn" title="Delete Listing" onClick={() => handleDeleteListing(listing.id, idx)}><FaTrash /></button> }
                */}</div> 
              </div>
            ))}

            <div className="add-listing-card" onClick={handleAddListing}>
              <div className="add-listing-icon">
                <span>+</span>
              </div>
              <h3>Add New Listing</h3>
              <p>List a new PG or hostel and start getting bookings</p>
              <button className="get-started-btn">Get Started</button>
            </div>
          </div>
        ) : (
          <p>No listings found. Add your first PG!</p>
        )}
      </section>

      {/* Quick Actions */}
      <section className="section quick-actions-section">
        <h2 className="quick-actions-title">Quick Actions</h2>
        <p className="quick-actions-subtitle">Manage your properties efficiently</p>
        <div className="quick-actions-grid">
          <div className="quick-action-card green" onClick={() => navigate('/owner/create-listing')}>
            <div className="icon-bg"><FaSearch /></div>
            <div className="action-content">
              <div className="action-title-row">
                <h3>Add New Listing</h3>
                <FaArrowRight className="action-arrow" />
              </div>
              <p className="action-desc">List your new PG</p>
              <div className="accent-bar green"></div>
            </div>
          </div>
          <div className="quick-action-card yellow" onClick={() => navigate('/manage-bookings')}>
            <div className="icon-bg"><FaUser /></div>
            <div className="action-content">
              <div className="action-title-row">
                <h3>Manage Bookings</h3>
                <FaArrowRight className="action-arrow" />
              </div>
              <p className="action-desc">View booking requests</p>
              <div className="accent-bar yellow"></div>
            </div>
          </div>
          <div className="quick-action-card green" onClick={() => navigate('/owner/contact-support')}>
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
          <div className="quick-action-card pink" onClick={() => navigate('/owner/view-reviews')}>
            <div className="icon-bg"><FaHeart /></div>
            <div className="action-content">
              <div className="action-title-row">
                <h3>View Reviews</h3>
                <FaArrowRight className="action-arrow" />
              </div>
              <p className="action-desc">Check tenant feedback</p>
              <div className="accent-bar pink"></div>
            </div>
          </div>
          <div className="quick-action-card gray" onClick={() => navigate('/account-settings-owner')}>
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
        </div>
      </section>

      
      {/* Recent Bookings */}
      <section className="section recent-bookings-section">
        <h2>Recent Bookings</h2>
        {loadingBookings ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Loading recent bookings...</p>
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="card-grid">
            {recentBookings.map((booking) => (
              <div className="card" key={booking.id}>
                <div className={`status-label status-${booking.status ? booking.status.toLowerCase() : 'unknown'}`}>
                  {booking.status || 'Unknown'}
                </div>
                <h3>{booking.tenant?.name || 'Unknown Tenant'}</h3> {/* Accessing nested tenant name */}
                <p><FaMapMarkerAlt /> {booking.listing?.title || 'Unknown PG'}</p> {/* Accessing nested listing title */}
                <p>
                  <FaRegCalendarAlt /> {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <p>₹{booking.listing.rent || 'N/A'}</p> {/* Using totalRent */}
                     </div>
            ))}
          </div>
        ) : (
          <p>No recent bookings found.</p>
        )}
      </section>

      {/* Performance Overview */}
      <section className="section">
        {/*<div className="performance-header">
          <h2>Performance Overview</h2>
          <p>Track your business growth and key metrics</p>
        </div>*/}

        {/* Stat Cards
        <div className="performance-stats">
          <div className="performance-stat-card">
            <div className="stat-icon teal">
              <FaRegCalendarAlt />
            </div>
            <div className="stat-content">
              <div className="stat-main">
                <span className="stat-number">47</span>
                <div className="stat-change">
                  <span className="change-arrow">↗</span>
                  <span className="change-percent">+12%</span>
                </div>
              </div>
              <span className="stat-label">Total Bookings</span>
            </div>
          </div>

          <div className="performance-stat-card">
            <div className="stat-icon blue">
              <FaUser />
            </div>
            <div className="stat-content">
              <div className="stat-main">
                <span className="stat-number">85%</span>
                <div className="stat-change">
                  <span className="change-arrow">↗</span>
                  <span className="change-percent">+5%</span>
                </div>
              </div>
              <span className="stat-label">Average Occupancy</span>
            </div>
          </div>

          <div className="performance-stat-card">
            <div className="stat-icon green">
              <FaCreditCard />
            </div>
            <div className="stat-content">
              <div className="stat-main">
                <span className="stat-number">₹1,24,500</span>
                <div className="stat-change">
                  <span className="change-arrow">↗</span>
                  <span className="change-percent">+18%</span>
                </div>
              </div>
              <span className="stat-label">Monthly Revenue</span>
            </div>
          </div>

          <div className="performance-stat-card">
            <div className="stat-icon yellow">
              <FaHeart />
            </div>
            <div className="stat-content">
              <div className="stat-main">
                <span className="stat-number">4.7</span>
                <div className="stat-change">
                  <span className="change-arrow">↗</span>
                  <span className="change-percent">+0.2</span>
                </div>
              </div>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
 */}
        {/* Bar Charts 
        <div className="charts-container">
          <div className="chart-card">
            <h3>Monthly Bookings</h3>
            <div className="chart-bars">
              <div className="chart-bar">
                <span className="bar-label">Jan</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{width: '68%'}}></div>
                </div>
                <span className="bar-value">32</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">Feb</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{width: '81%'}}></div>
                </div>
                <span className="bar-value">38</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">Mar</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{width: '89%'}}></div>
                </div>
                <span className="bar-value">42</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">Apr</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{width: '96%'}}></div>
                </div>
                <span className="bar-value">45</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">May</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{width: '87%'}}></div>
                </div>
                <span className="bar-value">41</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">Jun</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{width: '100%'}}></div>
                </div>
                <span className="bar-value">47</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3>Monthly Revenue</h3>
            <div className="chart-bars">
              <div className="chart-bar">
                <span className="bar-label">Jan</span>
                <div className="bar-container">
                  <div className="bar-fill revenue" style={{width: '69%'}}></div>
                </div>
                <span className="bar-value">₹98k</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">Feb</span>
                <div className="bar-container">
                  <div className="bar-fill revenue" style={{width: '81%'}}></div>
                </div>
                <span className="bar-value">₹115k</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">Mar</span>
                <div className="bar-container">
                  <div className="bar-fill revenue" style={{width: '90%'}}></div>
                </div>
                <span className="bar-value">₹128k</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">Apr</span>
                <div className="bar-container">
                  <div className="bar-fill revenue" style={{width: '95%'}}></div>
                </div>
                <span className="bar-value">₹135k</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">May</span>
                <div className="bar-container">
                  <div className="bar-fill revenue" style={{width: '88%'}}></div>
                </div>
                <span className="bar-value">₹125k</span>
              </div>
              <div className="chart-bar">
                <span className="bar-label">Jun</span>
                <div className="bar-container">
                  <div className="bar-fill revenue" style={{width: '100%'}}></div>
                </div>
                <span className="bar-value">₹142k</span>
              </div>
            </div>
          </div>
        </div>*/}
      </section>

      <div className="footer-spacing"></div>
    </div>
  );
};

export default OwnerDashboard;