/**
 * SpendWise UI Controller - Theme, Toast Notifications, Modals & Navigation
 */

import { store } from './store.js';
import { CATEGORIES, CURRENCIES, PAYMENT_METHODS } from './constants.js';

export class UI {
  static init() {
    this.initTheme();
    this.initNavigation();
    this.injectQuickAddModal();
    this.injectToastContainer();
  }

  // ==========================================
  // Theme Management
  // ==========================================
  static initTheme() {
    const savedTheme = localStorage.getItem('spendwise_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);

    // Bind theme togglers
    const togglers = document.querySelectorAll('.btn-theme-toggle');
    togglers.forEach(btn => {
      btn.addEventListener('click', () => this.toggleTheme());
    });

    // Listen to OS theme changes if user hasn't explicitly set preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('spendwise_theme')) {
          document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  static toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('spendwise_theme', next);
    this.showToast(`Switched to ${next} theme`, 'info', 2000);
  }

  // ==========================================
  // Toast Notifications
  // ==========================================
  static injectToastContainer() {
    if (!document.getElementById('toastContainer')) {
      const container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  }

  static showToast(message, type = 'info', duration = 3500) {
    this.injectToastContainer();
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else if (type === 'warning') {
      iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    } else {
      iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0ea5e9" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  }

  // ==========================================
  // Navigation & Drawer
  // ==========================================
  static initNavigation() {
    // Current route highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .bottom-tab');
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Mobile drawer toggles
    const openBtn = document.querySelector('.mobile-menu-btn');
    const closeBtn = document.querySelector('.mobile-drawer-close');
    const drawer = document.querySelector('.mobile-drawer');
    const backdrop = document.querySelector('.mobile-drawer-backdrop');

    if (openBtn && drawer && backdrop) {
      openBtn.addEventListener('click', () => {
        drawer.classList.add('open');
        backdrop.classList.add('open');
      });
    }

    const closeDrawer = () => {
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Global quick add triggers
    document.querySelectorAll('.btn-trigger-quick-add').forEach(btn => {
      btn.addEventListener('click', () => this.openQuickAddModal());
    });
  }

  // ==========================================
  // Quick Add Expense Modal
  // ==========================================
  static injectQuickAddModal() {
    if (document.getElementById('quickAddModalBackdrop')) return;

    const categoryOptions = Object.values(CATEGORIES).map(c => 
      `<option value="${c.id}">${c.name}</option>`
    ).join('');

    const paymentOptions = PAYMENT_METHODS.map(p => 
      `<option value="${p}">${p}</option>`
    ).join('');

    const modalHtml = `
      <div class="modal-backdrop" id="quickAddModalBackdrop">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="quickAddTitle">
          <div class="modal-header">
            <h3 class="modal-title" id="quickAddTitle">Record New Expense</h3>
            <button class="modal-close" id="quickAddCloseBtn" aria-label="Close modal">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <form id="quickAddForm">
            <div class="modal-body">
              <div class="form-group">
                <label for="qaTitle" class="form-label">Expense Title / Description *</label>
                <input type="text" id="qaTitle" class="form-control" placeholder="e.g. Organic Groceries, Metro Recharge" required autofocus>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="form-group">
                  <label for="qaAmount" class="form-label">Amount (₹) *</label>
                  <input type="number" id="qaAmount" class="form-control num-tabular" placeholder="0.00" min="0.01" step="0.01" required>
                </div>
                <div class="form-group">
                  <label for="qaDate" class="form-label">Date *</label>
                  <input type="date" id="qaDate" class="form-control" required>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="form-group">
                  <label for="qaCategory" class="form-label">Category *</label>
                  <select id="qaCategory" class="form-select" required>
                    ${categoryOptions}
                  </select>
                </div>
                <div class="form-group">
                  <label for="qaPayment" class="form-label">Payment Method</label>
                  <select id="qaPayment" class="form-select">
                    ${paymentOptions}
                  </select>
                </div>
              </div>

              <div class="form-group" style="margin-bottom:0;">
                <label for="qaNotes" class="form-label">Optional Notes / Tag</label>
                <input type="text" id="qaNotes" class="form-control" placeholder="e.g. Bill #8491, split with roommate">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="quickAddCancelBtn">Cancel</button>
              <button type="submit" class="btn btn-primary" id="quickAddSubmitBtn">Add Expense</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const backdrop = document.getElementById('quickAddModalBackdrop');
    const closeBtn = document.getElementById('quickAddCloseBtn');
    const cancelBtn = document.getElementById('quickAddCancelBtn');
    const form = document.getElementById('quickAddForm');
    const dateInput = document.getElementById('qaDate');

    // Default date to today
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    const closeModal = () => backdrop.classList.remove('open');
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const title = document.getElementById('qaTitle').value;
        const amount = document.getElementById('qaAmount').value;
        const date = document.getElementById('qaDate').value;
        const category = document.getElementById('qaCategory').value;
        const paymentMethod = document.getElementById('qaPayment').value;
        const notes = document.getElementById('qaNotes').value;

        store.addExpense({
          title,
          amount,
          date,
          category,
          paymentMethod,
          notes
        });

        form.reset();
        dateInput.value = new Date().toISOString().split('T')[0];
        closeModal();
        UI.showToast('Expense recorded successfully!', 'success');
      } catch (err) {
        UI.showToast(err.message, 'error');
      }
    });
  }

  static openQuickAddModal() {
    const backdrop = document.getElementById('quickAddModalBackdrop');
    if (backdrop) {
      backdrop.classList.add('open');
      const titleInput = document.getElementById('qaTitle');
      if (titleInput) setTimeout(() => titleInput.focus(), 150);
    }
  }

  // ==========================================
  // Currency & Date Formatters
  // ==========================================
  static formatCurrency(amount, currency = 'INR') {
    const val = Number(amount) || 0;
    if (currency === 'INR') {
      return '₹' + val.toLocaleString('en-IN', {
        minimumFractionDigits: val % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2
      });
    }
    const symbol = CURRENCIES[currency]?.symbol || currency + ' ';
    return symbol + val.toLocaleString('en-US', {
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
  }

  static formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  }
}
