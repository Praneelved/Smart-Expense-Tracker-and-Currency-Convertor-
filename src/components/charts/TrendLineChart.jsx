// ES6 - Line chart showing spending trends over time
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Tooltip, Legend, Filler
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const TrendLineChart = ({ transactions = [], days = 30 }) => {
  const { isDark } = useTheme();

  // ES6 - Generate date labels for last N days
  const now = new Date();
  const dateLabels = Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });

  // ES6 - Aggregate daily spending using reduce
  const dailyExpenses = dateLabels.map(date => {
    return transactions
      .filter(t => t.type === 'expense' && t.date === date)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const dailyIncome = dateLabels.map(date => {
    return transactions
      .filter(t => t.type === 'income' && t.date === date)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const data = {
    labels: dateLabels.map(d => {
      const date = new Date(d);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: 'Expenses',
        data: dailyExpenses,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#ef4444',
        borderWidth: 2.5,
      },
      {
        label: 'Income',
        data: dailyIncome,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#10b981',
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { family: 'Inter', size: 10 },
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: { color: isDark ? 'rgba(100,116,139,0.1)' : 'rgba(148,163,184,0.15)' },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { family: 'Inter', size: 11 },
          callback: (val) => `₹${val.toLocaleString('en-IN')}`,
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
      },
    },
  };

  return (
    <div style={{ height: 320 }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default TrendLineChart;
