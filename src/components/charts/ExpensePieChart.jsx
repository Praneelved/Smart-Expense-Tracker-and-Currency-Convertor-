// ES6 - Doughnut chart for expense category breakdown
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import { EXPENSE_CATEGORIES, getCategoryById } from '../../utils/constants';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ expenses = [] }) => {
  const { isDark } = useTheme();

  // ES6 - reduce to group expenses by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  // ES6 - Object.entries + map + destructuring
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([id, total]) => {
      const cat = getCategoryById(EXPENSE_CATEGORIES, id);
      return { ...cat, total };
    });

  const data = {
    labels: sortedCategories.map(c => c.label),
    datasets: [{
      data: sortedCategories.map(c => c.total),
      backgroundColor: sortedCategories.map(c => c.color),
      borderColor: isDark ? '#1e293b' : '#ffffff',
      borderWidth: 3,
      hoverBorderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#cbd5e1' : '#475569',
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
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
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return ` ₹${context.parsed.toLocaleString('en-IN')} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (sortedCategories.length === 0) {
    return (
      <div className="empty-state py-4">
        <p style={{ color: 'var(--text-muted)' }}>No expense data to display</p>
      </div>
    );
  }

  return (
    <div style={{ height: 320 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ExpensePieChart;
