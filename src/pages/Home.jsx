// ES6 - Home page with hero section, feature cards, and SDG mapping
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet, TrendingUp, TrendingDown, BarChart3,
  ArrowLeftRight, Target, Shield, Zap, ChevronRight
} from 'lucide-react';

// ES6 - Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ES6 - Features array with object shorthand
const features = [
  {
    icon: TrendingUp,
    title: 'Income Tracking',
    desc: 'Record salary, freelance, investments and all income sources with categorization.',
    color: '#10b981',
  },
  {
    icon: TrendingDown,
    title: 'Expense Management',
    desc: 'Track daily expenses across food, transport, bills, shopping and more.',
    color: '#ef4444',
  },
  {
    icon: Wallet,
    title: 'Balance Calculator',
    desc: 'Automatically calculate remaining balance from your income minus expenses.',
    color: '#6366f1',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    desc: 'Interactive charts and graphs to analyze your spending patterns over time.',
    color: '#8b5cf6',
  },
  {
    icon: ArrowLeftRight,
    title: 'Currency Converter',
    desc: 'Convert between 150+ currencies using live exchange rates from ECB.',
    color: '#f59e0b',
  },
  {
    icon: Target,
    title: 'Budget Planning',
    desc: 'Set monthly budgets and get alerts when approaching or exceeding limits.',
    color: '#ec4899',
  },
];

const stats = [
  { value: '150+', label: 'Currencies Supported' },
  { value: '9+', label: 'Expense Categories' },
  { value: '100%', label: 'Free & Open Source' },
  { value: 'Live', label: 'Exchange Rates' },
];

const Home = () => {
  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="mb-3">
                  <span className="sdg-badge sdg-8 me-2">SDG 8</span>
                  <span className="sdg-badge sdg-12">SDG 12</span>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="fw-bold mb-3"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', lineHeight: 1.2 }}
                >
                  Smart{' '}
                  <span className="gradient-text">Expense Tracker</span>
                  <br />
                  with Currency Converter
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 540, lineHeight: 1.8 }}
                >
                  Take control of your finances. Track income and expenses, visualize spending
                  patterns, plan budgets, and convert currencies — all in one beautiful app.
                </motion.p>

                <motion.div variants={itemVariants} className="d-flex flex-wrap gap-3 mt-4">
                  <Link to="/dashboard" className="btn-gradient d-inline-flex align-items-center gap-2">
                    Get Started <ChevronRight size={18} />
                  </Link>
                  <Link to="/about" className="btn-outline-primary-custom d-inline-flex align-items-center gap-2">
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                className="glass-card-static p-4"
                style={{ background: 'var(--bg-card)' }}
              >
                {/* Mini Dashboard Preview */}
                <div className="d-flex justify-content-between mb-3">
                  <div>
                    <small style={{ color: 'var(--text-muted)' }}>Monthly Balance</small>
                    <h3 className="gradient-text fw-bold mb-0">₹45,250</h3>
                  </div>
                  <div className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '0.8rem', fontWeight: 600, height: 'fit-content' }}>
                    <TrendingUp size={14} /> +12.5%
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="stat-card income p-2">
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Income</small>
                      <div className="fw-bold" style={{ color: 'var(--success)' }}>₹75,000</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-card expense p-2">
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Expenses</small>
                      <div className="fw-bold" style={{ color: 'var(--danger)' }}>₹29,750</div>
                    </div>
                  </div>
                </div>
                {/* Mini bars */}
                {['Food & Dining', 'Transport', 'Shopping'].map((cat, i) => (
                  <div key={cat} className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                      <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{cat}</small>
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{[35, 25, 20][i]}%</small>
                    </div>
                    <div className="budget-progress">
                      <div
                        className="budget-progress-bar"
                        style={{
                          width: `${[35, 25, 20][i]}%`,
                          background: ['#ef4444', '#f59e0b', '#ec4899'][i],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      <section className="py-5" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map(({ value, label }, index) => (
              <div className="col-6 col-md-3" key={label}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="gradient-text fw-bold mb-1" style={{ fontSize: '1.8rem' }}>{value}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{label}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="fw-bold mb-2" style={{ fontSize: '2rem' }}>
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
              Everything you need to manage your personal finances effectively
            </p>
          </motion.div>

          <div className="row g-4">
            {features.map(({ icon: Icon, title, desc, color }, index) => (
              <div className="col-md-6 col-lg-4" key={title}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="feature-card h-100"
                >
                  <div className="feature-icon" style={{ background: `${color}15`, color }}>
                    <Icon size={28} />
                  </div>
                  <h5 className="fw-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h5>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.7 }}>{desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Tech Stack ===== */}
      <section className="py-5" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <h2 className="fw-bold mb-2">Built With Modern <span className="gradient-text">Technologies</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>ES6+, React, Bootstrap, Chart.js, and more</p>
          </motion.div>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            {['React.js', 'Bootstrap 5', 'Chart.js', 'ES6+', 'Fetch API', 'React Router', 'Framer Motion', 'Lucide Icons'].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 rounded-pill fw-medium"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center glass-card-static p-5"
            style={{ background: 'var(--gradient-card)' }}
          >
            <Shield size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
            <h3 className="fw-bold mb-2">Start Managing Your Finances Today</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto 1.5rem' }}>
              Your data stays on your device. No account needed. 100% private and secure.
            </p>
            <Link to="/dashboard" className="btn-gradient d-inline-flex align-items-center gap-2">
              <Zap size={18} /> Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
