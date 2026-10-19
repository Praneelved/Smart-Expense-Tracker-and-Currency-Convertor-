/**
 * SpendWise Executive Dashboard Controller
 */

import { store } from './store.js';
import { currencyService } from './currencyService.js';
import { FinancialAnalytics } from './analytics.js';
import { UI } from './ui.js';
import { CATEGORIES } from './constants.js';

let trendChart = null;
let categoryChart = null;

// ==========================================
// Main Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  initDashboard();
  initTicker();
  initQuickConverter();
  setupEventListeners();

  // Listen for changes in the central store
  store.subscribe(() => {
    renderDashboard();
  });
});

function setupEventListeners() {
  const loadDemoBtn = document.getElementById('btnLoadDemoData');
  if (loadDemoBtn) {
    loadDemoBtn.addEventListener('click', () => {
      if (confirm('Load sample expenses and budgets to explore the dashboard? This will replace current data.')) {
        store.loadDemoData();
        UI.showToast('Sample dataset loaded successfully!', 'success');
      }
    });
  }
}

// ==========================================
// Dashboard Renderers
// ==========================================
function initDashboard() {
  renderDashboard();
}

function renderDashboard() {
  const expenses = store.getExpenses();
  const salary = store.getSalary();
  const monthlyBudget = store.getMonthlyBudget();

  const summary = FinancialAnalytics.getExecutiveSummary(expenses, salary, monthlyBudget);

  // 1. Metric Cards
  const totalSpentEl = document.getElementById('cardTotalSpent');
  const salaryEl = document.getElementById('cardSalary');
  const balanceEl = document.getElementById('cardBalance');
  const budgetPctEl = document.getElementById('cardBudgetPct');
  const budgetFillEl = document.getElementById('budgetProgressFill');
  const targetBudgetValEl = document.getElementById('targetBudgetVal');
  const badgeTxnCountEl = document.getElementById('badgeTxnCount');
  const badgeSavingsRateEl = document.getElementById('badgeSavingsRate');

  if (totalSpentEl) totalSpentEl.textContent = UI.formatCurrency(summary.totalSpent);
  if (salaryEl) salaryEl.textContent = UI.formatCurrency(summary.salary);
  if (balanceEl) {
    balanceEl.textContent = UI.formatCurrency(summary.balance);
    balanceEl.style.color = summary.balance < 0 ? 'var(--color-expense)' : 'var(--text-primary)';
  }
  if (targetBudgetValEl) targetBudgetValEl.textContent = monthlyBudget.toLocaleString('en-IN');
  if (badgeTxnCountEl) badgeTxnCountEl.textContent = `${summary.transactionCount} transactions`;

  if (badgeSavingsRateEl) {
    badgeSavingsRateEl.textContent = `${summary.savingsRate}% saved`;
    badgeSavingsRateEl.className = summary.balance < 0 ? 'badge badge-expense' : 'badge badge-income';
  }

  // Budget Progress
  if (budgetPctEl && budgetFillEl) {
    if (monthlyBudget > 0) {
      const pct = summary.budgetHealth.utilizationPct;
      budgetPctEl.textContent = `${pct}%`;
      budgetFillEl.style.width = `${Math.min(100, pct)}%`;

      if (pct >= 100) {
        budgetFillEl.className = 'progress-fill progress-fill-danger';
        budgetPctEl.style.color = 'var(--color-expense)';
      } else if (pct >= 75) {
        budgetFillEl.className = 'progress-fill progress-fill-warning';
        budgetPctEl.style.color = 'var(--color-warning)';
      } else {
        budgetFillEl.className = 'progress-fill progress-fill-safe';
        budgetPctEl.style.color = 'var(--color-primary)';
      }
    } else {
      budgetPctEl.textContent = 'Unset';
      budgetFillEl.style.width = '0%';
      budgetPctEl.style.color = 'var(--text-tertiary)';
    }
  }

  // 2. Charts
  renderTrendChart(expenses);
  renderCategoryDoughnut(summary.categoryBreakdown);

  // 3. Recent Transactions Table
  renderRecentTable(expenses);

  // 4. Smart Insights
  renderSmartInsights(summary);
}

// ==========================================
// Chart Visualizations
// ==========================================
function renderTrendChart(expenses) {
  const canvas = document.getElementById('trendChartCanvas');
  if (!canvas) return;

  const trendData = FinancialAnalytics.getDailySpendingTrend(expenses, 30);
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

  const formattedLabels = trendData.labels.map(l => {
    const parts = l.split('-');
    return `${parts[2]}/${parts[1]}`;
  });

  if (trendChart) {
    trendChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Daily Expenditure (₹)',
          data: trendData.values,
          borderColor: '#10b981',
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: 2.5,
          pointHoverRadius: 6,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#94a3b8' : '#475569',
          borderColor: isDark ? '#374151' : '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: (ctx) => `Spent: ₹${Number(ctx.parsed.y).toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, maxTicksLimit: 10, font: { size: 11 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { size: 11 },
            callback: (val) => '₹' + Number(val).toLocaleString('en-IN')
          }
        }
      }
    }
  });
}

