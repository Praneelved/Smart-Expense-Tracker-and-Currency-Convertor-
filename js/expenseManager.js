/**
 * SpendWise Expense Manager & Ledger Controller
 */

import { store } from './store.js';
import { FinancialAnalytics } from './analytics.js';
import { ExportUtils } from './exportUtils.js';
import { UI } from './ui.js';
import { CATEGORIES, PAYMENT_METHODS } from './constants.js';

let currentPage = 1;
const itemsPerPage = 8;
let editModeId = null;

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  initDropdowns();
  initForm();
  initFilterControls();
  initBudgetModals();
  initExportImport();
  renderLedger();

  // Subscribe to changes in store
  store.subscribe(() => {
    renderLedger();
  });
});

// ==========================================
// Populate Categories & Payment Dropdowns
// ==========================================
function initDropdowns() {
  const catSelect = document.getElementById('expCategory');
  const filterCatSelect = document.getElementById('filterCategory');
  const paymentSelect = document.getElementById('expPaymentMethod');
  const filterPaymentSelect = document.getElementById('filterPayment');

  // Categories
  Object.values(CATEGORIES).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    catSelect.appendChild(opt);

    const filterOpt = document.createElement('option');
    filterOpt.value = c.id;
    filterOpt.textContent = c.name;
    filterCatSelect.appendChild(filterOpt);
  });

  // Payment Methods
  PAYMENT_METHODS.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = p;
    paymentSelect.appendChild(opt);

    const filterOpt = document.createElement('option');
    filterOpt.value = p;
    filterOpt.textContent = p;
    filterPaymentSelect.appendChild(filterOpt);
  });
}

// ==========================================
// Form Handling (Create & Edit)
// ==========================================
function initForm() {
  const form = document.getElementById('mainExpenseForm');
  const dateInput = document.getElementById('expDate');
  const salaryForm = document.getElementById('salaryForm');
  const budgetForm = document.getElementById('budgetForm');
  const btnCancelEdit = document.getElementById('btnCancelEdit');

  // Set default date to today
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Pre-fill salary & budget inputs
  const currentSalary = store.getSalary();
  const currentBudget = store.getMonthlyBudget();
  const salaryInput = document.getElementById('salaryInput');
  const budgetInput = document.getElementById('monthlyBudgetInput');

  if (salaryInput && currentSalary > 0) salaryInput.value = currentSalary;
  if (budgetInput && currentBudget > 0) budgetInput.value = currentBudget;

  // Salary save
  salaryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = Number(salaryInput.value);
    if (isNaN(val) || val < 0) {
      UI.showToast('Please enter a valid salary amount', 'error');
      return;
    }
    store.setSalary(val);
    UI.showToast('Monthly salary saved successfully', 'success');
  });

  // Monthly budget save
  budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = Number(budgetInput.value);
    if (isNaN(val) || val < 0) {
      UI.showToast('Please enter a valid budget amount', 'error');
      return;
    }
    store.setMonthlyBudget(val);
    UI.showToast('Overall monthly budget cap updated', 'success');
  });

  // Main Expense Form (Add / Edit)
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('expTitle').value.trim();
    const amount = Number(document.getElementById('expAmount').value);
    const date = document.getElementById('expDate').value;
    const category = document.getElementById('expCategory').value;
    const paymentMethod = document.getElementById('expPaymentMethod').value;
    const notes = document.getElementById('expNotes').value.trim();

    if (!title) {
      UI.showToast('Please enter an expense description', 'error');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      UI.showToast('Amount must be greater than zero', 'error');
      return;
    }
    if (!date) {
      UI.showToast('Please choose a valid date', 'error');
      return;
    }

    try {
      if (editModeId) {
        // Update existing expense
        store.updateExpense(editModeId, {
          title,
          amount,
          date,
          category,
          paymentMethod,
          notes
        });
        UI.showToast('Transaction updated successfully', 'success');
        resetEditMode();
      } else {
        // Add new expense
        store.addExpense({
          title,
          amount,
          date,
          category,
          paymentMethod,
          notes
        });
        UI.showToast('Expense added to ledger', 'success');
        form.reset();
        dateInput.value = new Date().toISOString().split('T')[0];
      }
    } catch (err) {
      UI.showToast(err.message, 'error');
    }
  });

  if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', resetEditMode);
  }
}

