// ES6 - Reports page with date filter, transaction table preview, PDF and CSV export
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FileText, Download, FileSpreadsheet, Calendar, Filter, Search
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { getCategoryById, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';
import { formatCurrency, formatDate, formatDateISO } from '../utils/formatters';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';

const Reports = () => {
  const { transactions } = useData();

  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return formatDateISO(d);
  });
  const [dateTo, setDateTo] = useState(formatDateISO());
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ES6 - Filter transactions by date range, type, and search
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const inDateRange = t.date >= dateFrom && t.date <= dateTo;
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesSearch = searchTerm === '' ||
          (t.note && t.note.toLowerCase().includes(searchTerm.toLowerCase()));
        return inDateRange && matchesType && matchesSearch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, dateFrom, dateTo, typeFilter, searchTerm]);

  // ES6 - Reduce for summary stats
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense, count: filteredTransactions.length };
  }, [filteredTransactions]);

  // ES6 - Arrow functions for export handlers
  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }
    const dateRange = `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;
    exportToPDF(filteredTransactions, { title: 'Transaction Report', dateRange });
    toast.success('PDF exported successfully! 📄');
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }
    exportToCSV(filteredTransactions);
    toast.success('CSV exported successfully! 📊');
  };

  return (
    <div className="container py-4">
      <div className="page-header">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1><FileText size={28} style={{ color: 'var(--primary)', marginRight: 8 }} />Reports</h1>
            <p className="mb-0">Generate and export financial reports</p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={handleExportPDF}
              className="btn-gradient d-inline-flex align-items-center gap-2"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <Download size={16} /> Export PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="btn-outline-primary-custom d-inline-flex align-items-center gap-2"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <FileSpreadsheet size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-static p-4 mb-4"
      >
        <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          <Filter size={16} className="me-2" />
          Filter Options
        </h6>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label-custom"><Calendar size={14} className="me-1" /> From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="form-control form-control-custom"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label-custom"><Calendar size={14} className="me-1" /> To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="form-control form-control-custom"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label-custom">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-select form-select-custom"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label-custom"><Search size={14} className="me-1" /> Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control form-control-custom"
              placeholder="Search notes..."
            />
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Income', value: formatCurrency(summary.income), type: 'income', color: 'var(--success)' },
          { label: 'Expenses', value: formatCurrency(summary.expense), type: 'expense', color: 'var(--danger)' },
          { label: 'Net Balance', value: formatCurrency(summary.balance), type: 'balance', color: 'var(--primary)' },
          { label: 'Transactions', value: summary.count, type: 'budget', color: 'var(--warning)' },
        ].map(({ label, value, type, color }, i) => (
          <div className="col-6 col-lg-3" key={label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`stat-card ${type}`}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{label}</span>
              <h5 className="fw-bold mb-0 mt-1" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                {value}
              </h5>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-static p-3"
      >
        <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          📋 Transaction Preview ({filteredTransactions.length} records)
        </h6>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state py-4">
            <div className="empty-state-icon mx-auto mb-3">
              <FileText size={32} />
            </div>
            <h6 style={{ color: 'var(--text-primary)' }}>No transactions found</h6>
            <p>Try adjusting your date range or filters</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless mb-0" style={{ color: 'var(--text-primary)' }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ fontWeight: 600, border: 'none', padding: '10px 12px' }}>Date</th>
                  <th style={{ fontWeight: 600, border: 'none', padding: '10px 12px' }}>Type</th>
                  <th style={{ fontWeight: 600, border: 'none', padding: '10px 12px' }}>Category</th>
                  <th style={{ fontWeight: 600, border: 'none', padding: '10px 12px' }}>Note</th>
                  <th style={{ fontWeight: 600, border: 'none', padding: '10px 12px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 50).map((txn) => {
                  const categories = txn.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
                  const category = getCategoryById(categories, txn.category);
                  const isIncome = txn.type === 'income';

                  return (
                    <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ fontSize: '0.85rem', padding: '12px', border: 'none' }}>
                        {formatDate(txn.date)}
                      </td>
                      <td style={{ border: 'none', padding: '12px' }}>
                        <span
                          className="px-2 py-1 rounded-pill fw-medium"
                          style={{
                            fontSize: '0.7rem',
                            background: isIncome ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: isIncome ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {isIncome ? 'INCOME' : 'EXPENSE'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', border: 'none', padding: '12px' }}>
                        {category.icon} {category.label}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', border: 'none', padding: '12px' }}>
                        {txn.note || '-'}
                      </td>
                      <td style={{
                        fontSize: '0.9rem', fontWeight: 600, textAlign: 'right', border: 'none', padding: '12px',
                        color: isIncome ? 'var(--success)' : 'var(--danger)',
                      }}>
                        {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredTransactions.length > 50 && (
              <p className="text-center mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Showing 50 of {filteredTransactions.length} transactions. Export for full report.
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Reports;
