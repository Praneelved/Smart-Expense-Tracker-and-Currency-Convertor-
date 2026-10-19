/**
 * SpendWise Analytics Page Controller
 */

import { store } from './store.js';
import { FinancialAnalytics } from './analytics.js';
import { UI } from './ui.js';
import { CATEGORIES } from './constants.js';

let catChart = null;
let budgetBarChart = null;
let cashflowChart = null;
let paymentChart = null;

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  initAnalytics();

  document.getElementById('analyticsPeriod').addEventListener('change', () => {
    renderAnalytics();
  });

  store.subscribe(() => {
    renderAnalytics();
  });
});

function initAnalytics() {
  renderAnalytics();
}

function renderAnalytics() {
  const period = document.getElementById('analyticsPeriod').value;
  const allExpenses = store.getExpenses();
  const salary = store.getSalary();
  const monthlyBudget = store.getMonthlyBudget();
  const categoryBudgets = store.getCategoryBudgets();

  const periodExpenses = FinancialAnalytics.filterByPeriod(allExpenses, period);
  const totalSpent = FinancialAnalytics.getTotalSpent(periodExpenses);
  const velocity = FinancialAnalytics.getSpendingVelocity(allExpenses, salary, monthlyBudget);
  const breakdown = FinancialAnalytics.getCategoryBreakdown(periodExpenses);

  // 1. Metric Stat Cards
  const statDailyBurn = document.getElementById('statDailyBurn');
  const statProjectedSpend = document.getElementById('statProjectedSpend');
  const statProjectedMeta = document.getElementById('statProjectedMeta');
  const statMaxSingleExp = document.getElementById('statMaxSingleExp');
  const statMaxSingleMeta = document.getElementById('statMaxSingleMeta');
  const statPrimaryPayment = document.getElementById('statPrimaryPayment');
  const statPrimaryPaymentMeta = document.getElementById('statPrimaryPaymentMeta');

  if (statDailyBurn) {
    statDailyBurn.textContent = UI.formatCurrency(velocity.avgDailySpend);
  }
  if (statProjectedSpend) {
    statProjectedSpend.textContent = UI.formatCurrency(velocity.projectedMonthEnd);
  }
  if (statProjectedMeta) {
    statProjectedMeta.textContent = velocity.isProjectedToOverspend 
      ? 'Alert: Projected to exceed budget' 
      : 'Within target parameters';
    statProjectedMeta.style.color = velocity.isProjectedToOverspend ? 'var(--color-expense)' : 'var(--text-tertiary)';
  }

  // Highest single expense
  if (periodExpenses.length > 0) {
    const sortedByAmt = [...periodExpenses].sort((a, b) => b.amount - a.amount);
    const maxExp = sortedByAmt[0];
    if (statMaxSingleExp) statMaxSingleExp.textContent = UI.formatCurrency(maxExp.amount);
    if (statMaxSingleMeta) statMaxSingleMeta.textContent = `${maxExp.title} (${maxExp.category})`;
  } else {
    if (statMaxSingleExp) statMaxSingleExp.textContent = '₹0';
    if (statMaxSingleMeta) statMaxSingleMeta.textContent = 'No records in period';
  }

  // Primary payment method
  const paymentCounts = periodExpenses.reduce((acc, e) => {
    const m = e.paymentMethod || 'UPI';
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  const paymentSorted = Object.entries(paymentCounts).sort((a, b) => b[1] - a[1]);
  if (paymentSorted.length > 0) {
    if (statPrimaryPayment) statPrimaryPayment.textContent = paymentSorted[0][0];
    if (statPrimaryPaymentMeta) statPrimaryPaymentMeta.textContent = `${paymentSorted[0][1]} transactions`;
  } else {
    if (statPrimaryPayment) statPrimaryPayment.textContent = '-';
    if (statPrimaryPaymentMeta) statPrimaryPaymentMeta.textContent = '0 transactions';
  }

  // 2. Charts
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  renderCategoryChart(breakdown, isDark);
  renderBudgetVsActualChart(breakdown, categoryBudgets, isDark, textColor, gridColor);
  renderCashflowChart(salary, totalSpent, isDark, textColor, gridColor);
  renderPaymentMethodChart(paymentCounts, isDark);

  // 3. Category Deep Dive Table
  renderCategoryTable(breakdown, categoryBudgets);
}

// Chart 1: Category Doughnut
function renderCategoryChart(breakdown, isDark) {
  const canvas = document.getElementById('analyticsCategoryChart');
  if (!canvas) return;
  if (catChart) catChart.destroy();

  if (breakdown.length === 0) return;

  catChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: breakdown.map(c => c.category),
      datasets: [
        {
          data: breakdown.map(c => c.total),
          backgroundColor: breakdown.map(c => CATEGORIES[c.category]?.color || '#64748b'),
          borderWidth: 2,
          borderColor: isDark ? '#111827' : '#ffffff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: isDark ? '#f8fafc' : '#0f172a', font: { size: 11, family: 'Inter' } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ₹${Number(ctx.parsed).toLocaleString('en-IN')}`
          }
        }
      }
    }
  });
}

