// ES6 Constants - Expense and Income categories with colors and icons
export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', color: '#ef4444', icon: '🍔' },
  { id: 'transport', label: 'Transport', color: '#f59e0b', icon: '🚗' },
  { id: 'shopping', label: 'Shopping', color: '#ec4899', icon: '🛍️' },
  { id: 'entertainment', label: 'Entertainment', color: '#8b5cf6', icon: '🎬' },
  { id: 'bills', label: 'Bills & Utilities', color: '#06b6d4', icon: '💡' },
  { id: 'health', label: 'Health', color: '#10b981', icon: '🏥' },
  { id: 'education', label: 'Education', color: '#6366f1', icon: '📚' },
  { id: 'rent', label: 'Rent', color: '#64748b', icon: '🏠' },
  { id: 'other', label: 'Other', color: '#94a3b8', icon: '📦' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', color: '#10b981', icon: '💰' },
  { id: 'freelance', label: 'Freelance', color: '#6366f1', icon: '💻' },
  { id: 'investment', label: 'Investment', color: '#f59e0b', icon: '📈' },
  { id: 'business', label: 'Business', color: '#8b5cf6', icon: '🏢' },
  { id: 'gift', label: 'Gift', color: '#ec4899', icon: '🎁' },
  { id: 'other', label: 'Other', color: '#94a3b8', icon: '📦' },
];

// Popular currencies for converter
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to get category by id
export const getCategoryById = (categories, id) => {
  return categories.find(cat => cat.id === id) || categories[categories.length - 1];
};