function enterEditMode(expense) {
  editModeId = expense.id;
  document.getElementById('formHeaderTitle').innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary)" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    Editing Transaction #${expense.id.slice(-6)}
  `;
  document.getElementById('btnSubmitExpenseText').textContent = 'Update Expense';
  document.getElementById('btnCancelEdit').style.display = 'inline-block';

  document.getElementById('expTitle').value = expense.title;
  document.getElementById('expAmount').value = expense.amount;
  document.getElementById('expDate').value = expense.date;
  document.getElementById('expCategory').value = expense.category;
  document.getElementById('expPaymentMethod').value = expense.paymentMethod || 'UPI / PhonePe / GPay';
  document.getElementById('expNotes').value = expense.notes || '';

  // Scroll to form smoothly
  document.getElementById('expenseFormCard').scrollIntoView({ behavior: 'smooth' });
}

function resetEditMode() {
  editModeId = null;
  document.getElementById('mainExpenseForm').reset();
  document.getElementById('expDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('formHeaderTitle').innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary)" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
    Record New Transaction
  `;
  document.getElementById('btnSubmitExpenseText').textContent = 'Add Expense';
  document.getElementById('btnCancelEdit').style.display = 'none';
}

// ==========================================
// Filter, Search, Sort & Pagination
// ==========================================
function initFilterControls() {
  const searchInput = document.getElementById('searchQuery');
  const catSelect = document.getElementById('filterCategory');
  const paySelect = document.getElementById('filterPayment');
  const periodSelect = document.getElementById('filterPeriod');
  const sortSelect = document.getElementById('sortOption');
  const btnReset = document.getElementById('btnResetFilters');
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');

  const onFilterChange = () => {
    currentPage = 1;
    renderLedger();
  };

  searchInput.addEventListener('input', onFilterChange);
  catSelect.addEventListener('change', onFilterChange);
  paySelect.addEventListener('change', onFilterChange);
  periodSelect.addEventListener('change', onFilterChange);
  sortSelect.addEventListener('change', onFilterChange);

  btnReset.addEventListener('click', () => {
    searchInput.value = '';
    catSelect.value = 'ALL';
    paySelect.value = 'ALL';
    periodSelect.value = 'all';
    sortSelect.value = 'date_desc';
    currentPage = 1;
    renderLedger();
    UI.showToast('Filters reset to default', 'info');
  });

  btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderLedger();
    }
  });

  btnNext.addEventListener('click', () => {
    currentPage++;
    renderLedger();
  });
}

function getFilteredAndSortedExpenses() {
  let list = store.getExpenses();

  const search = document.getElementById('searchQuery').value.toLowerCase().trim();
  const category = document.getElementById('filterCategory').value;
  const payment = document.getElementById('filterPayment').value;
  const period = document.getElementById('filterPeriod').value;
  const sort = document.getElementById('sortOption').value;

  // 1. Period filter
  list = FinancialAnalytics.filterByPeriod(list, period);

  // 2. Category filter
  if (category !== 'ALL') {
    list = list.filter(e => e.category === category);
  }

  // 3. Payment filter
  if (payment !== 'ALL') {
    list = list.filter(e => e.paymentMethod === payment);
  }

  // 4. Search filter
  if (search) {
    list = list.filter(e => 
      e.title.toLowerCase().includes(search) || 
      (e.notes && e.notes.toLowerCase().includes(search))
    );
  }

  // 5. Sorting
  list.sort((a, b) => {
    if (sort === 'date_desc') return new Date(b.date) - new Date(a.date);
    if (sort === 'date_asc') return new Date(a.date) - new Date(b.date);
    if (sort === 'amount_desc') return b.amount - a.amount;
    if (sort === 'amount_asc') return a.amount - b.amount;
    if (sort === 'title_asc') return a.title.localeCompare(b.title);
    return 0;
  });

  return list;
}

