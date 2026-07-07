// ES6 - Analytics page with multiple interactive charts and spending insights
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { EXPENSE_CATEGORIES, getCategoryById } from '../utils/constants';
import { formatCurrency, getMonthYearKey, formatMonthYear } from '../utils/formatters';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar';
import TrendLineChart from '../components/charts/TrendLineChart';

const Analytics = () => {
  const { transactions, totalIncome, totalExpenses, balance } = useData();
  const [timeRange, setTimeRange] = useState('month'); // month, all

  // ES6 - Filter transactions by time range
  const filteredTransactions = useMemo(() => {
    if (timeRange === 'all') return transactions;
    const currentKey = getMonthYearKey();
    return transactions.filter(t => getMonthYearKey(t.date) === currentKey);
  }, [transactions, timeRange]);

  const periodExpenses = filteredTransactions.filter(t => t.type === 'expense');
  const periodIncome = filteredTransactions.filter(t => t.type === 'income');
  const periodTotalExpenses = periodExpenses.reduce((s, t) => s + t.amount, 0);
  const periodTotalIncome = periodIncome.reduce((s, t) => s + t.amount, 0);

  // ES6 - Top spending categories using reduce + sort
  const topCategories = useMemo(() => {
    const grouped = periodExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([id, total]) => ({
        ...getCategoryById(EXPENSE_CATEGORIES, id),
        total,
        percentage: periodTotalExpenses > 0 ? ((total / periodTotalExpenses) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [periodExpenses, periodTotalExpenses]);

  // Average daily spending
  const avgDailySpending = useMemo(() => {
    if (periodExpenses.length === 0) return 0;
    const uniqueDays = new Set(periodExpenses.map(t => t.date)).size;
    return periodTotalExpenses / Math.max(uniqueDays, 1);
  }, [periodExpenses, periodTotalExpenses]);

  const savingsRate = periodTotalIncome > 0
    ? (((periodTotalIncome - periodTotalExpenses) / periodTotalIncome) * 100).toFixed(1)
    : 0;

  return (
    <div className="container py-4">
      <div className="page-header">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1><BarChart3 size={28} style={{ color: 'var(--primary)', marginRight: 8 }} />Analytics</h1>
            <p className="mb-0">Visualize your spending patterns</p>
          </div>
          <div className="d-flex gap-2">
            <button
              className={`filter-pill ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              <Calendar size={14} /> This Month
            </button>
            <button
              className={`filter-pill ${timeRange === 'all' ? 'active' : ''}`}
              onClick={() => setTimeRange('all')}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Income', value: formatCurrency(periodTotalIncome), color: 'var(--success)', icon: ArrowUpRight, type: 'income' },
          { label: 'Total Expenses', value: formatCurrency(periodTotalExpenses), color: 'var(--danger)', icon: ArrowDownRight, type: 'expense' },
          { label: 'Avg Daily Spend', value: formatCurrency(avgDailySpending), color: 'var(--warning)', icon: TrendingUp, type: 'budget' },
          { label: 'Savings Rate', value: `${savingsRate}%`, color: parseFloat(savingsRate) >= 0 ? 'var(--success)' : 'var(--danger)', icon: PieChart, type: 'balance' },
        ].map(({ label, value, color, icon: Icon, type }, i) => (
          <div className="col-6 col-lg-3" key={label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`stat-card ${type}`}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{label}</span>
                <Icon size={18} style={{ color }} />
              </div>
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: 'clamp(0.9rem, 2vw, 1.2rem)' }}>{value}</h5>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card-static p-3 h-100"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              <PieChart size={18} className="me-2" style={{ color: 'var(--primary)' }} />
              Expense Breakdown
            </h6>
            <ExpensePieChart expenses={periodExpenses} />
          </motion.div>
        </div>
        <div className="col-lg-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card-static p-3 h-100"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              <BarChart3 size={18} className="me-2" style={{ color: 'var(--primary)' }} />
              Income vs Expenses (6 Months)
            </h6>
            <IncomeExpenseBar transactions={transactions} />
          </motion.div>
        </div>
      </div>

      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card-static p-3 mb-4"
      >
        <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          <TrendingUp size={18} className="me-2" style={{ color: 'var(--primary)' }} />
          Spending Trend (Last 30 Days)
        </h6>
        <TrendLineChart transactions={transactions} days={30} />
      </motion.div>

      {/* Top Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card-static p-3"
      >
        <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Top Spending Categories
        </h6>
        {topCategories.length === 0 ? (
          <div className="empty-state py-3">
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>No expense data available</p>
          </div>
        ) : (
          topCategories.map((cat, i) => (
            <div key={cat.id} className="d-flex align-items-center gap-3 mb-3">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: 20, textAlign: 'center', fontWeight: 600 }}>
                {i + 1}
              </span>
              <div
                className="d-flex align-items-center justify-content-center rounded-3"
                style={{ width: 36, height: 36, background: `${cat.color}15`, fontSize: '1rem', flexShrink: 0 }}
              >
                {cat.icon}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between mb-1">
                  <span className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{cat.label}</span>
                  <span className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{formatCurrency(cat.total)}</span>
                </div>
                <div className="budget-progress">
                  <motion.div
                    className="budget-progress-bar"
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percentage}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ background: cat.color }}
                  />
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: 45, textAlign: 'right' }}>
                {cat.percentage}%
              </span>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