function renderCategoryDoughnut(categoryBreakdown) {
  const canvas = document.getElementById('categoryChartCanvas');
  const listContainer = document.getElementById('categorySummaryList');
  if (!canvas) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (categoryChart) {
    categoryChart.destroy();
  }

  if (categoryBreakdown.length === 0) {
    if (listContainer) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:20px; color:var(--text-tertiary); font-size:0.875rem;">
          No expense transactions recorded yet.
        </div>
      `;
    }
    return;
  }

  const labels = categoryBreakdown.map(c => c.category);
  const data = categoryBreakdown.map(c => c.total);
  const colors = categoryBreakdown.map(c => CATEGORIES[c.category]?.color || '#64748b');

  categoryChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: isDark ? 2 : 2,
          borderColor: isDark ? '#111827' : '#ffffff',
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#94a3b8' : '#475569',
          borderColor: isDark ? '#374151' : '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => `${ctx.label}: ₹${Number(ctx.parsed).toLocaleString('en-IN')}`
          }
        }
      }
    }
  });

  // Render top 4 category badges in sidebar
  if (listContainer) {
    const top4 = categoryBreakdown.slice(0, 4);
    listContainer.innerHTML = top4.map(c => {
      const catConfig = CATEGORIES[c.category] || { color: '#64748b' };
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.85rem;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:10px; height:10px; border-radius:50%; background:${catConfig.color};"></span>
            <span style="color:var(--text-primary); font-weight:500;">${c.category}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="num-tabular" style="font-weight:600; color:var(--text-primary);">₹${c.total.toLocaleString('en-IN')}</span>
            <span style="color:var(--text-tertiary); font-size:0.775rem;">(${c.percentage}%)</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ==========================================
// Recent Ledger Table
// ==========================================
function renderRecentTable(expenses) {
  const container = document.getElementById('recentTableWrap');
  if (!container) return;

  if (expenses.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
        <div class="empty-state-title">No transactions recorded</div>
        <div class="empty-state-desc">Start building your financial journal by recording your first transaction.</div>
        <button class="btn btn-primary btn-sm btn-trigger-quick-add">+ Record First Expense</button>
      </div>
    `;
    return;
  }

  // Display top 5 most recent
  const recent = expenses.slice(0, 5);

  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Payment</th>
          <th style="text-align:right;">Amount</th>
          <th style="text-align:center;">Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  recent.forEach(exp => {
    const cat = CATEGORIES[exp.category] || { color: '#64748b', bgColor: 'rgba(100,116,139,0.1)' };
    html += `
      <tr>
        <td style="color:var(--text-secondary); font-size:0.85rem;">${UI.formatDate(exp.date)}</td>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${exp.title}</div>
          ${exp.notes ? `<div style="font-size:0.75rem; color:var(--text-tertiary);">${exp.notes}</div>` : ''}
        </td>
        <td>
          <span class="badge" style="background:${cat.bgColor}; color:${cat.color};">
            ${exp.category}
          </span>
        </td>
        <td style="color:var(--text-secondary); font-size:0.85rem;">
          ${exp.paymentMethod || 'UPI'}
        </td>
        <td class="num-tabular" style="text-align:right; font-weight:700; color:var(--color-expense);">
          ${UI.formatCurrency(exp.amount, exp.currency)}
        </td>
        <td style="text-align:center;">
          <button class="btn btn-ghost btn-sm btn-delete-expense" data-id="${exp.id}" title="Delete expense" style="color:var(--color-expense); padding:4px 8px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `;
  });

  html += '</tbody></table>';
  container.innerHTML = html;

  // Bind delete buttons
  container.querySelectorAll('.btn-delete-expense').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to remove this transaction record?')) {
        store.deleteExpense(id);
        UI.showToast('Transaction deleted', 'info');
      }
    });
  });
}

