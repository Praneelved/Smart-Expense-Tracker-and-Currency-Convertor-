// ES6 - About page with project info, SDG mapping, and tech stack
import { motion } from 'framer-motion';
import {
  Target, Globe, Code, Users, BookOpen, Lightbulb,
  BarChart3, ArrowLeftRight, Wallet, Shield
} from 'lucide-react';

const About = () => {
  // ES6 - Project features array
  const projectFeatures = [
    { icon: Wallet, title: 'Monthly Income Entry', desc: 'Record and categorize all income sources' },
    { icon: BarChart3, title: 'Expense Management', desc: 'Track daily expenses with categories and notes' },
    { icon: Target, title: 'Balance Calculator', desc: 'Automatically calculate remaining balance' },
    { icon: Lightbulb, title: 'Expense Analysis', desc: 'Interactive charts for spending pattern visualization' },
    { icon: ArrowLeftRight, title: 'Currency Converter', desc: 'Live exchange rates using Frankfurter API' },
  ];

  // ES6 - Tech stack with categories
  const techStack = [
    { name: 'React.js', desc: 'Component-based UI library', category: 'Frontend' },
    { name: 'Vite', desc: 'Next-gen build tool', category: 'Build' },
    { name: 'Bootstrap 5', desc: 'Responsive CSS framework', category: 'Styling' },
    { name: 'Chart.js', desc: 'Data visualization library', category: 'Charts' },
    { name: 'React Router', desc: 'Client-side routing', category: 'Navigation' },
    { name: 'Framer Motion', desc: 'Animation library', category: 'Animation' },
    { name: 'Lucide React', desc: 'Modern icon set', category: 'Icons' },
    { name: 'Frankfurter API', desc: 'Live currency exchange rates', category: 'API' },
    { name: 'jsPDF', desc: 'PDF report generation', category: 'Export' },
    { name: 'localStorage', desc: 'Client-side data persistence', category: 'Storage' },
  ];

  // ES6 - JavaScript features used
  const es6Features = [
    'Arrow Functions (=>)',
    'Template Literals (`${}`)',
    'Destructuring Assignment',
    'Spread/Rest Operators (...)',
    'Modules (import/export)',
    'Promises & Async/Await',
    'Array Methods (map, filter, reduce)',
    'const & let (Block scoping)',
    'Default Parameters',
    'Object Shorthand Properties',
  ];

  return (
    <div className="container py-4">
      <div className="page-header">
        <h1><BookOpen size={28} style={{ color: 'var(--primary)', marginRight: 8 }} />About SpendWise</h1>
        <p>Smart Expense Tracker with Currency Converter</p>
      </div>

      {/* Project Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-static p-4 mb-4"
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h4 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              🎓 Micro Project - Web Technologies II
            </h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Many people earn money every month but find it difficult to track their expenses,
              manage their budget, and save money. <strong>SpendWise</strong> helps users record income
              and expenses, calculate the remaining balance, analyze spending through interactive
              charts, and convert currencies using live exchange rates.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Experiment No. 12 | Subject: Web Technologies-II
            </p>
          </div>
          <div className="col-lg-4 text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto"
              style={{
                width: 120, height: 120,
                background: 'var(--gradient-primary)',
                boxShadow: '0 8px 30px rgba(var(--primary-rgb), 0.3)',
              }}
            >
              <Wallet size={48} color="white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* SDG Mapping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-static p-4 mb-4"
      >
        <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          <Globe size={20} className="me-2" style={{ color: 'var(--primary)' }} />
          Mapped Sustainable Development Goals (SDGs)
        </h5>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="p-3 rounded-3" style={{ background: 'rgba(162, 25, 66, 0.05)', border: '1px solid rgba(162, 25, 66, 0.15)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="sdg-badge sdg-8">🎯 SDG 8</span>
              </div>
              <h6 className="fw-semibold" style={{ color: '#a21942' }}>Decent Work and Economic Growth</h6>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.7 }}>
                By helping individuals track income and manage budgets effectively, SpendWise promotes
                financial literacy and economic growth. Better financial management leads to improved
                economic stability and sustainable growth.
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-3 rounded-3" style={{ background: 'rgba(191, 139, 46, 0.05)', border: '1px solid rgba(191, 139, 46, 0.15)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="sdg-badge sdg-12">🌍 SDG 12</span>
              </div>
              <h6 className="fw-semibold" style={{ color: '#bf8b2e' }}>Responsible Consumption and Production</h6>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.7 }}>
                Expense tracking and visual analytics encourage mindful spending habits. Users can identify
                wasteful spending patterns and make informed decisions about their consumption,
                contributing to responsible resource usage.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card-static p-4 mb-4"
      >
        <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          <Lightbulb size={20} className="me-2" style={{ color: 'var(--warning)' }} />
          Key Features
        </h5>
        <div className="row g-3">
          {projectFeatures.map(({ icon: Icon, title, desc }, i) => (
            <div className="col-md-6" key={title}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="d-flex gap-3 p-3 rounded-3"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: 40, height: 40, background: 'rgba(var(--primary-rgb), 0.1)' }}
                >
                  <Icon size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h6 className="fw-semibold mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{title}</h6>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{desc}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="row g-4">
        {/* Tech Stack */}
        <div className="col-lg-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card-static p-4"
          >
            <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              <Code size={20} className="me-2" style={{ color: 'var(--primary)' }} />
              Technology Stack
            </h5>
            <div className="row g-2">
              {techStack.map(({ name, desc, category }, i) => (
                <div className="col-md-6" key={name}>
                  <div className="d-flex justify-content-between align-items-center p-2 rounded-2" style={{ background: 'var(--bg-tertiary)' }}>
                    <div>
                      <span className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{name}</span>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{desc}</div>
                    </div>
                    <span className="px-2 py-1 rounded-pill" style={{
                      background: 'rgba(var(--primary-rgb), 0.08)',
                      color: 'var(--primary)',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>
                      {category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ES6 Features */}
        <div className="col-lg-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card-static p-4"
          >
            <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              ⚡ ES6+ Features Used
            </h5>
            <ul className="list-unstyled mb-0">
              {es6Features.map((feature, i) => (
                <li key={i} className="d-flex align-items-center gap-2 mb-2">
                  <span className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: 24, height: 24, flexShrink: 0,
                      background: 'rgba(var(--primary-rgb), 0.1)',
                      color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
