// ES6 - Profile page with user settings and data management
import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Save, Trash2, Download, Upload, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';
import { CURRENCIES } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const Profile = () => {
  const { profile, updateProfile, transactions, totalIncome, totalExpenses, balance } = useData();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [currency, setCurrency] = useState(profile.currency);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    updateProfile({ name: name.trim(), email: email.trim(), currency });
    toast.success('Profile updated! ✅');
  };

  // ES6 - Export data as JSON backup
  const handleExportData = () => {
    const data = localStorage.getItem('spendwise-data');
    if (!data) {
      toast.error('No data to export');
      return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spendwise_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported! 💾');
  };

  // ES6 - Import data from JSON backup
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.transactions && data.profile) {
          localStorage.setItem('spendwise-data', JSON.stringify(data));
          toast.success('Data imported! Refreshing...');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          toast.error('Invalid backup file format');
        }
      } catch {
        toast.error('Failed to parse backup file');
      }
    };
    reader.readAsText(file);
  };

  // ES6 - Clear all data
  const handleClearData = () => {
    if (window.confirm('⚠️ Are you sure? This will delete ALL your data permanently!')) {
      if (window.confirm('This action cannot be undone. Continue?')) {
        localStorage.removeItem('spendwise-data');
        toast.success('All data cleared. Refreshing...');
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="page-header">
        <h1><User size={28} style={{ color: 'var(--primary)', marginRight: 8 }} />Profile</h1>
        <p>Manage your account settings and data</p>
      </div>

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card-static p-4 text-center mb-4"
          >
            <div className="profile-avatar mx-auto mb-3">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{profile.name}</h5>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {profile.email || 'No email set'}
            </p>

            <div className="d-flex justify-content-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="text-center">
                <div className="fw-bold" style={{ color: 'var(--success)', fontSize: '1.1rem' }}>
                  {formatCurrency(totalIncome)}
                </div>
                <small style={{ color: 'var(--text-muted)' }}>Total Income</small>
              </div>
              <div className="text-center">
                <div className="fw-bold" style={{ color: 'var(--danger)', fontSize: '1.1rem' }}>
                  {formatCurrency(totalExpenses)}
                </div>
                <small style={{ color: 'var(--text-muted)' }}>Total Spent</small>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-static p-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📊 Quick Stats</h6>
            {[
              { label: 'Total Transactions', value: transactions.length },
              { label: 'Net Balance', value: formatCurrency(balance) },
              { label: 'Preferred Currency', value: profile.currency },
            ].map(({ label, value }) => (
              <div key={label} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
                <span className="fw-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Settings */}
        <div className="col-lg-8">
          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card-static p-4 mb-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              ✏️ Edit Profile
            </h6>
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control form-control-custom"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control form-control-custom"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Default Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="form-select form-select-custom"
                  >
                    {CURRENCIES.map(({ code, name, flag }) => (
                      <option key={code} value={code}>{flag} {code} - {name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-gradient mt-3 d-inline-flex align-items-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </form>
          </motion.div>

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-static p-4 mb-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              <Shield size={16} className="me-2" />
              Data Management
            </h6>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Your data is stored locally in your browser. Export a backup to keep it safe.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={handleExportData}
                className="btn-outline-primary-custom d-inline-flex align-items-center gap-2"
                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              >
                <Download size={16} /> Export Backup
              </button>
              <label
                className="btn-outline-primary-custom d-inline-flex align-items-center gap-2"
                style={{ fontSize: '0.85rem', padding: '8px 16px', cursor: 'pointer' }}
              >
                <Upload size={16} /> Import Backup
                <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
              </label>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card-static p-4"
            style={{ borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <h6 className="fw-semibold mb-2" style={{ color: 'var(--danger)' }}>
              ⚠️ Danger Zone
            </h6>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              This action is irreversible. All your transactions, budgets, and settings will be permanently deleted.
            </p>
            <button
              onClick={handleClearData}
              className="d-inline-flex align-items-center gap-2"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: 'var(--danger)',
                border: '1.5px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 16px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Trash2 size={16} /> Clear All Data
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