// ==========================================
// Smart Spending Insights Generator
// ==========================================
function renderSmartInsights(summary) {
  const container = document.getElementById('smartInsightsContainer');
  if (!container) return;

  const insights = [];

  // 1. Budget insight
  if (summary.budgetHealth.hasBudget) {
    if (summary.budgetHealth.status === 'exceeded') {
      insights.push({
        type: 'danger',
        icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
        title: 'Budget Cap Exceeded',
        desc: `You have spent ${summary.budgetHealth.utilizationPct}% of your target monthly budget.`
      });
    } else if (summary.budgetHealth.status === 'warning') {
      insights.push({
        type: 'warning',
        icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>',
        title: 'Approaching Budget Limit',
        desc: `75%+ of budget consumed with ${summary.velocity.daysRemaining} days remaining in this month.`
      });
    } else {
      insights.push({
        type: 'safe',
        icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        title: 'Budget on Target',
        desc: `Utilizing ${summary.budgetHealth.utilizationPct}% with ₹${summary.budgetHealth.remaining.toLocaleString('en-IN')} headroom.`
      });
    }
  }

  // 2. Highest spending category
  if (summary.categoryBreakdown.length > 0) {
    const topCat = summary.categoryBreakdown[0];
    insights.push({
      type: 'info',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3b82f6" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      title: `Top Category: ${topCat.category}`,
      desc: `Consumes ${topCat.percentage}% of total expenses (₹${topCat.total.toLocaleString('en-IN')}).`
    });
  }

  // 3. Spending velocity
  if (summary.velocity.avgDailySpend > 0) {
    insights.push({
      type: 'neutral',
      icon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#8b5cf6" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
      title: 'Burn Rate & Pace',
      desc: `Averaging ₹${summary.velocity.avgDailySpend.toLocaleString('en-IN')}/day. Recommended daily cap: ₹${summary.velocity.recommendedDailyCap.toLocaleString('en-IN')}.`
    });
  }

  if (insights.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:16px; color:var(--text-tertiary); font-size:0.85rem;">
        Add expenses to generate automated financial intelligence.
      </div>
    `;
    return;
  }

  container.innerHTML = insights.map(i => `
    <div class="insight-card">
      <div class="insight-icon" style="background:var(--bg-surface); border:1px solid var(--border-subtle);">
        ${i.icon}
      </div>
      <div class="insight-content">
        <h6 style="color:var(--text-primary);">${i.title}</h6>
        <p style="color:var(--text-secondary);">${i.desc}</p>
      </div>
    </div>
  `).join('');
}

// ==========================================
// Live Exchange Rate Ticker
// ==========================================
async function initTicker() {
  try {
    const res = await currencyService.getRates('USD');
    const inrRate = res.rates['INR'] || 86.45;
    const eurRate = res.rates['EUR'] || 0.96;
    const gbpRate = res.rates['GBP'] || 0.81;
    const aedRate = res.rates['AED'] || 3.67;

    const usdInr = document.getElementById('tickerUsdInr');
    const eurInr = document.getElementById('tickerEurInr');
    const gbpInr = document.getElementById('tickerGbpInr');
    const aedInr = document.getElementById('tickerAedInr');

    if (usdInr) usdInr.textContent = `₹${inrRate.toFixed(2)}`;
    if (eurInr) eurInr.textContent = `₹${(inrRate / eurRate).toFixed(2)}`;
    if (gbpInr) gbpInr.textContent = `₹${(inrRate / gbpRate).toFixed(2)}`;
    if (aedInr) aedInr.textContent = `₹${(inrRate / aedRate).toFixed(2)}`;
  } catch (e) {
    console.warn('Ticker rate update fallback active:', e);
  }
}

// ==========================================
// Quick Currency Converter on Dashboard
// ==========================================
function initQuickConverter() {
  const amtInput = document.getElementById('quickConvAmount');
  const fromSelect = document.getElementById('quickConvFrom');
  const toSelect = document.getElementById('quickConvTo');
  const rateTextEl = document.getElementById('quickConvRateText');
  const finalValEl = document.getElementById('quickConvValue');

  if (!amtInput || !fromSelect || !toSelect) return;

  const calculateQuick = async () => {
    const amt = Number(amtInput.value) || 0;
    const from = fromSelect.value;
    const to = toSelect.value;

    if (amt <= 0) {
      if (finalValEl) finalValEl.textContent = '--';
      return;
    }

    try {
      if (rateTextEl) rateTextEl.textContent = 'Fetching market rate...';
      const result = await currencyService.convert(amt, from, to);
      if (rateTextEl) {
        rateTextEl.textContent = `1 ${from} = ${result.rate.toFixed(4)} ${to} (${result.status})`;
      }
      if (finalValEl) {
        finalValEl.textContent = `${UI.formatCurrency(result.convertedAmount, to)}`;
      }
    } catch (err) {
      if (rateTextEl) rateTextEl.textContent = 'Conversion failed';
      if (finalValEl) finalValEl.textContent = '--';
    }
  };

  amtInput.addEventListener('input', calculateQuick);
  fromSelect.addEventListener('change', calculateQuick);
  toSelect.addEventListener('change', calculateQuick);

  // Initial calculation
  calculateQuick();
}
