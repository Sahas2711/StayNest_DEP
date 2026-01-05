import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaStar, FaDownload, FaUserCircle } from 'react-icons/fa';
import '../styles/MyProfile.css';
// import OwnerNavbarDashboard from '../components/OwnerNavbarDashboard'; // Assuming this is imported elsewhere if needed
import { getReviewByOwnerId } from '../services/ReviewService'; // Ensure this service is correctly implemented

const PG_LISTINGS = [
    { label: 'All', value: 'all' },
    { label: 'Skyline PG for Girls', value: 'skyline' },
    { label: 'Urban Nest Co-living', value: 'urban' },
    { label: 'Elite Girls Hostel', value: 'elite' },
];

const STAR_FILTERS = [
    { label: 'All', value: 'all' },
    { label: '5⭐', value: 5 },
    { label: '4⭐', value: 4 },
    { label: '3⭐', value: 3 },
    { label: '2⭐', value: 2 },
    { label: '1⭐', value: 1 },
];

// const SORT_OPTIONS = [
//     { label: 'Most Recent', value: 'recent' },
//     { label: 'Highest Rated', value: 'highest' },
// ];

const ViewReviewsOwner = () => {
    const [reviewsData, setReviewsData] = useState([]); // Renamed MOCK_REVIEWS to reviewsData for clarity
    const [search, setSearch] = useState('');
    const [pgFilter, setPgFilter] = useState('all');
    const [starFilter, setStarFilter] = useState('all');
    const [sort, setSort] = useState('recent');
    const [showReply, setShowReply] = useState({});
   // const [showMenu, setShowMenu] = useState({}); // This state is not used in the provided UI, consider removing if not needed

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper function to format stay duration
    const formatStayDuration = (startDate, endDate, duration) => {
        if (duration && typeof duration === 'string') {
            return duration; // Use backend's duration if provided as a string
        }
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const startMonthYear = start.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            const endMonthYear = end.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            return `${startMonthYear} – ${endMonthYear}`;
        }
        return 'N/A';
    };

    useEffect(() => {
        // Fetch reviews from backend
        const fetchReviews = async () => {
            try {
                const response = await getReviewByOwnerId(localStorage.getItem('id'));
               // console.log("Fetched raw reviews:", response);

                // Transform backend response to frontend format
                const transformedReviews = response.map(review => ({
                    id: review.id,
                    pg: review.listing?.title || 'Unknown PG', // Map listing.title to pg
                    roomType: review.listing?.roomType || 'N/A', // Map listing.roomType
                    location: review.listing?.address || 'N/A', // Map listing.address to location
                    tenant: {
                        name: review.tenant?.name || 'Anonymous Tenant', // Map tenant.name
                        avatar: '', // Default avatar, as not provided by backend
                    },
                    stay: formatStayDuration(review.listing?.startDate, review.listing?.endDate, review.duration), // Custom logic for stay
                    content: review.feedback || 'No feedback provided.', // Map feedback to content
                    rating: review.rating || 0, // Map rating
                    tags: [], // Tags are not provided by backend, default to empty array
                    date: formatDate(review.createdAt), // Format review.createdAt to date
                    pinned: false, // Default pinned status
                }));

                setReviewsData(transformedReviews);
             //   console.log("Transformed reviews:", transformedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviewsData([]); // Set to empty array on error
            }
        };
        fetchReviews();
    }, []); // Empty dependency array means this effect runs once on mount

    // Filter and sort reviews
    let filteredReviews = reviewsData.filter(r =>
        (pgFilter === 'all' || r.pg === PG_LISTINGS.find(p => p.value === pgFilter)?.label) &&
        (starFilter === 'all' || r.rating === starFilter) &&
        (search === '' || r.pg.toLowerCase().includes(search.toLowerCase()) || r.tenant.name.toLowerCase().includes(search.toLowerCase()))
    );

    if (sort === 'highest') {
        filteredReviews = [...filteredReviews].sort((a, b) => b.rating - a.rating);
    } else {
        // Sort by date (most recent first). Assuming 'date' is a string like 'DD Month YYYY'
        // For accurate sorting, it's better to sort by the original `createdAt` timestamp if available,
        // but since we've transformed it, we'll parse the formatted date.
        filteredReviews = [...filteredReviews].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA; // Descending order for most recent
        });
    }

    // Mock analytics data (as it was commented out in the original code, keeping it for reference)
    const OWNER_ANALYTICS = {
        total: filteredReviews.length, // Dynamically update total reviews
        avg: filteredReviews.length > 0 ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1) : 0,
        trend: [4.1, 4.2, 4.3, 4.4, 4.3, 4.2, 4.3], // This remains static mock data
    };

    // const renderTrend = () => (
    //     <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 36, marginTop: 8 }}>
    //         {OWNER_ANALYTICS.trend.map((v, i) => (
    //             <div key={i} style={{ width: 16, height: `${(v - 4) * 40 + 20}px`, background: '#004E64', borderRadius: 4, opacity: 0.7 }}></div>
    //         ))}
    //     </div>
    // );

    return (
        <>
            <div className="profile-container" style={{ background: 'linear-gradient(to right, #f9f7ff, #fff0e3)', minHeight: '100vh', padding: 0 }}>
                {/* Header Section */}
                <section className="header-section">
                    <div className="header-content" style={{ alignItems: 'flex-start' }}>
                        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: '#7c5ff0', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: 10 }}><FaArrowLeft style={{ marginRight: 6 }} /> Dashboard</button>
                        <h1 style={{ color: '#7c5ff0' }}>PG Reviews</h1>
                        <p style={{ color: '#666' }}>See what tenants are saying about your listings</p>
                    </div>
                </section>

                {/* Filter & Sort Bar */}
                <section className="tabs-section" style={{ marginTop: 0 }}>
                    <div className="tabs-container" style={{ flexWrap: 'wrap', gap: '1.5rem', background: '#fff', boxShadow: '0 4px 24px rgba(124, 95, 240, 0.08)', borderRadius: 16 }}>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by PG name or tenant" style={{ flex: 2, minWidth: 220, background: '#f9f7ff', border: '2px solid #e0e0e0', borderRadius: 10, padding: '0.7rem 1.2rem', fontSize: 17, color: '#7c5ff0' }} />
                        {/* <select value={pgFilter} onChange={e => setPgFilter(e.target.value)} style={{ minWidth: 160, background: '#f9f7ff', border: '2px solid #e0e0e0', borderRadius: 10, padding: '0.7rem 1.2rem', fontSize: 16, color: '#7c5ff0' }}>
                            {PG_LISTINGS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select> */}
                        <select value={starFilter} onChange={e => setStarFilter(parseInt(e.target.value) || 'all')} style={{ minWidth: 120, background: '#f9f7ff', border: '2px solid #e0e0e0', borderRadius: 10, padding: '0.7rem 1.2rem', fontSize: 16, color: '#7c5ff0' }}>
                            {STAR_FILTERS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        {/* <select value={sort} onChange={e => setSort(e.target.value)} style={{ minWidth: 160, background: '#f9f7ff', border: '2px solid #e0e0e0', borderRadius: 10, padding: '0.7rem 1.2rem', fontSize: 16, color: '#7c5ff0' }}>
                            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select> */}
                        <button
                            style={{ background: '#ff9f59', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: 16, boxShadow: '0 2px 8px #ff9f5933', cursor: 'pointer' }}
                            onClick={() => {
                                // CSV export logic
                                const csvRows = [
                                    ['PG Name', 'Room Type', 'Location', 'Tenant Name', 'Stay Duration', 'Review', 'Rating', 'Tags', 'Date'],
                                    ...filteredReviews.map(r => [
                                        r.pg,
                                        r.roomType,
                                        r.location,
                                        r.tenant.name,
                                        r.stay,
                                        r.content.replace(/"/g, '""'), // Escape double quotes
                                        r.rating,
                                        r.tags ? r.tags.join('; ') : '',
                                        r.date
                                    ])
                                ];
                                const csvContent = csvRows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'reviews_report.csv';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                        >
                            <FaDownload style={{ marginRight: 6 }} /> Download Report
                        </button>
                    </div>
                </section>

                {/* Main Content: Reviews + Analytics */}
                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', maxWidth: 1200, margin: '2.5rem auto', padding: '0 2rem' }}>
                    {/* Reviews Grid */}
                    <div style={{ flex: 2, minWidth: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(370px, 1fr))', gap: 24 }}>
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map(r => (
                                    <div key={r.id} className="form-card" style={{ background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(124, 95, 240, 0.08)', padding: '2rem 1.5rem 1.5rem 1.5rem', position: 'relative', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer', marginBottom: 8, minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px #004e6422'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px #004e6412'; e.currentTarget.style.transform = 'none'; }}
                                    >
                                        {/* PG Info */}
                                        <div style={{ marginBottom: 8 }}>
                                            <div style={{ color: '#7c5ff0', fontWeight: 800, fontSize: 18 }}>{r.pg}</div>
                                            <div style={{ color: '#5e4b8b', fontSize: 15 }}>{r.roomType} &bull; {r.location}</div>
                                        </div>
                                        {/* Tenant Info */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0' }}>
                                            <FaUserCircle style={{ fontSize: 32, color: '#cfd8dc' }} />
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#232323', fontSize: 16 }}>{r.tenant.name}</div>
                                                <div style={{ color: '#888', fontSize: 14 }}>Stay: {r.stay}</div>
                                            </div>
                                        </div>
                                        {/* Review Content */}
                                        <div style={{ color: '#232323', fontSize: 16, margin: '10px 0 8px 0', fontStyle: 'italic' }}>
                                            “{r.content}”
                                        </div>
                                        {/* Star Rating & Tags */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
                                            {[1, 2, 3, 4, 5].map(i => <FaStar key={i} style={{ color: i <= r.rating ? '#ff9f59' : '#e0e0e0', fontSize: 18, transition: 'color 0.3s' }} />)}
                                            <span style={{ color: '#7c5ff0', fontWeight: 700, fontSize: 15, marginLeft: 6 }}>{r.rating}.0/5</span>
                                            {r.tags && r.tags.map(tag => <span key={tag} style={{ background: '#f9f7ff', color: '#7c5ff0', borderRadius: 8, padding: '2px 10px', fontSize: 13, fontWeight: 600, marginLeft: 7 }}>{tag}</span>)}
                                        </div>
                                        {/* Review Date */}
                                        <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Posted on: {r.date}</div>
                                        {/* Reply Box */}
                                        {showReply[r.id] && (
                                            <div style={{ marginTop: 12, background: '#f4f7fb', borderRadius: 8, padding: 10 }}>
                                                <textarea placeholder="Write a reply..." style={{ width: '100%', border: '1.5px solid #cfd8dc', borderRadius: 8, padding: 8, fontSize: 15, minHeight: 48, resize: 'vertical' }} />
                                                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                                    <button style={{ background: '#004E64', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Send Reply</button>
                                                    <button style={{ background: 'none', color: '#888', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }} onClick={() => setShowReply(s => ({ ...s, [r.id]: false }))}>Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', gridColumn: '1 / -1', padding: '2rem' }}>
                                    No reviews found.
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Analytics Panel
                    <div className="form-card" style={{ flex: 1, minWidth: 280, position: 'sticky', top: 32, alignSelf: 'flex-start', background: '#fff', borderRadius: 20, boxShadow: '0 8px 32px rgba(124, 95, 240, 0.08)', padding: '2rem 1.5rem', marginLeft: 0 }}>
                        <div style={{ color: '#7c5ff0', fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Summary Analytics</div>
                        <div style={{ color: '#232323', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Total Reviews: <span style={{ color: '#7c5ff0' }}>{OWNER_ANALYTICS.total}</span></div>
                        <div style={{ color: '#232323', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Average Rating: <span style={{ color: '#ff9f59' }}>{OWNER_ANALYTICS.avg} / 5</span></div>
                        <div style={{ color: '#232323', fontWeight: 700, fontSize: 16, marginTop: 18, marginBottom: 6 }}>Monthly Review Trend</div>
                        {renderTrend()}
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default ViewReviewsOwner;
