import React, { useState } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';

const faqs = [
  { label: 'How to book a PG', link: '#' },
  { label: 'How to list your PG', link: '#' },
  { label: 'Safety & Trust', link: '#' },
];

const ContactSupportHome = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
     const [formTouched, setFormTouched] = useState(false);
     const [formError, setFormError] = useState('');
     const [formSuccess, setFormSuccess] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    await fetch('https://formspree.io/f/xrblqpbe', {
      method: 'POST',
      body: formData, // no headers needed for FormData
    });
    alert("Your request has been submitted successfully. Our support team will get back to you shortly.");

  
    setFormSuccess(true);
    setFormError('');
    //handleReset();

    setTimeout(() => setFormSuccess(false), 2500);
  } catch (error) {
    setFormError('Failed to send message. Please try again later.');
    setFormSuccess(false);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <section id="contact-support-home" style={{
      background: '#f9f7ff',
      padding: '3rem 0 2rem 0',
      minHeight: 600,
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 36, color: '#7c5ff0', fontWeight: 800, marginBottom: 8, letterSpacing: 0.5 }}>
          Need Help? We’re Here for You!
        </h2>
        <p style={{ color: '#5e4b8b', fontSize: 18, marginBottom: 0 }}>
          Get in touch with our support team for any questions, issues, or feedback.
        </p>
      </div>

      {/* Contact Options Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        flexWrap: 'wrap',
        marginBottom: 36,
      }}>
        {/* Card 1: Contact Form */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 32px #7c5ff022',
          padding: 28,
          minWidth: 320,
          maxWidth: 350,
          flex: 1,
          transition: 'transform 0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ background: '#7c5ff0', borderRadius: '50%', padding: 16, marginBottom: 12 }}>
            <FaEnvelope size={32} color="#fff" />
          </div>
          <h3 style={{ color: '#7c5ff0', fontWeight: 700, fontSize: 22, marginBottom: 12 }}>Send us a Message</h3>
          <form style={{ width: '100%' }} onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e8e2ff', marginBottom: 10, outline: 'none', fontSize: 16,
                transition: 'box-shadow 0.2s',
                boxShadow: 'none',
              }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7c5ff044'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e8e2ff', marginBottom: 10, outline: 'none', fontSize: 16,
                transition: 'box-shadow 0.2s',
                boxShadow: 'none',
              }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7c5ff044'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
            <input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e8e2ff', marginBottom: 10, outline: 'none', fontSize: 16,
                transition: 'box-shadow 0.2s',
                boxShadow: 'none',
              }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7c5ff044'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={3}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid #e8e2ff', marginBottom: 14, outline: 'none', fontSize: 16,
                resize: 'vertical',
                transition: 'box-shadow 0.2s',
                boxShadow: 'none',
              }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #7c5ff044'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%', background: '#7c5ff0', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 0', fontWeight: 700, fontSize: 18, marginTop: 4, cursor: 'pointer',
                boxShadow: '0 2px 8px #7c5ff033', transition: 'background 0.2s, transform 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {submitting ? <span className="loader" style={{ border: '3px solid #fff', borderTop: '3px solid #7c5ff0', borderRadius: '50%', width: 18, height: 18, animation: 'spin 1s linear infinite' }}></span>
                : submitted ? <span style={{ fontSize: 20, color: '#fff' }}>✔</span>
                : 'Submit'}
            </button>
          </form>
        </div>
        {/* Card 2: WhatsApp */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 32px #ff9f5922',
          padding: 28,
          minWidth: 260,
          maxWidth: 300,
          flex: 1,
          transition: 'transform 0.2s',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ background: '#25D366', borderRadius: '50%', padding: 16, marginBottom: 12 }}>
            <FaWhatsapp size={32} color="#fff" />
          </div>
          <h3 style={{ color: '#25D366', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>WhatsApp Us</h3>
          <div style={{ color: '#5e4b8b', fontSize: 16, marginBottom: 18 }}>Available 10 AM – 6 PM IST</div>
          <a
            href="https://wa.me/919096247010"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#25D366', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 0', width: '100%', fontWeight: 700, fontSize: 17, cursor: 'pointer',
              boxShadow: '0 2px 8px #25D36633', transition: 'background 0.2s, transform 0.2s', textAlign: 'center', textDecoration: 'none',
            }}
          >Chat on WhatsApp</a>
        </div>
        {/* Card 3: Call Support */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 32px #7c5ff022',
          padding: 28,
          minWidth: 260,
          maxWidth: 300,
          flex: 1,
          transition: 'transform 0.2s',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ background: '#7c5ff0', borderRadius: '50%', padding: 16, marginBottom: 12 }}>
            <FaPhone size={32} color="#fff" />
          </div>
          <h3 style={{ color: '#7c5ff0', fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Talk to Our Team</h3>
          <div style={{ color: '#5e4b8b', fontSize: 16, marginBottom: 18 }}>+91 90962 47010</div>
          <a href="tel:+919096247010"
            style={{
              background: '#7c5ff0', color: '#fff', border: 'none', borderRadius: 999, padding: '10px 0', width: '100%', fontWeight: 700, fontSize: 17, cursor: 'pointer',
              boxShadow: '0 2px 8px #7c5ff033', transition: 'background 0.2s, transform 0.2s', textAlign: 'center', textDecoration: 'none',
            }}
          >Call Now</a>
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div style={{ textAlign: 'center', margin: '2.5rem 0 1.5rem 0' }}>
        <div style={{ color: '#5e4b8b', fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Popular Help Topics:</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {faqs.map((faq, idx) => (
            <a
              key={faq.label}
              href={faq.link}
              style={{
                color: '#7c5ff0', background: '#fff', borderRadius: 16, padding: '8px 18px', fontWeight: 600, fontSize: 16, textDecoration: 'none', boxShadow: '0 2px 8px #7c5ff011', transition: 'background 0.2s, color 0.2s',
                marginBottom: 6,
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#7c5ff0'; e.currentTarget.style.color = '#fff'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#7c5ff0'; }}
            >
              {faq.label}
            </a>
          ))}
        </div>
      </div>

      {/* Footer Callout */}
       {/*  <div style={{ textAlign: 'center', marginTop: 32, color: '#5e4b8b', fontSize: 17 }}>
        <span style={{ fontWeight: 600 }}>🤝 Still need help?</span> Email us at <a href="mailto:support@staynest.com" style={{ color: '#7c5ff0', fontWeight: 700 }}>support@staynest.com</a> or visit the <a href="#" style={{ color: '#ff9f59', fontWeight: 700 }}>Help Center</a>.
      </div>*/}
      {/* Loader animation keyframes */}
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

export default ContactSupportHome; 