// ES6 - Footer component with multi-column layout
import { Link } from 'react-router-dom';
import { Wallet, Globe, ExternalLink, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // ES6 - Array of link objects
  const quickLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/income', label: 'Income' },
    { path: '/expenses', label: 'Expenses' },
    { path: '/analytics', label: 'Analytics' },
  ];

  const resourceLinks = [
    { path: '/budget', label: 'Budget Planner' },
    { path: '/converter', label: 'Currency Converter' },
    { path: '/reports', label: 'Reports' },
    { path: '/about', label: 'About' },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Wallet size={18} color="white" />
              </div>
              <span className="fw-bold fs-5 gradient-text">SpendWise</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Smart Expense Tracker with Currency Converter. Take control of your finances
              with intelligent tracking, insightful analytics, and real-time currency conversion.
            </p>
            <div className="d-flex gap-2 mt-3">
              {[Globe, ExternalLink, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: 36, height: 36,
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Quick Links
            </h6>
            <ul className="list-unstyled">
              {quickLinks.map(({ path, label }) => (
                <li key={path} className="mb-2">
                  <Link to={path} style={{ fontSize: '0.875rem' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Resources
            </h6>
            <ul className="list-unstyled">
              {resourceLinks.map(({ path, label }) => (
                <li key={path} className="mb-2">
                  <Link to={path} style={{ fontSize: '0.875rem' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SDG Mapping */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Mapped SDGs
            </h6>
            <div className="d-flex flex-column gap-2">
              <span className="sdg-badge sdg-8">
                🎯 SDG 8: Decent Work & Economic Growth
              </span>
              <span className="sdg-badge sdg-12">
                🌍 SDG 12: Responsible Consumption
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-top mt-4 pt-3 text-center" style={{ borderColor: 'var(--border-color)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
            © {currentYear} SpendWise. Made with <Heart size={12} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} /> for Web Technologies-II Micro Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
