// ES6 - Contact page with form and FAQ accordion
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Send, MessageSquare, Globe, ExternalLink, HelpCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // ES6 - Destructuring + computed property
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    // Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    // Since this is a frontend-only app, show success
    toast.success('Message sent successfully! 📬');
    setFormData({ name: '', email: '', message: '' });
  };

  // ES6 - FAQ array
  const faqs = [
    {
      question: 'Where is my data stored?',
      answer: 'All your data is stored locally in your browser\'s localStorage. No data is sent to any server. Your financial data stays completely private on your device.',
    },
    {
      question: 'How does the currency converter work?',
      answer: 'The currency converter uses the Frankfurter API, which provides exchange rates from the European Central Bank (ECB). Rates are updated daily on business days. The data is fetched using the ES6 fetch API with async/await.',
    },
    {
      question: 'Can I export my financial data?',
      answer: 'Yes! You can export your transaction data as a PDF report or CSV file from the Reports page. You can also create a full JSON backup from the Profile page.',
    },
    {
      question: 'What happens if I clear my browser data?',
      answer: 'Since data is stored in localStorage, clearing your browser data will delete your SpendWise data. We recommend regularly exporting backups from the Profile page.',
    },
    {
      question: 'What technologies were used to build this?',
      answer: 'SpendWise is built with React.js, Vite, Bootstrap 5, Chart.js, React Router, Framer Motion, and Lucide React. It uses ES6+ JavaScript features throughout and the Frankfurter API for currency conversion.',
    },
    {
      question: 'Is this application free to use?',
      answer: 'Yes, SpendWise is completely free and open-source. It\'s a micro project for Web Technologies-II course demonstrating modern web development practices.',
    },
  ];

  return (
    <div className="container py-4">
      <div className="page-header">
        <h1><Mail size={28} style={{ color: 'var(--primary)', marginRight: 8 }} />Contact Us</h1>
        <p>Get in touch or find answers to common questions</p>
      </div>

      <div className="row g-4">
        {/* Contact Form */}
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card-static p-4 mb-4"
          >
            <h5 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              <MessageSquare size={18} className="me-2" style={{ color: 'var(--primary)' }} />
              Send a Message
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label-custom">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control form-control-custom"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label-custom">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control form-control-custom"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label-custom">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control form-control-custom"
                  placeholder="Write your message here..."
                  rows={5}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn-gradient w-100 d-flex align-items-center justify-content-center gap-2">
                <Send size={16} /> Send Message
              </button>
            </form>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-static p-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              🔗 Connect With Us
            </h6>
            <div className="d-flex flex-column gap-2">
              {[
                { icon: Globe, label: 'GitHub', desc: 'View source code', href: '#' },
                { icon: ExternalLink, label: 'LinkedIn', desc: 'Professional network', href: '#' },
                { icon: Mail, label: 'Email', desc: 'Direct contact', href: 'mailto:contact@spendwise.app' },
              ].map(({ icon: Icon, label, desc, href }) => (
                <a
                  key={label}
                  href={href}
                  className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none"
                  style={{ background: 'var(--bg-tertiary)', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{ width: 40, height: 40, background: 'rgba(var(--primary-rgb), 0.1)', flexShrink: 0 }}
                  >
                    <Icon size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <div className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card-static p-4"
          >
            <h5 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              <HelpCircle size={18} className="me-2" style={{ color: 'var(--warning)' }} />
              Frequently Asked Questions
            </h5>
            <div className="accordion accordion-custom" id="faqAccordion">
              {faqs.map(({ question, answer }, i) => (
                <div className="accordion-item" key={i}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button ${i !== 0 ? 'collapsed' : ''}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#faq-${i}`}
                      style={{ fontSize: '0.9rem' }}
                    >
                      {question}
                    </button>
                  </h2>
                  <div
                    id={`faq-${i}`}
                    className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body" style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
                      {answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
