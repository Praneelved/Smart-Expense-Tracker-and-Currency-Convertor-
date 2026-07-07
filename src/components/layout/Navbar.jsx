// ES6 - Responsive Navbar with glassmorphism, theme toggle, and animated mobile menu
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  Home, LayoutDashboard, TrendingUp, TrendingDown,
  BarChart3, Target, ArrowLeftRight, FileText,
  User, Info, Mail, Sun, Moon, Menu, X, Wallet
} from 'lucide-react';

// ES6 - Navigation items array with destructuring
const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/income', label: 'Income', icon: TrendingUp },
  { path: '/expenses', label: 'Expenses', icon: TrendingDown },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/budget', label: 'Budget', icon: Target },
  { path: '/converter', label: 'Converter', icon: ArrowLeftRight },
  { path: '/reports', label: 'Reports', icon: FileText },
];

const secondaryNavItems = [
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Mail },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  // ES6 - Arrow function
  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="glass-navbar sticky-top" style={{ zIndex: 1050 }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-2">
          {/* Brand */}
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2" onClick={closeMenu}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Wallet size={20} color="white" />
            </div>
            <span className="fw-bold fs-5 gradient-text">SpendWise</span>
          </Link>

          {/* Desktop Nav */}
          <div className="d-none d-lg-flex align-items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-decoration-none px-3 py-2 rounded-3 d-flex align-items-center gap-1 ${
                    isActive
                      ? 'fw-semibold'
                      : ''
                  }`
                }
                style={({ isActive }) => ({
                  fontSize: '0.85rem',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                })}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="d-flex align-items-center gap-2">
            {/* Theme Toggle */}
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Desktop secondary links */}
            <div className="d-none d-lg-flex align-items-center gap-1">
              {secondaryNavItems.map(({ path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className="text-decoration-none p-2 rounded-3 d-flex align-items-center"
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    background: isActive ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
                    transition: 'all 0.2s ease',
                  })}
                >
                  <Icon size={18} />
                </NavLink>
              ))}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="d-lg-none theme-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
              className="d-lg-none"
            >
              <div className="py-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                {[...navItems, ...secondaryNavItems].map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={closeMenu}
                    className="text-decoration-none d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1"
                    style={({ isActive }) => ({
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(var(--primary-rgb), 0.08)' : 'transparent',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.95rem',
                    })}
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