// Chart 2: Budget vs Actual Bar Chart
function renderBudgetVsActualChart(breakdown, categoryBudgets, isDark, textColor, gridColor) {
  const canvas = document.getElementById('analyticsBudgetBarChart');
  if (!canvas) return;
  if (budgetBarChart) budgetBarChart.destroy();

  const labels = Object.keys(CATEGORIES);
  const actualData = labels.map(cat => {
    const found = breakdown.find(b => b.category === cat);
    return found ? found.total : 0;
  });
  const budgetData = labels.map(cat => categoryBudgets[cat] || 0);

  budgetBarChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Actual Spent (₹)',
          data: actualData,
          backgroundColor: '#ef4444',
          borderRadius: 4
        },
        {
          label: 'Budget Cap (₹)',
          data: budgetData,
          backgroundColor: '#10b981',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textColor, font: { size: 11 } }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { size: 10 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 10 },
            callback: (v) => '₹' + Number(v).toLocaleString('en-IN')
          }
        }
      }
    }
  });
}

// Chart 3: Cashflow Inflow vs Outflow
function renderCashflowChart(salary, totalSpent, isDark, textColor, gridColor) {
  const canvas = document.getElementById('analyticsCashflowChart');
  if (!canvas) return;
  if (cashflowChart) cashflowChart.destroy();

  cashflowChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Inflow (Salary)', 'Outflow (Expenses)', 'Net Surplus/Deficit'],
      datasets: [
        {
          data: [salary, totalSpent, Math.max(0, salary - totalSpent)],
          backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
          borderRadius: 6,
          barThickness: 45
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Amount: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { size: 11, weight: '500' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 10 },
            callback: (v) => '₹' + Number(v).toLocaleString('en-IN')
          }
        }
      }
    }
  });
}

// Chart 4: Payment Method Distribution
function renderPaymentMethodChart(paymentCounts, isDark) {
  const canvas = document.getElementById('analyticsPaymentChart');
  if (!canvas) return;
  if (paymentChart) paymentChart.destroy();

  const labels = Object.keys(paymentCounts);
  const data = Object.values(paymentCounts);

  if (labels.length === 0) return;

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  paymentChart = new Chart(canvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: isDark ? '#111827' : '#ffffff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: isDark ? '#f8fafc' : '#0f172a', font: { size: 11 } }
        }
      }
    }
  });
}

// Deep Dive Table
function renderCategoryTable(breakdown, categoryBudgets) {
  const tbody = document.getElementById('categoryDetailTableBody');
  if (!tbody) return;

  if (breakdown.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:24px; color:var(--text-tertiary);">
          No transactions found for the selected period.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  breakdown.forEach(c => {
    const cat = CATEGORIES[c.category] || { color: '#64748b', bgColor: 'rgba(100,116,139,0.1)' };
    const avg = c.count > 0 ? Math.round(c.total / c.count) : 0;
    const budget = categoryBudgets[c.category] || 0;
    
    let statusBadge = '<span class="badge badge-subtle">No cap set</span>';
    if (budget > 0) {
      const pct = Math.round((c.total / budget) * 100);
      if (pct >= 100) {
        statusBadge = `<span class="badge badge-expense">Exceeded (${pct}%)</span>`;
      } else if (pct >= 75) {
        statusBadge = `<span class="badge badge-warning">High (${pct}%)</span>`;
      } else {
        statusBadge = `<span class="badge badge-income">Safe (${pct}%)</span>`;
      }
    }

    html += `
      <tr>
        <td>
          <span class="badge" style="background:${cat.bgColor}; color:${cat.color};">
            ${c.category}
          </span>
        </td>
        <td class="num-tabular" style="text-align:right;">${c.count}</td>
        <td class="num-tabular" style="text-align:right; font-weight:700; color:var(--text-primary);">
          ₹${c.total.toLocaleString('en-IN')}
        </td>
        <td class="num-tabular" style="text-align:right; color:var(--text-secondary);">${c.percentage}%</td>
        <td class="num-tabular" style="text-align:right; color:var(--text-secondary);">₹${avg.toLocaleString('en-IN')}</td>
        <td class="num-tabular" style="text-align:right; color:var(--text-secondary);">
          ${budget > 0 ? '₹' + budget.toLocaleString('en-IN') : '—'}
        </td>
        <td style="text-align:center;">${statusBadge}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}
