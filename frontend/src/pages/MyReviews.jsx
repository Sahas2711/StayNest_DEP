import React, { useState, useEffect } from 'react';
import { FaStar, FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/MyReviews.css'; // Ensure your CSS handles the new button styles
import { getReviewsByTenant, addReview, updateReview, deleteReviewById } from '../services/ReviewService';
import bookingService from '../services/BookingService';

const MyReviews = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [selectedPG, setSelectedPG] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
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
    const [hoveredRating, setHoveredRating] = useState(0);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [listings, setListings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [pendingReviews, setPendingReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 3;

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

    const extraQuestionReverseMap = Object.fromEntries(Object.entries(extraQuestionMap).map(([key, value]) => [value, key]));

    useEffect(() => {
        const tenantId = localStorage.getItem('id');
        const fetchData = async () => {
            try {
                const [reviewRes, bookingRes] = await Promise.all([
                    getReviewsByTenant(tenantId),
                    bookingService.getMyBookings(tenantId)
                ]);

                const userReviews = reviewRes || [];
                const userBookings = bookingRes || [];
                const sortedReviews = userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                const reviewedListingIds = new Set(sortedReviews.map(r => r.listing?.id));
                reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const published = userReviews.map(r => {
                    const { id, rating, feedback, createdAt, checkInDate, checkOutDate, listing = {} } = r;
                    const { id: listingId, title: pgName, address: location, thumbnailUrl: thumbnail } = listing;

                    let mainReview = '';
                    const parsedExtraFields = {};

                    const feedbackLines = feedback ? feedback.split('\n').filter(line => line.trim() !== '') : [];
                    if (feedbackLines.length > 0) {
                        if (feedbackLines[0].startsWith('Review:')) {
                            mainReview = feedbackLines[0].substring('Review:'.length).trim();
                            for (let i = 1; i < feedbackLines.length; i++) {
                                const line = feedbackLines[i];
                                const parts = line.split(':');
                                if (parts.length === 2) {
                                    const key = parts[0].trim();
                                    const value = parts[1].trim();
                                    if (Object.keys(extraQuestionMap).some(originalKey => extraQuestionMap[originalKey] === key)) {
                                        parsedExtraFields[key] = value;
                                    }
                                }
                            }
                        } else {
                            mainReview = feedback;
                        }
                    }

                    return {
                        id,
                        rating,
                        reviewText: mainReview,
                        extraReviewFields: parsedExtraFields,
                        date: createdAt,
                        checkInDate,
                        checkOutDate,
                        pgName,
                        location,
                        thumbnail: listing.urls[0] || 'https://via.placeholder.com/150',
                        listingId,
                        status: 'published'
                    };
                });

                const pending = userBookings
                    .filter(b => b.status !== 'CANCELLED' && new Date(b.endDate) < new Date() && !reviewedListingIds.has(b.listing?.id))
                    .map(b => {
                        const { id, startDate: checkInDate, endDate: checkOutDate, listing = {} } = b;
                        const { id: listingId, title: pgName, address: location, thumbnailUrl: thumbnail } = listing;
                        return {
                            id,
                            checkInDate,
                            checkOutDate,
                            pgName,
                            location,
                            thumbnail: listing.urls[0] || 'https://via.placeholder.com/150',
                            listingId,
                            status: 'pending'
                        };
                    });

                const listingMap = new Map();
                [...userReviews, ...userBookings].forEach(item => {
                    const listing = item.listing;
                    if (listing && !listingMap.has(listing.id)) {
                        listingMap.set(listing.id, listing);
                    }
                });

                const uniqueListings = Array.from(listingMap.values());
                setReviews(published);
                setPendingReviews(pending);
                setListings(uniqueListings);
            } catch (err) {
                console.error('Failed to load reviews/bookings:', err);
            }
        };
        fetchData();
    }, []);

    const allReviews = [...reviews, ...pendingReviews];
    const filteredReviews = activeTab === 'all' ? allReviews : (activeTab === 'published' ? reviews : pendingReviews);

    // Pagination logic
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleExtraFieldChange = (questionName, value) => {
        setExtraReviewFields(prevFields => ({
            ...prevFields,
            [questionName]: value
        }));
    };

    const handleSubmitReview = async () => {
        if (rating === 0 || !reviewText.trim() || !checkInDate || !checkOutDate || !selectedPG || !selectedPG.listingId) {
            alert('Please provide rating, review text, check-in, check-out dates, and select a PG.');
            return;
        }

        const tenantId = localStorage.getItem('id');
        if (!tenantId) {
            alert('Tenant ID not found. Please log in again.');
            return;
        }

        let extraFieldsString = Object.entries(extraReviewFields)
            .filter(([, value]) => value !== '')
            .map(([key, value]) => `${key}:${value.toUpperCase()}`)
            .join('\n');

        const fullDescription = `Review:${reviewText}${extraFieldsString ? `\n\n${extraFieldsString}` : ''}`.trim();

        let reviewData = {
            listing: { id: selectedPG.listingId },
            rating: rating,
            feedback: fullDescription,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            tenant: { id: Number(tenantId) }
        };

        try {
            if (isEditing) {
                reviewData.id = editingReviewId;
                const updatedReview = await updateReview(reviewData);

                const updatedMainReview = updatedReview.feedback.split('\n')[0].replace('Review:', '').trim();
                const updatedExtraFields = {};
                updatedReview.feedback.split('\n').slice(1).forEach(line => {
                    if (line.includes(':')) {
                        const [key, value] = line.split(':').map(s => s.trim());
                        updatedExtraFields[key] = value;
                    }
                });

                setReviews(prevReviews => prevReviews.map(review =>
                    review.id === editingReviewId ? {
                        ...review,
                        rating: updatedReview.rating,
                        reviewText: updatedMainReview,
                        extraReviewFields: updatedExtraFields,
                        date: updatedReview.createdAt,
                        checkInDate: updatedReview.checkInDate,
                        checkOutDate: updatedReview.checkOutDate,
                        status: 'published'
                    } : review
                ));
                setIsEditing(false);
                setEditingReviewId(null);
            } else {
                reviewData.id = Date.now();
                const newReview = await addReview(reviewData);

                const newMainReview = newReview.feedback.split('\n')[0].replace('Review:', '').trim();
                const newExtraFields = {};
                newReview.feedback.split('\n').slice(1).forEach(line => {
                    if (line.includes(':')) {
                        const [key, value] = line.split(':').map(s => s.trim());
                        newExtraFields[key] = value;
                    }
                });

                const imageUrl = (selectedPG.urls && selectedPG.urls.length > 0) ? selectedPG.urls[0] : 'https://via.placeholder.com/150';
                setReviews(prevReviews => [
                    ...prevReviews, {
                        id: newReview.id || reviewData.id,
                        pgName: selectedPG.pgName,
                        location: selectedPG.location,
                        rating: newReview.rating,
                        date: newReview.createdAt,
                        reviewText: newMainReview,
                        extraReviewFields: newExtraFields,
                        status: "published",
                        thumbnail: imageUrl,
                        checkInDate: newReview.checkInDate,
                        checkOutDate: newReview.checkOutDate,
                        listingId: Number(selectedPG?.listingId),
                    }
                ]);
                setPendingReviews(prevPending => prevPending.filter(pg => pg.listingId !== selectedPG.listingId));
            }

            setShowSuccessMessage(true);
            handleCloseForm();
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    };

    const handleEditReview = (reviewId) => {
        const reviewToEdit = reviews.find(review => review.id === reviewId);
        if (reviewToEdit) {
            setIsEditing(true);
            setEditingReviewId(reviewId);
            setRating(reviewToEdit.rating);
            setReviewText(reviewToEdit.reviewText);
            setExtraReviewFields(reviewToEdit.extraReviewFields);
            setSelectedPG({
                listingId: reviewToEdit.listingId,
                pgName: reviewToEdit.pgName,
                location: reviewToEdit.location,
                thumbnail: reviewToEdit.thumbnail,
            });
            setCheckInDate(reviewToEdit.checkInDate || '');
            setCheckOutDate(reviewToEdit.checkOutDate || '');
            setShowReviewForm(true);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteReviewById(reviewId);
                setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('Failed to delete review. Please try again.');
            }
        }
    };

    const handleCloseForm = () => {
        setShowReviewForm(false);
        setIsEditing(false);
        setEditingReviewId(null);
        setSelectedPG(null);
        setRating(0);
        setReviewText('');
        setExtraReviewFields({
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
        setHoveredRating(0);
        setCheckInDate('');
        setCheckOutDate('');
    };

    const handleWriteReviewFromPending = (pendingPg) => {
        setSelectedPG(pendingPg);
        setCheckInDate(pendingPg.checkInDate || '');
        setCheckOutDate(pendingPg.checkOutDate || '');
        setShowReviewForm(true);
        setIsEditing(false);
        setRating(0);
        setReviewText('');
        setExtraReviewFields({
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
    };

    const getRatingText = (rating) => {
        const ratings = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent" };
        return ratings[rating] || "";
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (error) {
            console.error("Invalid date string:", dateString);
            return dateString;
        }
    };

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

    const answerOptions = ['Excellent', 'Good', 'Fair', 'Poor'];

    return (
        <div className="my-reviews-container">
            <section className="header-section">
                <div className="header-content">
                    <h1>My Reviews</h1>
                    <p>Share your experience and help others find the right stay.</p>
                </div>
            </section>

            <section className="tabs-section">
                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                    >
                        All Reviews
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('published'); setCurrentPage(1); }}
                    >
                        Published Reviews
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
                    >
                        Pending Reviews
                    </button>
                </div>
            </section>

            {activeTab === 'pending' && (
                <section className="write-review-section">
                    <button
                        className="write-review-btn"
                        onClick={() => { setShowReviewForm(true); setSelectedPG(null); setIsEditing(false); }}
                    >
                        <FaPlus /> Write a Review
                    </button>
                </section>
            )}

            {showReviewForm && (
                <div className="modal-overlay">
                    <div className="review-modal">
                        <div className="modal-header">
                            <h2>{isEditing ? 'Edit Review' : 'Write a Review'}</h2>
                            <button className="close-btn" onClick={handleCloseForm}><FaTimes /></button>
                        </div>
                        <div className="review-form">
                            <div className="form-group">
                                <label>Select PG</label>
                                <select
                                    value={selectedPG?.listingId || ''}
                                    onChange={(e) => {
                                        const listingId = parseInt(e.target.value, 10);
                                        const pg = listings.find(p => p.id === listingId);
                                        if (pg) {
                                            setSelectedPG({
                                                pgName: pg.title,
                                                location: pg.address,
                                                thumbnail: pg.thumbnailUrl || 'https://via.placeholder.com/150',
                                                listingId: pg.id,
                                            });
                                        }
                                    }}
                                    disabled={isEditing}
                                >
                                    <option value="">Choose a PG to review</option>
                                    {listings.map(pg => (
                                        <option key={pg.id} value={pg.id}>{pg.title} - {pg.address}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Check-in Date</label>
                                <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Check-out Date</label>
                                <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} />
                            </div>

                            <h3>Specific Feedback</h3>
                            {extraReviewQuestions.map((q, idx) => (
                                <div className="form-group extra-question-group" key={idx}>
                                    <label>{q.label}</label>
                                    <div className="answer-buttons">
                                        {answerOptions.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                className={`answer-btn ${extraReviewFields[q.name] === option ? 'selected' : ''}`}
                                                onClick={() => handleExtraFieldChange(q.name, option)}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="form-group">
                                <label>Rating</label>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                                            onClick={() => handleRatingChange(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                        />
                                    ))}
                                    {rating > 0 && (<span className="rating-text">{getRatingText(rating)}</span>)}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Your Main Review</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your overall experience..."
                                    rows="4"
                                    maxLength="500"
                                />
                                <div className="char-count">{reviewText.length}/500 characters</div>
                            </div>
                            <div className="form-actions">
                                <button className="cancel-btn" onClick={handleCloseForm}>Cancel</button>
                                <button className="submit-btn" onClick={handleSubmitReview}>
                                    {isEditing ? 'Update Review' : 'Post Review'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="reviews-section">
                <div className="reviews-grid">
                    {Array.isArray(currentReviews) && currentReviews.length > 0 ? (
                        currentReviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="pg-info">
                                        <img
                                            src={review.thumbnail || 'https://via.placeholder.com/150'}
                                            alt={review.pgName}
                                            className="pg-thumbnail"
                                        />
                                        <div className="pg-details">
                                            <h3>{review.pgName}</h3>
                                            <p className="location"><FaMapMarkerAlt />{review.location}</p>
                                            <p className="date"><FaCalendarAlt />
                                                {review.status === 'published' ? (
                                                    <>Reviewed on {formatDate(review.date)}
                                                        {review.checkInDate && review.checkOutDate && (
                                                            <><br />Stay: {formatDate(review.checkInDate)} - {formatDate(review.checkOutDate)}</>
                                                        )}
                                                    </>
                                                ) : `Stayed until ${formatDate(review.checkOutDate)}`}
                                            </p>
                                        </div>
                                    </div>
                                    {review.status === 'published' && (
                                        <div className="review-actions">
                                            <button className="action-btn edit" onClick={() => handleEditReview(review.id)} title="Edit Review">
                                                <FaEdit />
                                            </button>
                                            <button className="action-btn delete" onClick={() => handleDeleteReview(review.id)} title="Delete Review">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {review.status === 'published' ? (
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
                                            {Object.keys(review.extraReviewFields).length > 0 && (
                                                <div className="extra-details">
                                                    <h4>Specific Feedback:</h4>
                                                    <ul>
                                                        {extraReviewQuestions.map((q, idx) => {
                                                            const answer = review.extraReviewFields[q.name];
                                                            return answer ? (
                                                                <li key={idx}>
                                                                    <strong>{q.displayTitle}:</strong> {answer}
                                                                </li>
                                                            ) : null;
                                                        })}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pending-review">
                                        <p>You haven't reviewed this PG yet.</p>
                                        <button className="write-review-btn small" onClick={() => handleWriteReviewFromPending(review)}>
                                            Write Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="no-reviews-message">
                            {activeTab === 'all' && "You don't have any reviews to display."}
                            {activeTab === 'published' && "You haven't published any reviews yet."}
                            {activeTab === 'pending' && "You don't have any pending stays to review."}
                        </p>
                    )}
                </div>
            </section>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => paginate(i + 1)}
                            c
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {showSuccessMessage && (
                <div className="success-message">
                    <FaCheck />
                    {isEditing ? 'Review updated successfully!' : 'Review submitted successfully!'}
                </div>
            )}
        </div>
    );
};

export default MyReviews;