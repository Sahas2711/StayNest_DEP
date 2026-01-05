import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {  FaEnvelope, FaPhone, FaCheckCircle,  FaWhatsapp } from 'react-icons/fa';
import '../styles/ContactSupport.css';

const ContactSupport = () => {
  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    attachment: null,
  });
  const [formTouched, setFormTouched] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Ticket lookup
  const [ticketId, setTicketId] = useState('');
  const [ticketFeedback, setTicketFeedback] = useState('');
  // Chat button animation
  const chatBtnRef = useRef(null);
  const contactFormRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chatBtnRef.current) {
        chatBtnRef.current.classList.add('shake');
        setTimeout(() => chatBtnRef.current.classList.remove('shake'), 1000);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();

  // Form handlers
  const handleInput = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
    setFormTouched(true);
    setFormError('');
  };
  const handleReset = () => {
    setForm({ name: '', email: '', subject: '', message: '', attachment: null });
    setFormTouched(false);
    setFormError('');
    setFormSuccess(false);
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.subject || !form.message) {
    setFormError('Please fill all required fields');
    setFormSuccess(false);
    return;
  }
  alert("Your request has been submitted successfully. Our support team will get back to you shortly.");
  setSubmitting(true);

  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('subject', form.subject);
    formData.append('message', form.message);
    // if (form.attachment) {
    //   formData.append('attachment', form.attachment);
    // }

    const response = await fetch('https://formspree.io/f/xrblqpbe', {
      method: 'POST',
      body: formData, // no headers needed for FormData
    });
    alert("Your request has been submitted successfully. Our support team will get back to you shortly.");

  
    setFormSuccess(true);
    setFormError('');
    handleReset();

    setTimeout(() => setFormSuccess(false), 2500);
  } catch (error) {
    setFormError('Failed to send message. Please try again later.');
    setFormSuccess(false);
  } finally {
    setSubmitting(false);
  }
};

  // Ticket lookup
  const handleTrackTicket = () => {
    if (!ticketId.trim()) {
      setTicketFeedback('Please enter a ticket ID');
      return;
    }
    setTicketFeedback('Status: In Progress (mock)');
    setTimeout(() => setTicketFeedback(''), 2500);
  };
  // Copy email
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('staynest06@gmail.com');
    setTicketFeedback('Email copied!');
    setTimeout(() => setTicketFeedback(''), 1500);
  };

  return (
    <>
      <div className="contact-support-page">
        {/* Top Section: Title & Quick Help */}
        <section className="support-hero-section">
          <h1>Need Help? We're here for you!</h1>
          <p>Reach out to our team with any questions or issues.</p>
          {/* <div className="quick-help-grid">
            <div className="quick-help-card" onClick={() => navigate('/contact-support')} style={{ cursor: 'pointer' }}>
              <FaEnvelope className="quick-help-icon" color="#7c5ff0" />
              <span>Submit a Request</span>
            </div>
          </div> */}
        </section>

        {/* Contact Form Card */}
        <section className="contact-form-section" ref={contactFormRef}>
          <div className="contact-form-card">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={handleInput}  placeholder="Owner Name"/>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" value={form.email} onChange={handleInput} placeholder="Owner Email"/>
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input name="subject" value={form.subject} onChange={handleInput} placeholder="Subject" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={handleInput} rows={6} placeholder="How can we help you?" />
              </div>
              {/* <div className="form-group attachment-group">
                <label htmlFor="attachment"><FaPaperclip /> Attachment (optional)</label>
                <input id="attachment" name="attachment" type="file" onChange={handleInput} />
                {form.attachment && <span className="attachment-name">{form.attachment.name}</span>}
              </div> */}
              {/* {formError && <div className="form-error"><FaTimesCircle color="#FF6B6B" /> {formError}</div>} */}
              {formSuccess && <div className="form-success"><FaCheckCircle color="#1ec28b" /> Message sent successfully!</div>}
              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? 'Sending...' : 'Submit'}</button>
                <button type="button" className="reset-btn" onClick={handleReset}>Reset Form</button>
              </div>
            </form>
          </div>
        </section>

        {/* Contact Options Grid */}
        <section className="contact-options-section">
          <h2>Talk to Us Directly</h2>
          <div className="contact-options-grid">
            <div className="contact-option-card">
              <div className="option-icon"><FaWhatsapp color="#25D366" style={{background:'#e9f7ef',borderRadius:'12px',padding:'0.5rem'}} /></div>
              <div className="option-label">Chat on WhatsApp</div>
              <a className="option-btn" style={{background:'#25D366',color:'#fff',textDecoration:'none'}} href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">Start WhatsApp Chat</a>
            </div>
            <div className="contact-option-card">
              <div className="option-icon"><FaPhone color="#7c5ff0" /></div>
              <div className="option-label">Available 9 AM – 6 PM (Mon–Sat)</div>
              <div className="option-number">+91 90962 47010</div>
              <button className="option-btn" style={{background:'#ff9f59',color:'#232323'}}>Call Now</button>
            </div>
            <div className="contact-option-card">
              <div className="option-icon"><FaEnvelope color="#7c5ff0" /></div>
              <div className="option-label">staynest06@gmail.com</div>
              <button className="option-btn" style={{background:'#7c5ff0',color:'#fff'}} onClick={handleCopyEmail}>Copy Email</button>
            </div>
          </div>
        </section>

        {/* Support Hours & Location */}
        {/* <section className="support-hours-section">
          <h2>Support Hours & Location</h2>
          <div className="support-hours-grid">
            <div className="support-hours-block">
              <FaClock className="support-hours-icon" color="#7c5ff0" />
              <div>
                <div><b>Mon–Sat:</b> 9 AM to 6 PM</div>
                <div><b>Sundays & Public Holidays:</b> Email Only</div>
              </div>
            </div>
            <div className="support-location-block">
              <FaMapMarkerAlt className="support-location-icon" color="#7c5ff0" />
              <div>
                StayNest HQ, 2nd Floor, FC Road, Pune, Maharashtra - 411004
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </>
  );
};

export default ContactSupport; 