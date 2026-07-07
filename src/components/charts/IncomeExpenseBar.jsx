// ES6 - Bar chart comparing income vs expenses monthly
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import { MONTHS } from '../../utils/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const IncomeExpenseBar = ({ transactions = [] }) => {
  const { isDark } = useTheme();

  // ES6 - Get last 6 months of data using Array.from + map
  const now = new Date();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: MONTHS[d.getMonth()].slice(0, 3),
    };
  });

  // ES6 - Reduce transactions into monthly buckets
  const monthlyData = last6Months.map(({ key, label }) => {
    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      const tKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return tKey === key;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { label, income, expense };
  });

  const data = {
    labels: monthlyData.map(d => d.label),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(d => d.income),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Expenses',
        data: monthlyData.map(d => d.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { family: 'Inter', size: 12 },
        },
      },
      y: {
        grid: { color: isDark ? 'rgba(100,116,139,0.1)' : 'rgba(148,163,184,0.15)' },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { family: 'Inter', size: 11 },
          callback: (val) => val >= 1000 ? `₹${(val / 1000).toFixed(0)}K` : `₹${val}`,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#cbd5e1' : '#475569',
          padding: 20,
          usePointStyle: true,
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#0f172a',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString('en-IN')}`,
        },
      },
    },
  };

  return (
    <div style={{ height: 320 }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default IncomeExpenseBar;
