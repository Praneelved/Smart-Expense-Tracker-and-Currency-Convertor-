// ES6 - Dashboard page with summary cards, recent transactions, and mini charts
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet, Target,
  ArrowRight, Plus, BarChart3
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, getMonthYearKey, formatMonthYear, formatDate, getRelativeTime } from '../utils/formatters';
import { getCategoryById, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/constants';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar';

const Dashboard = () => {
  const {
    transactions, currentMonthIncome, currentMonthExpenses,
    getCurrentBudget, getCurrentMonthTransactions
  } = useData();

  const currentMonthBalance = currentMonthIncome - currentMonthExpenses;
  const budget = getCurrentBudget();
  const budgetUsed = budget > 0 ? (currentMonthExpenses / budget) * 100 : 0;
  const currentMonth = formatMonthYear(getMonthYearKey());

  // ES6 - Get recent transactions (slice last 5)
  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [transactions]
  );

  // Current month expenses for pie chart
  const currentMonthExpensesList = getCurrentMonthTransactions('expense');

  // ES6 - Stat cards array with spread
  const statCards = [
    {
      label: 'Monthly Income',
      value: formatCurrency(currentMonthIncome),
      icon: TrendingUp,
      type: 'income',
      color: 'var(--success)',
      link: '/income',
    },
    {
      label: 'Monthly Expenses',
      value: formatCurrency(currentMonthExpenses),
      icon: TrendingDown,
      type: 'expense',
      color: 'var(--danger)',
      link: '/expenses',
    },
    {
      label: 'Balance',
      value: formatCurrency(currentMonthBalance),
      icon: Wallet,
      type: 'balance',
      color: 'var(--primary)',
      link: '/analytics',
    },
    {
      label: 'Budget Used',
      value: budget > 0 ? `${Math.min(budgetUsed, 100).toFixed(0)}%` : 'Not Set',
      icon: Target,
      type: 'budget',
      color: budgetUsed > 100 ? 'var(--danger)' : budgetUsed > 80 ? 'var(--warning)' : 'var(--success)',
      link: '/budget',
    },
  ];

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="page-header">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1>Dashboard</h1>
            <p className="mb-0">{currentMonth} Overview</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/income" className="btn-gradient d-inline-flex align-items-center gap-2" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              <Plus size={16} /> Add Income
            </Link>
            <Link to="/expenses" className="btn-outline-primary-custom d-inline-flex align-items-center gap-2" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              <Plus size={16} /> Add Expense
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map(({ label, value, icon: Icon, type, color, link }, index) => (
          <div className="col-6 col-lg-3" key={type}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={link} className="text-decoration-none">
                <div className={`stat-card ${type}`}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
                      {label}
                    </span>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <h4 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}>
                    {value}
                  </h4>
                </div>
              </Link>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Budget Alert */}
      {budget > 0 && budgetUsed >= 80 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-card-static p-3 mb-4 d-flex align-items-center gap-3`}
          style={{
            borderLeft: `4px solid ${budgetUsed >= 100 ? 'var(--danger)' : 'var(--warning)'}`,
          }}
        >
          <Target size={20} style={{ color: budgetUsed >= 100 ? 'var(--danger)' : 'var(--warning)' }} />
          <div>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              {budgetUsed >= 100 ? '⚠️ Budget Exceeded!' : '⚡ Budget Alert'}
            </strong>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              {`You've used ${budgetUsed.toFixed(0)}% of your ₹${budget.toLocaleString('en-IN')} monthly budget.`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card-static p-3 h-100"
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0" style={{ color: 'var(--text-primary)' }}>
                Expense Breakdown
              </h6>
              <Link to="/analytics" style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none' }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <ExpensePieChart expenses={currentMonthExpensesList} />
          </motion.div>
        </div>
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card-static p-3 h-100"
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0" style={{ color: 'var(--text-primary)' }}>
                Income vs Expenses
              </h6>
              <Link to="/analytics" style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none' }}>
                Details <ArrowRight size={14} />
              </Link>
            </div>
            <IncomeExpenseBar transactions={transactions} />
          </motion.div>
        </div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card-static p-3"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0" style={{ color: 'var(--text-primary)' }}>
            Recent Transactions
          </h6>
          <Link to="/expenses" style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none' }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="empty-state py-4">
            <div className="empty-state-icon mx-auto mb-3">
              <BarChart3 size={32} />
            </div>
            <p style={{ margin: 0 }}>No transactions yet. Start by adding your income or expenses!</p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Link to="/income" className="btn-gradient" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Add Income</Link>
              <Link to="/expenses" className="btn-outline-primary-custom" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>Add Expense</Link>
            </div>
          </div>
        ) : (
          <div>
            {recentTransactions.map((txn) => {
              const categories = txn.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
              const category = getCategoryById(categories, txn.category);
              const isIncome = txn.type === 'income';

              return (
                <div key={txn.id} className="transaction-item">
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
                        {txn.note || 'No note'} • {getRelativeTime(txn.date)}
                      </div>
                    </div>
                  </div>
                  <span
                    className="fw-bold"
                    style={{ color: isIncome ? 'var(--success)' : 'var(--danger)', fontSize: '0.95rem' }}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
