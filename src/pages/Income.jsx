// ES6 - Income page with add form, search, filters, edit/delete CRUD
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  TrendingUp, Plus, Search, Edit2, Trash2, X, Filter, Calendar
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { INCOME_CATEGORIES, getCategoryById } from '../utils/constants';
import { formatCurrency, formatDate, formatDateISO } from '../utils/formatters';

const Income = () => {
  const { incomeTransactions, addTransaction, updateTransaction, deleteTransaction } = useData();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'salary',
    date: formatDateISO(),
    note: '',
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // ES6 - Destructuring + arrow function for form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ amount: '', category: 'salary', date: formatDateISO(), note: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!formData.date) {
      toast.error('Please select a date');
      return;
    }

    if (editingId) {
      updateTransaction(editingId, { ...formData, type: 'income' });
      toast.success('Income updated successfully! ✏️');
    } else {
      addTransaction({ ...formData, type: 'income' });
      toast.success('Income added successfully! 💰');
    }
    resetForm();
  };

  const handleEdit = (txn) => {
    setFormData({
      amount: txn.amount.toString(),
      category: txn.category,
      date: txn.date,
      note: txn.note || '',
    });
    setEditingId(txn.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      deleteTransaction(id);
      toast.success('Income deleted 🗑️');
    }
  };

  // ES6 - Filtering with filter + includes (case-insensitive)
  const filteredTransactions = useMemo(() => {
    return incomeTransactions
      .filter(t => {
        const matchesSearch = searchTerm === '' ||
          (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
          getCategoryById(INCOME_CATEGORIES, t.category).label.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomeTransactions, searchTerm, filterCategory]);

  // ES6 - Reduce to get total
  const totalFiltered = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="container py-4">
      <div className="page-header">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1><TrendingUp size={28} style={{ color: 'var(--success)', marginRight: 8 }} />Income</h1>
            <p className="mb-0">Manage your income sources</p>
          </div>
          <button
            className="btn-gradient d-inline-flex align-items-center gap-2"
            onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }}
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Add Income'}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="glass-card-static p-4 mb-4">
              <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {editingId ? '✏️ Edit Income' : '💰 Add New Income'}
              </h6>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label-custom">Amount (₹)</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="form-control form-control-custom"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select form-select-custom"
                    >
                      {INCOME_CATEGORIES.map(({ id, label, icon }) => (
                        <option key={id} value={id}>{icon} {label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="form-control form-control-custom"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Note (optional)</label>
                    <input
                      type="text"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      className="form-control form-control-custom"
                      placeholder="Add a note"
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn-gradient" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                    {editingId ? 'Update Income' : 'Add Income'}
                  </button>
                  <button type="button" className="btn-outline-primary-custom" onClick={resetForm} style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="glass-card-static p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control form-control-custom"
                placeholder="Search income entries..."
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>
          <div className="col-md-7">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <button
                className={`filter-pill ${filterCategory === 'all' ? 'active' : ''}`}
                onClick={() => setFilterCategory('all')}
              >
                All
              </button>
              {INCOME_CATEGORIES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  className={`filter-pill ${filterCategory === id ? 'active' : ''}`}
                  onClick={() => setFilterCategory(id)}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {filteredTransactions.length} entries found
        </span>
        <span className="fw-bold" style={{ color: 'var(--success)' }}>
          Total: {formatCurrency(totalFiltered)}
        </span>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="glass-card-static">
          <div className="empty-state">
            <div className="empty-state-icon mx-auto mb-3">
              <TrendingUp size={32} />
            </div>
            <h6 style={{ color: 'var(--text-primary)' }}>No income entries yet</h6>
            <p>Start tracking your income by clicking "Add Income" above</p>
          </div>
        </div>
      ) : (
        <div>
          {filteredTransactions.map((txn, index) => {
            const category = getCategoryById(INCOME_CATEGORIES, txn.category);
            return (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="transaction-item"
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: 42, height: 42,
                      background: `${category.color}15`,
                      fontSize: '1.2rem',
                      flexShrink: 0,
                    }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <div className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {category.label}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {txn.note ? `${txn.note} • ` : ''}{formatDate(txn.date)}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold" style={{ color: 'var(--success)', fontSize: '0.95rem' }}>
                    +{formatCurrency(txn.amount)}
                  </span>
                  <div className="d-flex gap-1">
                    <button
                      onClick={() => handleEdit(txn)}
                      className="btn btn-sm p-1 rounded-2"
                      style={{ color: 'var(--primary)', background: 'rgba(var(--primary-rgb), 0.08)', border: 'none' }}
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(txn.id)}
                      className="btn btn-sm p-1 rounded-2"
                      style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.08)', border: 'none' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Income;