// ==========================================
// Render Ledger & Summaries
// ==========================================
function renderLedger() {
  const allExpenses = store.getExpenses();
  const salary = store.getSalary();
  const budget = store.getMonthlyBudget();

  // Top metric numbers
  const totalSpent = FinancialAnalytics.getTotalSpent(allExpenses);
  const balance = Math.round((salary - totalSpent) * 100) / 100;
  const budgetHealth = FinancialAnalytics.calculateBudgetHealth(totalSpent, budget);

  const dispSalary = document.getElementById('dispSalary');
  const dispTotalSpent = document.getElementById('dispTotalSpent');
  const dispBalance = document.getElementById('dispBalance');
  const dispTxnMeta = document.getElementById('dispTxnMeta');
  const dispBudgetPercent = document.getElementById('dispBudgetPercent');

  if (dispSalary) dispSalary.textContent = UI.formatCurrency(salary);
  if (dispTotalSpent) dispTotalSpent.textContent = UI.formatCurrency(totalSpent);
  if (dispBalance) {
    dispBalance.textContent = UI.formatCurrency(balance);
    dispBalance.style.color = balance < 0 ? 'var(--color-expense)' : 'var(--text-primary)';
  }
  if (dispTxnMeta) dispTxnMeta.textContent = `${allExpenses.length} transactions recorded`;
  if (dispBudgetPercent) {
    dispBudgetPercent.textContent = budget > 0 ? `${budgetHealth.utilizationPct}%` : 'Unset';
  }

  // Table filtering and pagination
  const filtered = getFilteredAndSortedExpenses();
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const tbody = document.getElementById('expenseTableBody');
  const emptyState = document.getElementById('tableEmptyState');
  const paginationInfo = document.getElementById('paginationInfo');
  const pageIndicator = document.getElementById('pageIndicator');
  const btnPrev = document.getElementById('btnPrevPage');
  const btnNext = document.getElementById('btnNextPage');

  if (totalItems === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></line><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <div class="empty-state-title">No transactions match your criteria</div>
        <div class="empty-state-desc">Try clearing the search query or adjusting your filters.</div>
      </div>
    `;
    paginationInfo.textContent = 'Showing 0 of 0 transactions';
    pageIndicator.textContent = 'Page 1 of 1';
    btnPrev.disabled = true;
    btnNext.disabled = true;
    return;
  }

  emptyState.style.display = 'none';

  let html = '';
  pageItems.forEach((exp, idx) => {
    const rowNum = startIndex + idx + 1;
    const cat = CATEGORIES[exp.category] || { color: '#64748b', bgColor: 'rgba(100,116,139,0.1)' };
    html += `
      <tr>
        <td style="color:var(--text-tertiary); font-size:0.85rem;">${rowNum}</td>
        <td style="color:var(--text-secondary); font-size:0.85rem; white-space:nowrap;">
          ${UI.formatDate(exp.date)}
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-primary);">${exp.title}</div>
          ${exp.notes ? `<div style="font-size:0.775rem; color:var(--text-tertiary); margin-top:2px;">${exp.notes}</div>` : ''}
        </td>
        <td>
          <span class="badge" style="background:${cat.bgColor}; color:${cat.color};">
            ${exp.category}
          </span>
        </td>
        <td style="color:var(--text-secondary); font-size:0.85rem;">
          ${exp.paymentMethod || 'UPI / PhonePe / GPay'}
        </td>
        <td class="num-tabular" style="text-align:right; font-weight:700; color:var(--color-expense);">
          ${UI.formatCurrency(exp.amount, exp.currency)}
        </td>
        <td style="text-align:center;">
          <div style="display:flex; align-items:center; justify-content:center; gap:4px;">
            <button class="btn btn-ghost btn-sm btn-edit-exp" data-id="${exp.id}" title="Edit transaction" style="color:var(--color-primary); padding:6px;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn btn-ghost btn-sm btn-delete-exp" data-id="${exp.id}" title="Delete transaction" style="color:var(--color-expense); padding:6px;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Pagination texts & buttons
  const showingEnd = Math.min(startIndex + itemsPerPage, totalItems);
  paginationInfo.textContent = `Showing ${startIndex + 1} to ${showingEnd} of ${totalItems} transactions`;
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  btnPrev.disabled = currentPage === 1;
  btnNext.disabled = currentPage === totalPages;

  // Bind Actions
  tbody.querySelectorAll('.btn-edit-exp').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = allExpenses.find(e => e.id === id);
      if (item) enterEditMode(item);
    });
  });

  tbody.querySelectorAll('.btn-delete-exp').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Permanently delete this transaction from the ledger?')) {
        store.deleteExpense(id);
        UI.showToast('Transaction removed', 'info');
      }
    });
  });
}

