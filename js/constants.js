/**
 * SpendWise Financial Constants & Configuration
 */

export const CATEGORIES = {
  Food: {
    id: 'Food',
    name: 'Food & Dining',
    icon: 'utensils',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.12)'
  },
  Shopping: {
    id: 'Shopping',
    name: 'Shopping & Retail',
    icon: 'shopping-bag',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.12)'
  },
  Transportation: {
    id: 'Transportation',
    name: 'Transportation & Travel',
    icon: 'car',
    color: '#0ea5e9',
    bgColor: 'rgba(14, 165, 233, 0.12)'
  },
  Medical: {
    id: 'Medical',
    name: 'Healthcare & Medical',
    icon: 'heart-pulse',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)'
  },
  Entertainment: {
    id: 'Entertainment',
    name: 'Entertainment & Leisure',
    icon: 'film',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)'
  },
  Bills: {
    id: 'Bills',
    name: 'Bills & Utilities',
    icon: 'receipt',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.12)'
  },
  Education: {
    id: 'Education',
    name: 'Education & Learning',
    icon: 'book-open',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.12)'
  },
  Investments: {
    id: 'Investments',
    name: 'Savings & Investments',
    icon: 'trending-up',
    color: '#14b8a6',
    bgColor: 'rgba(20, 184, 166, 0.12)'
  },
  Other: {
    id: 'Other',
    name: 'Miscellaneous / Other',
    icon: 'tag',
    color: '#64748b',
    bgColor: 'rgba(100, 116, 139, 0.12)'
  }
};

export const PAYMENT_METHODS = [
  'UPI / PhonePe / GPay',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Cash',
  'Bank Transfer'
];

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' }
};

export const STORAGE_KEYS = {
  EXPENSES: 'spendwise_expenses_v2',
  SALARY: 'spendwise_salary_v2',
  BUDGETS: 'spendwise_budgets_v2',
  SETTINGS: 'spendwise_settings_v2',
  RATES_CACHE: 'spendwise_exchange_rates_cache_v2'
};

export const DEFAULT_DEMO_DATA = {
  salary: 75000,
  monthlyBudget: 45000,
  categoryBudgets: {
    Food: 12000,
    Shopping: 8000,
    Transportation: 6000,
    Bills: 8000,
    Entertainment: 5000
  },
  expenses: [
    {
      id: 'exp_demo_1',
      title: 'Monthly Grocery & Supermarket',
      amount: 4250,
      currency: 'INR',
      category: 'Food',
      date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      notes: 'Monthly bulk groceries from Nature Basket'
    },
    {
      id: 'exp_demo_2',
      title: 'High-speed Fiber Internet Bill',
      amount: 1199,
      currency: 'INR',
      category: 'Bills',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'UPI / PhonePe / GPay',
      notes: 'Airtel Xstream Fiber 200 Mbps'
    },
    {
      id: 'exp_demo_3',
      title: 'Weekend Dining with Family',
      amount: 2850,
      currency: 'INR',
      category: 'Food',
      date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'UPI / PhonePe / GPay',
      notes: 'Dinner at Olive Bistro'
    },
    {
      id: 'exp_demo_4',
      title: 'Fuel refill (Petrol)',
      amount: 2500,
      currency: 'INR',
      category: 'Transportation',
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Debit Card',
      notes: 'Full tank at Indian Oil'
    },
    {
      id: 'exp_demo_5',
      title: 'AWS Cloud Hosting & Domain Renewal',
      amount: 3200,
      currency: 'INR',
      category: 'Bills',
      date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      notes: 'Annual domain + EC2 micro server'
    },
    {
      id: 'exp_demo_6',
      title: 'Sneakers & Running Gear',
      amount: 4599,
      currency: 'INR',
      category: 'Shopping',
      date: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      notes: 'Nike Revolution 7'
    },
    {
      id: 'exp_demo_7',
      title: 'IMAX Cinema Tickets & Popcorn',
      amount: 1400,
      currency: 'INR',
      category: 'Entertainment',
      date: new Date(Date.now() - 11 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'UPI / PhonePe / GPay',
      notes: 'Dune Part 2 IMAX'
    },
    {
      id: 'exp_demo_8',
      title: 'Full Body Health Checkup & Vitamins',
      amount: 2200,
      currency: 'INR',
      category: 'Medical',
      date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Net Banking',
      notes: 'Annual lab diagnostics'
    },
    {
      id: 'exp_demo_9',
      title: 'System Design Online Masterclass',
      amount: 3999,
      currency: 'INR',
      category: 'Education',
      date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      notes: 'Advanced Distributed Systems course'
    },
    {
      id: 'exp_demo_10',
      title: 'Index Fund SIP (Mutual Funds)',
      amount: 10000,
      currency: 'INR',
      category: 'Investments',
      date: new Date(Date.now() - 22 * 86400000).toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      notes: 'Monthly automated wealth accumulation'
    }
  ]
};
