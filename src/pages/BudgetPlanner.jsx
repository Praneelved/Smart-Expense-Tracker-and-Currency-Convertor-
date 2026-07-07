// ES6 - Budget Planner with monthly budget setting, progress tracking, and alerts
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Target, AlertTriangle, CheckCircle, DollarSign, TrendingDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import { EXPENSE_CATEGORIES, getCategoryById, MONTHS } from '../utils/constants';
import { formatCurrency, getMonthYearKey, formatMonthYear } from '../utils/formatters';

const BudgetPlanner = () => {
  const { setBudget, budgets, transactions, currentMonthExpenses, getCurrentBudget } = useData();

  const currentKey = getMonthYearKey();
  const currentBudget = getCurrentBudget();

  const [budgetInput, setBudgetInput] = useState(currentBudget > 0 ? currentBudget.toString() : '');
  const [selectedMonth, setSelectedMonth] = useState(currentKey);

  // ES6 - Budget for selected month
  const selectedBudget = budgets[selectedMonth] || 0;

  // Expenses for selected month
  const selectedMonthExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && getMonthYearKey(t.date) === selectedMonth)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, selectedMonth]);

  const budgetUsedPercent = selectedBudget > 0 ? (selectedMonthExpenses / selectedBudget) * 100 : 0;
  const remaining = selectedBudget - selectedMonthExpenses;

  // Get budget status
  const getBudgetStatus = (percent) => {
    if (percent >= 100) return { label: 'Exceeded', color: 'var(--danger)', icon: AlertTriangle, bg: 'rgba(239,68,68,0.1)' };
    if (percent >= 80) return { label: 'Warning', color: 'var(--warning)', icon: AlertTriangle, bg: 'rgba(245,158,11,0.1)' };
    return { label: 'On Track', color: 'var(--success)', icon: CheckCircle, bg: 'rgba(16,185,129,0.1)' };
  };

  const status = getBudgetStatus(budgetUsedPercent);

  // Category-wise spending for current month
  const categorySpending = useMemo(() => {
    const expenses = transactions.filter(
      t => t.type === 'expense' && getMonthYearKey(t.date) === selectedMonth
    );
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([id, total]) => ({
        ...getCategoryById(EXPENSE_CATEGORIES, id),
        total,
        percentage: selectedMonthExpenses > 0 ? ((total / selectedMonthExpenses) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions, selectedMonth, selectedMonthExpenses]);

  const handleSetBudget = (e) => {
    e.preventDefault();
    const amount = parseFloat(budgetInput);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid budget amount');
      return;
    }
    setBudget(selectedMonth, amount);
    toast.success(`Budget set to ${formatCurrency(amount)} for ${formatMonthYear(selectedMonth)} ✅`);
  };

  // ES6 - Generate month options for last 12 months using Array.from
  const monthOptions = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = getMonthYearKey(d);
      return { key, label: formatMonthYear(key) };
    });
  }, []);

  return (
    <div className="container py-4">
      <div className="page-header">
        <h1><Target size={28} style={{ color: 'var(--warning)', marginRight: 8 }} />Budget Planner</h1>
        <p>Set and track your monthly spending limits</p>
      </div>

      <div className="row g-4">
        {/* Set Budget Form */}
        <div className="col-lg-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card-static p-4 mb-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              💰 Set Monthly Budget
            </h6>
            <form onSubmit={handleSetBudget}>
              <div className="mb-3">
                <label className="form-label-custom">Select Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setBudgetInput((budgets[e.target.value] || '').toString());
                  }}
                  className="form-select form-select-custom"
                >
                  {monthOptions.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label-custom">Budget Amount (₹)</label>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="form-control form-control-custom"
                  placeholder="Enter monthly budget"
                  min="0"
                  step="100"
                />
              </div>
              <button type="submit" className="btn-gradient w-100">
                {selectedBudget > 0 ? 'Update Budget' : 'Set Budget'}
              </button>
            </form>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card-static p-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              💡 Budgeting Tips
            </h6>
            <ul className="list-unstyled mb-0">
              {[
                'Follow the 50/30/20 rule: Needs/Wants/Savings',
                'Track every expense, no matter how small',
                'Review your budget weekly for better control',
                'Set realistic goals you can actually follow',
                'Build an emergency fund of 3-6 months expenses',
              ].map((tip, i) => (
                <li key={i} className="d-flex gap-2 mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--primary)' }}>•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Budget Overview */}
        <div className="col-lg-7">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-static p-4 mb-4"
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0" style={{ color: 'var(--text-primary)' }}>
                📊 {formatMonthYear(selectedMonth)} Overview
              </h6>
              {selectedBudget > 0 && (
                <span
                  className="d-flex align-items-center gap-1 px-3 py-1 rounded-pill fw-semibold"
                  style={{ background: status.bg, color: status.color, fontSize: '0.8rem' }}
                >
                  <status.icon size={14} />
                  {status.label}
                </span>
              )}
            </div>

            {selectedBudget > 0 ? (
              <>
                {/* Progress */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {formatCurrency(selectedMonthExpenses)} spent of {formatCurrency(selectedBudget)}
                    </span>
                    <span className="fw-bold" style={{ color: status.color, fontSize: '0.85rem' }}>
                      {Math.min(budgetUsedPercent, 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="budget-progress" style={{ height: 14 }}>
                    <motion.div
                      className="budget-progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{
                        background: budgetUsedPercent >= 100
                          ? 'var(--gradient-danger)'
                          : budgetUsedPercent >= 80
                          ? 'var(--gradient-warning)'
                          : 'var(--gradient-success)',
                      }}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="row g-3 mb-4">
                  <div className="col-4">
                    <div className="text-center p-2 rounded-3" style={{ background: 'var(--bg-tertiary)' }}>
                      <DollarSign size={18} style={{ color: 'var(--primary)' }} />
                      <div className="fw-bold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {formatCurrency(selectedBudget)}
                      </div>
                      <small style={{ color: 'var(--text-muted)' }}>Budget</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center p-2 rounded-3" style={{ background: 'var(--bg-tertiary)' }}>
                      <TrendingDown size={18} style={{ color: 'var(--danger)' }} />
                      <div className="fw-bold mt-1" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {formatCurrency(selectedMonthExpenses)}
                      </div>
                      <small style={{ color: 'var(--text-muted)' }}>Spent</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center p-2 rounded-3" style={{ background: 'var(--bg-tertiary)' }}>
                      <Target size={18} style={{ color: remaining >= 0 ? 'var(--success)' : 'var(--danger)' }} />
                      <div className="fw-bold mt-1" style={{ color: remaining >= 0 ? 'var(--success)' : 'var(--danger)', fontSize: '0.95rem' }}>
                        {formatCurrency(Math.abs(remaining))}
                      </div>
                      <small style={{ color: 'var(--text-muted)' }}>{remaining >= 0 ? 'Remaining' : 'Over'}</small>
                    </div>
                  </div>
                </div>

                {/* Alert */}
                {budgetUsedPercent >= 80 && (
                  <div
                    className="d-flex align-items-center gap-2 p-3 rounded-3 mb-3"
                    style={{
                      background: budgetUsedPercent >= 100 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                      border: `1px solid ${budgetUsedPercent >= 100 ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                    }}
                  >
                    <AlertTriangle size={18} style={{ color: budgetUsedPercent >= 100 ? 'var(--danger)' : 'var(--warning)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {budgetUsedPercent >= 100
                        ? `You've exceeded your budget by ${formatCurrency(Math.abs(remaining))}!`
                        : `You've used ${budgetUsedPercent.toFixed(0)}% of your budget. Consider slowing down.`}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state py-4">
                <div className="empty-state-icon mx-auto mb-3">
                  <Target size={32} />
                </div>
                <h6 style={{ color: 'var(--text-primary)' }}>No budget set</h6>
                <p>Set a budget for this month to start tracking</p>
              </div>
            )}
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card-static p-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              📋 Category Breakdown
            </h6>
            {categorySpending.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                No expenses recorded for this month
              </p>
            ) : (
              categorySpending.map((cat, i) => (
                <div key={cat.id} className="d-flex align-items-center gap-3 mb-3">
                  <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>{cat.label}</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{formatCurrency(cat.total)}</span>
                    </div>
                    <div className="budget-progress" style={{ height: 6 }}>
                      <motion.div
                        className="budget-progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        style={{ background: cat.color }}
                      />
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', width: 40, textAlign: 'right' }}>
                    {cat.percentage}%
                  </span>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
