/**
 * SpendWise Store - Centralized Data Persistence & State Management
 */

import { STORAGE_KEYS, DEFAULT_DEMO_DATA } from './constants.js';

class SpendWiseStore {
  constructor() {
    this.subscribers = [];
    this.expenses = [];
    this.salary = 0;
    this.monthlyBudget = 0;
    this.categoryBudgets = {};
    this.settings = {
      baseCurrency: 'INR',
      theme: 'system',
      dateFormat: 'DD/MM/YYYY'
    };

    this.init();
  }

  getStorage() {
    if (typeof localStorage !== 'undefined') return localStorage;
    if (!this._memoryStorage) this._memoryStorage = {};
    return {
      getItem: (k) => this._memoryStorage[k] || null,
      setItem: (k, v) => { this._memoryStorage[k] = String(v); },
      removeItem: (k) => { delete this._memoryStorage[k]; }
    };
  }

  init() {
    try {
      const storage = this.getStorage();
      // 1. Backwards compatibility migration check:
      // If legacy 'expenses' or 'salary' exist from v1, migrate them into v2 schema!
      const legacyExpenses = storage.getItem('expenses');
      const legacySalary = storage.getItem('salary');

      const storedExpenses = storage.getItem(STORAGE_KEYS.EXPENSES);
      const storedSalary = storage.getItem(STORAGE_KEYS.SALARY);
      const storedBudgets = storage.getItem(STORAGE_KEYS.BUDGETS);
      const storedSettings = storage.getItem(STORAGE_KEYS.SETTINGS);

      if (storedExpenses) {
        this.expenses = JSON.parse(storedExpenses);
      } else if (legacyExpenses) {
        const parsed = JSON.parse(legacyExpenses);
        if (Array.isArray(parsed)) {
          this.expenses = parsed.map((e, index) => ({
            id: 'migrated_' + (Date.now() + index),
            title: e.description || 'Expense',
            amount: Number(e.amount) || 0,
            currency: 'INR',
            category: e.category || 'Other',
            date: e.date || new Date().toISOString().split('T')[0],
            paymentMethod: 'UPI / PhonePe / GPay',
            notes: 'Imported from previous version'
          }));
          this.persistExpenses();
        }
      } else {
        // If first time opening with no data, load demo data so user experiences an active application
        this.expenses = [...DEFAULT_DEMO_DATA.expenses];
        this.persistExpenses();
      }

      if (storedSalary) {
        this.salary = Number(storedSalary) || 0;
      } else if (legacySalary) {
        this.salary = Number(legacySalary) || 0;
        this.persistSalary();
      } else {
        this.salary = DEFAULT_DEMO_DATA.salary;
        this.persistSalary();
      }

      if (storedBudgets) {
        const parsedBudgets = JSON.parse(storedBudgets);
        this.monthlyBudget = parsedBudgets.monthlyBudget || 0;
        this.categoryBudgets = parsedBudgets.categoryBudgets || {};
      } else {
        this.monthlyBudget = DEFAULT_DEMO_DATA.monthlyBudget;
        this.categoryBudgets = { ...DEFAULT_DEMO_DATA.categoryBudgets };
        this.persistBudgets();
      }

      if (storedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(storedSettings) };
      }
    } catch (err) {
      console.error('Error initializing SpendWise store:', err);
      this.expenses = [];
      this.salary = 0;
    }
  }

  // Persistence Helpers
  persistExpenses() {
    this.getStorage().setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(this.expenses));
  }

  persistSalary() {
    this.getStorage().setItem(STORAGE_KEYS.SALARY, JSON.stringify(this.salary));
  }

  persistBudgets() {
    this.getStorage().setItem(
      STORAGE_KEYS.BUDGETS,
      JSON.stringify({
        monthlyBudget: this.monthlyBudget,
        categoryBudgets: this.categoryBudgets
      })
    );
  }

  persistSettings() {
    this.getStorage().setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
  }

  notify() {
    this.subscribers.forEach(cb => {
      try { cb(this); } catch (e) { console.error('Store subscriber error:', e); }
    });
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // State Getters
  getExpenses() {
    return [...this.expenses];
  }

  getSalary() {
    return this.salary;
  }

  getMonthlyBudget() {
    return this.monthlyBudget;
  }

  getCategoryBudgets() {
    return { ...this.categoryBudgets };
  }

  getSettings() {
    return { ...this.settings };
  }

  // State Mutations
  setSalary(amount) {
    const val = Math.max(0, Number(amount) || 0);
    this.salary = Math.round(val * 100) / 100;
    this.persistSalary();
    this.notify();
    return this.salary;
  }

  setMonthlyBudget(budget) {
    const val = Math.max(0, Number(budget) || 0);
    this.monthlyBudget = Math.round(val * 100) / 100;
    this.persistBudgets();
    this.notify();
    return this.monthlyBudget;
  }

  setCategoryBudget(category, budget) {
    const val = Math.max(0, Number(budget) || 0);
    this.categoryBudgets[category] = Math.round(val * 100) / 100;
    this.persistBudgets();
    this.notify();
  }

  addExpense(expense) {
    if (!expense.title || !expense.title.trim()) {
      throw new Error('Expense title is required');
    }
    const amt = Number(expense.amount);
    if (isNaN(amt) || amt <= 0) {
      throw new Error('Amount must be a positive number');
    }
    if (!expense.date) {
      throw new Error('Date is required');
    }

    const newExpense = {
      id: expense.id || 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: expense.title.trim(),
      amount: Math.round(amt * 100) / 100,
      currency: expense.currency || this.settings.baseCurrency || 'INR',
      category: expense.category || 'Other',
      date: expense.date,
      paymentMethod: expense.paymentMethod || 'UPI / PhonePe / GPay',
      notes: (expense.notes || '').trim()
    };

    // Prepend to top of list
    this.expenses.unshift(newExpense);
    this.persistExpenses();
    this.notify();
    return newExpense;
  }

  updateExpense(id, updatedFields) {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expense with ID not found');
    }

    const current = this.expenses[index];
    const amt = updatedFields.amount !== undefined ? Number(updatedFields.amount) : current.amount;
    if (isNaN(amt) || amt <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    this.expenses[index] = {
      ...current,
      ...updatedFields,
      title: (updatedFields.title || current.title).trim(),
      amount: Math.round(amt * 100) / 100,
      notes: updatedFields.notes !== undefined ? (updatedFields.notes || '').trim() : current.notes
    };

    this.persistExpenses();
    this.notify();
    return this.expenses[index];
  }

  deleteExpense(id) {
    const beforeCount = this.expenses.length;
    this.expenses = this.expenses.filter(e => e.id !== id);
    if (this.expenses.length !== beforeCount) {
      this.persistExpenses();
      this.notify();
      return true;
    }
    return false;
  }

  clearAllData() {
    this.expenses = [];
    this.salary = 0;
    this.monthlyBudget = 0;
    this.categoryBudgets = {};
    this.persistExpenses();
    this.persistSalary();
    this.persistBudgets();
    this.notify();
  }

  loadDemoData() {
    this.expenses = [...DEFAULT_DEMO_DATA.expenses];
    this.salary = DEFAULT_DEMO_DATA.salary;
    this.monthlyBudget = DEFAULT_DEMO_DATA.monthlyBudget;
    this.categoryBudgets = { ...DEFAULT_DEMO_DATA.categoryBudgets };
    this.persistExpenses();
    this.persistSalary();
    this.persistBudgets();
    this.notify();
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.persistSettings();
    this.notify();
  }

  // Backup & Import
  exportJSON() {
    return JSON.stringify(
      {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        salary: this.salary,
        monthlyBudget: this.monthlyBudget,
        categoryBudgets: this.categoryBudgets,
        settings: this.settings,
        expenses: this.expenses
      },
      null,
      2
    );
  }

  importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON format');
      }

      if (Array.isArray(data.expenses)) {
        // Validate each expense item
        this.expenses = data.expenses.filter(e => e && e.title && !isNaN(e.amount)).map((e, idx) => ({
          id: e.id || 'imported_' + Date.now() + '_' + idx,
          title: String(e.title).trim(),
          amount: Math.round(Number(e.amount) * 100) / 100,
          currency: e.currency || 'INR',
          category: e.category || 'Other',
          date: e.date || new Date().toISOString().split('T')[0],
          paymentMethod: e.paymentMethod || 'UPI / PhonePe / GPay',
          notes: e.notes || ''
        }));
      }

      if (typeof data.salary === 'number') {
        this.salary = Math.max(0, data.salary);
      }
      if (typeof data.monthlyBudget === 'number') {
        this.monthlyBudget = Math.max(0, data.monthlyBudget);
      }
      if (data.categoryBudgets && typeof data.categoryBudgets === 'object') {
        this.categoryBudgets = { ...data.categoryBudgets };
      }
      if (data.settings && typeof data.settings === 'object') {
        this.settings = { ...this.settings, ...data.settings };
      }

      this.persistExpenses();
      this.persistSalary();
      this.persistBudgets();
      this.persistSettings();
      this.notify();
      return true;
    } catch (err) {
      throw new Error('Failed to import backup: ' + err.message);
    }
  }
}

export const store = new SpendWiseStore();