// ==========================================
// Category Budgets Management Modal
// ==========================================
function initBudgetModals() {
  const modal = document.getElementById('categoryBudgetsModal');
  const btnOpen = document.getElementById('btnOpenCategoryBudgets');
  const btnClose = document.getElementById('closeCatBudgetsModal');
  const btnSave = document.getElementById('btnSaveCategoryBudgets');
  const listContainer = document.getElementById('categoryBudgetsList');

  const openModal = () => {
    const categoryBudgets = store.getCategoryBudgets();
    const currentMonthExpenses = FinancialAnalytics.filterByPeriod(store.getExpenses(), 'this_month');
    const categoryTotals = FinancialAnalytics.getCategoryBreakdown(currentMonthExpenses).reduce((acc, c) => {
      acc[c.category] = c.total;
      return acc;
    }, {});

    listContainer.innerHTML = Object.values(CATEGORIES).map(cat => {
      const spent = categoryTotals[cat.id] || 0;
      const budget = categoryBudgets[cat.id] || 0;
      const pct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
      const barClass = pct >= 100 ? 'progress-fill-danger' : (pct >= 75 ? 'progress-fill-warning' : 'progress-fill-safe');

      return `
        <div style="border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:12px; background:var(--bg-surface);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <strong style="color:var(--text-primary); font-size:0.925rem;">${cat.name}</strong>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:0.8rem; color:var(--text-secondary);">Spent: ₹${spent.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <input type="number" class="form-control num-tabular cat-budget-input" data-category="${cat.id}" value="${budget || ''}" placeholder="Cap in ₹ (e.g. 5000)" min="0" step="100">
            <span style="font-size:0.8rem; font-weight:600; width:60px; text-align:right; color:${pct >= 100 ? 'var(--color-expense)' : 'var(--text-secondary)'};">
              ${budget > 0 ? pct + '%' : 'Unset'}
            </span>
          </div>
          ${budget > 0 ? `
            <div class="progress-track" style="margin-top:8px;">
              <div class="progress-fill ${barClass}" style="width:${Math.min(100, pct)}%;"></div>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    modal.classList.add('open');
  };

  const closeModal = () => modal.classList.remove('open');

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const inputs = listContainer.querySelectorAll('.cat-budget-input');
      inputs.forEach(inp => {
        const catId = inp.getAttribute('data-category');
        const val = Number(inp.value) || 0;
        store.setCategoryBudget(catId, val);
      });
      closeModal();
      UI.showToast('Category budgets updated successfully', 'success');
      renderLedger();
    });
  }
}

// ==========================================
// Export & Import Management
// ==========================================
function initExportImport() {
  const btnCsv = document.getElementById('btnExportCsv');
  const btnPrint = document.getElementById('btnPrintStatement');
  const btnBackup = document.getElementById('btnBackupJson');
  const inputImport = document.getElementById('inputImportJson');
  const btnClearAll = document.getElementById('btnClearAllExpenses');

  if (btnCsv) {
    btnCsv.addEventListener('click', () => {
      try {
        const expenses = getFilteredAndSortedExpenses();
        ExportUtils.exportToCSV(expenses, store.getSalary());
        UI.showToast('CSV export downloaded', 'success');
      } catch (err) {
        UI.showToast(err.message, 'error');
      }
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      try {
        const expenses = getFilteredAndSortedExpenses();
        ExportUtils.printFinancialStatement(expenses, store.getSalary(), store.getMonthlyBudget());
      } catch (err) {
        UI.showToast(err.message, 'error');
      }
    });
  }

  if (btnBackup) {
    btnBackup.addEventListener('click', () => {
      ExportUtils.exportToJSON();
      UI.showToast('JSON backup created', 'success');
    });
  }

  if (inputImport) {
    inputImport.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (confirm('Importing this file will merge with or update your current transactions and budgets. Proceed?')) {
        try {
          await ExportUtils.importFromJSONFile(file);
          UI.showToast('Data backup imported successfully!', 'success');
        } catch (err) {
          UI.showToast(err.message, 'error');
        }
      }
      inputImport.value = '';
    });
  }

  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      if (confirm('CAUTION: Are you sure you want to permanently clear all transactions, salary, and budgets? This action cannot be undone unless you have a JSON backup.')) {
        store.clearAllData();
        UI.showToast('All transaction records cleared', 'warning');
      }
    });
  }
}
