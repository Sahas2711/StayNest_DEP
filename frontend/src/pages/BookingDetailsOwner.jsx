import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaPhone, FaEnvelope, FaIdBadge, FaBed, FaMapMarkerAlt, FaRegCalendarAlt, FaCreditCard, FaFilePdf, FaLink, FaCheckCircle, FaClock, FaTimesCircle, FaChevronDown, FaChevronUp, FaComments, FaCalendarAlt, FaDownload, FaTimes, FaHeadset, FaGavel } from 'react-icons/fa';
import '../styles/BookingDetails.css';

const statusOptions = [
  { value: 'confirmed', label: 'Confirmed', color: '#1ec28b', icon: <FaCheckCircle /> },
  { value: 'pending', label: 'Pending', color: '#ff9f59', icon: <FaClock /> },
  { value: 'cancelled', label: 'Cancelled', color: '#FF6B6B', icon: <FaTimesCircle /> },
  { value: 'checkedin', label: 'Checked-in', color: '#3b82f6', icon: <FaCalendarAlt /> },
  { value: 'checkedout', label: 'Checked-out', color: '#6b7280', icon: <FaCalendarAlt /> },
];

const BookingDetailsOwner = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('confirmed');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [collapsed, setCollapsed] = useState({ tenant: false, pg: false, status: false, actions: false, notes: false, support: false });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data
  const tenant = {
    name: 'Shreya Newaskar',
    contact: '+91-9876543210',
    email: 'shreya@email.com',
    id: '#TN202507',
  };
  const pg = {
    name: 'Skyline PG for Girls',
    location: 'Koramangala, Bangalore',
    roomType: 'Twin Sharing',
    bookingDates: '15 July 2025 → 15 Dec 2025',
    amountPaid: 25000,
    listingId: 'skyline-pg',
  };
  const booking = {
    status,
    bookingId: '#SN-2025-09182',
    bookingDate: '10 July 2025',
    paymentStatus: status === 'confirmed' ? 'Paid' : 'Pending',
  };

  // Status tag helpers
  const statusObj = statusOptions.find(opt => opt.value === status) || statusOptions[0];

  // Toast
  const showStatusToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Handlers
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    showStatusToast('Booking status updated!');
  };
  const handleDownload = () => showStatusToast('Download started!');
  const handleCancel = () => {
    setStatus('cancelled');
    showStatusToast('Booking cancelled!');
  };
  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 1500);
  };

  // Collapsible wrapper
  const Card = ({ title, icon, children, sectionKey, defaultOpen = true }) => (
    <div className={`bd-card fade-in${isMobile ? ' collapsible' : ''}${collapsed[sectionKey] ? ' collapsed' : ''}`}
      onMouseEnter={e => e.currentTarget.classList.add('lift')}
      onMouseLeave={e => e.currentTarget.classList.remove('lift')}
    >
      <div className="bd-card-header" onClick={() => isMobile && setCollapsed(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))}>
        <div className="bd-card-title">{icon} {title}</div>
        {isMobile && (
          <span className="bd-card-chevron">{collapsed[sectionKey] ? <FaChevronDown color="#7c5ff0" /> : <FaChevronUp color="#7c5ff0" />}</span>
        )}
      </div>
      {(!isMobile || !collapsed[sectionKey]) && <div className="bd-card-content">{children}</div>}
    </div>
  );

  return (
    <div className="booking-details-bg">
        {/* Header */}
        <div className="bd-header">
          <button className="bd-back-btn" onClick={() => navigate(-1)}><FaArrowLeft color="#7c5ff0" /> Bookings</button>
          <h1>Booking Details</h1>
          <p className="bd-subtitle">Complete information about this booking</p>
        </div>

        {/* Tenant Info Card */}
        <Card title="Tenant Information" icon={<FaUser color="#7c5ff0" />} sectionKey="tenant">
          <div className="bd-summary-grid">
            <div className="bd-summary-row"><span><FaUser /> Name</span><span>{tenant.name}</span></div>
            <div className="bd-summary-row"><span><FaPhone /> Contact</span><span>{tenant.contact}</span></div>
            <div className="bd-summary-row"><span><FaEnvelope /> Email</span><span>{tenant.email}</span></div>
            <div className="bd-summary-row"><span><FaIdBadge /> Tenant ID</span><span>{tenant.id}</span></div>
          </div>
          <button className="bd-btn bd-btn-support" onClick={()=>navigate('/my-profile')}><FaUser /> View Profile</button>
        </Card>

        {/* PG/Listing Info Card */}
        <Card title="PG/Listing Information" icon={<FaBed color="#7c5ff0" />} sectionKey="pg">
          <div className="bd-summary-grid">
            <div className="bd-summary-row"><span><FaBed /> PG Name</span><span>{pg.name}</span></div>
            <div className="bd-summary-row"><span><FaMapMarkerAlt /> Location</span><span>{pg.location}</span></div>
            <div className="bd-summary-row"><span><FaBed /> Room Type</span><span>{pg.roomType}</span></div>
            <div className="bd-summary-row"><span><FaRegCalendarAlt /> Booking Dates</span><span>{pg.bookingDates}</span></div>
          </div>
          <div className="bd-summary-actions">
            <button className="bd-btn bd-btn-pdf" onClick={handleDownload}><FaFilePdf /> Download Agreement</button>
            <button className="bd-btn bd-btn-pdf" onClick={handleDownload}><FaDownload /> Download Receipt</button>
          </div>
        </Card>

        {/* Booking Status Card */}
        <Card title="Booking Status" icon={statusObj.icon} sectionKey="status">
          <div className="bd-summary-grid">
            <div className="bd-summary-row"><span>Status</span><span className="bd-status" style={{color:statusObj.color,fontWeight:600}}>{statusObj.icon} {statusObj.label}</span></div>
            <div className="bd-summary-row"><span>Booking ID</span><span>{booking.bookingId}</span></div>
            <div className="bd-summary-row"><span>Booking Date</span><span>{booking.bookingDate}</span></div>
            <div className="bd-summary-row"><span>Payment Status</span><span>{booking.paymentStatus}</span></div>
          </div>
          <div style={{marginTop:'1rem'}}>
            <label htmlFor="status-select" style={{fontWeight:600,marginRight:'0.7rem'}}>Update Status:</label>
            <select id="status-select" value={status} onChange={handleStatusChange} style={{padding:'0.5rem',borderRadius:'8px',border:'1px solid #ddd'}}>
              {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </Card>

        {/* Action Panel */}
        <Card title="Actions" icon={<FaComments color="#7c5ff0" />} sectionKey="actions">
          <div className="bd-actions">
            <button className="bd-btn bd-btn-support" onClick={()=>setShowChat(true)}><FaEnvelope /> Send Message to Tenant</button>
            <button className="bd-btn bd-btn-support" onClick={()=>setShowCalendar(true)}><FaCalendarAlt /> View Booking Calendar</button>
            <button className="bd-btn bd-btn-pdf" onClick={handleDownload}><FaDownload /> Download Booking Details</button>
            {status === 'pending' && <button className="bd-btn bd-btn-cancel" onClick={handleCancel}><FaTimes /> Cancel Booking</button>}
          </div>
        </Card>

        {/* Notes/Admin Comments */}
        <Card title="Admin Notes (Internal)" icon={<FaIdBadge color="#7c5ff0" />} sectionKey="notes">
          <textarea
            rows={4}
            value={adminNotes}
            onChange={e => setAdminNotes(e.target.value)}
            placeholder="Add internal notes about this tenant or booking..."
            style={{width:'100%',borderRadius:'8px',padding:'0.7rem',border:'1.5px solid #e0e0e0',marginBottom:'0.7rem'}}
          />
          <button className="bd-btn bd-btn-support" onClick={handleSaveNotes}>Save Notes</button>
          {notesSaved && <span style={{color:'#1ec28b',marginLeft:'1rem'}}>Notes saved!</span>}
        </Card>

        {/* Support Shortcuts */}
        <Card title="Support Shortcuts" icon={<FaHeadset color="#7c5ff0" />} sectionKey="support">
          <div className="bd-actions">
            <button className="bd-btn bd-btn-support" onClick={()=>showStatusToast('Ticket raised!')}><FaHeadset /> Raise Ticket with StayNest</button>
            <button className="bd-btn bd-btn-pdf" onClick={()=>window.open('https://staynest.in/dispute-guidelines','_blank')}><FaGavel /> View Dispute Guidelines</button>
          </div>
        </Card>

        {/* Toast Notification */}
        {showToast && <div className="bd-toast fade-in">{toastMsg}</div>}

        {/* Chat Modal */}
        {showChat && (
          <div className="bd-modal-overlay">
            <div className="bd-modal">
              <h3>Send Message to Tenant</h3>
              <textarea rows={4} placeholder="Type your message..." style={{width:'100%',borderRadius:'8px',padding:'0.7rem',border:'1.5px solid #e0e0e0',marginBottom:'0.7rem'}} />
              <div className="bd-modal-actions">
                <button className="bd-btn bd-btn-support" onClick={()=>{setShowChat(false);showStatusToast('Message sent!')}}>Send</button>
                <button className="bd-btn" onClick={()=>setShowChat(false)}><FaTimes /> Close</button>
              </div>
            </div>
          </div>
        )}
        {/* Calendar Modal */}
        {showCalendar && (
          <div className="bd-modal-overlay">
            <div className="bd-modal">
              <h3>Booking Calendar</h3>
              <div style={{margin:'1rem 0',textAlign:'center',color:'#888'}}>Calendar view coming soon...</div>
              <div className="bd-modal-actions">
                <button className="bd-btn" onClick={()=>setShowCalendar(false)}><FaTimes /> Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default BookingDetailsOwner; 