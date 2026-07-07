// ES6 - Main App component with React Router and Context Providers
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';

// ES6 - Dynamic page imports
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import BudgetPlanner from './pages/BudgetPlanner';
import CurrencyConverter from './pages/CurrencyConverter';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';

const App = () => {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <Layout>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/budget" element={<BudgetPlanner />} />
                <Route path="/converter" element={<CurrencyConverter />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </AnimatePresence>
          </Layout>
        </Router>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#ffffff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            },
          }}
        />
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
