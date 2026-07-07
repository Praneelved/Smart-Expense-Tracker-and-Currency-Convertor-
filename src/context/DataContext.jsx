// ES6 - Data Context for managing income, expenses, budgets using localStorage
// Demonstrates: Context API, useReducer, spread operator, destructuring, arrow functions
import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { getMonthYearKey } from '../utils/formatters';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

// ES6 - Action types (const)
const ACTIONS = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_BUDGETS: 'SET_BUDGETS',
  SET_BUDGET: 'SET_BUDGET',
  SET_PROFILE: 'SET_PROFILE',
};

// ES6 - Reducer with spread operator and computed property names
const dataReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case ACTIONS.ADD_TRANSACTION:
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case ACTIONS.SET_BUDGETS:
      return { ...state, budgets: action.payload };
    case ACTIONS.SET_BUDGET:
      return {
        ...state,
        budgets: { ...state.budgets, [action.payload.key]: action.payload.value },
      };
    case ACTIONS.SET_PROFILE:
      return { ...state, profile: { ...state.profile, ...action.payload } };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  transactions: [],
  budgets: {},
  profile: {
    name: 'User',
    email: '',
    currency: 'INR',
  },
};

// Load from localStorage (ES6 arrow)
const loadState = () => {
  try {
    const saved = localStorage.getItem('spendwise-data');
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
};

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, null, loadState);

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem('spendwise-data', JSON.stringify(state));
  }, [state]);

  // ===== Transaction CRUD (ES6 arrow functions) =====

  // ES6 - Generate unique ID using template literal + Date.now
  const generateId = () => `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
      amount: parseFloat(transaction.amount),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: newTransaction });
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    dispatch({
      type: ACTIONS.UPDATE_TRANSACTION,
      payload: { id, ...updates, amount: parseFloat(updates.amount) },
    });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
  }, []);

  // ===== Computed Values (ES6 filter, reduce, arrow functions) =====

  const incomeTransactions = useMemo(
    () => state.transactions.filter(t => t.type === 'income'),
    [state.transactions]
  );

  const expenseTransactions = useMemo(
    () => state.transactions.filter(t => t.type === 'expense'),
    [state.transactions]
  );

  const totalIncome = useMemo(
    () => incomeTransactions.reduce((sum, t) => sum + t.amount, 0),
    [incomeTransactions]
  );

  const totalExpenses = useMemo(
    () => expenseTransactions.reduce((sum, t) => sum + t.amount, 0),
    [expenseTransactions]
  );

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  // Get transactions for current month (ES6 arrow + filter)
  const getCurrentMonthTransactions = useCallback((type) => {
    const currentKey = getMonthYearKey();
    return state.transactions.filter(t => {
      const txnKey = getMonthYearKey(t.date);
      return txnKey === currentKey && (type ? t.type === type : true);
    });
  }, [state.transactions]);

  const currentMonthIncome = useMemo(
    () => getCurrentMonthTransactions('income').reduce((sum, t) => sum + t.amount, 0),
    [getCurrentMonthTransactions]
  );

  const currentMonthExpenses = useMemo(
    () => getCurrentMonthTransactions('expense').reduce((sum, t) => sum + t.amount, 0),
    [getCurrentMonthTransactions]
  );

  // ===== Budget Operations =====

  const setBudget = useCallback((monthKey, amount) => {
    dispatch({
      type: ACTIONS.SET_BUDGET,
      payload: { key: monthKey, value: parseFloat(amount) },
    });
  }, []);

  const getCurrentBudget = useCallback(() => {
    const key = getMonthYearKey();
    return state.budgets[key] || 0;
  }, [state.budgets]);

  // ===== Profile Operations =====

  const updateProfile = useCallback((updates) => {
    dispatch({ type: ACTIONS.SET_PROFILE, payload: updates });
  }, []);

  // ES6 - Spread into value object
  const value = {
    ...state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    incomeTransactions,
    expenseTransactions,
    totalIncome,
    totalExpenses,
    balance,
    currentMonthIncome,
    currentMonthExpenses,
    getCurrentMonthTransactions,
    setBudget,
    getCurrentBudget,
    updateProfile,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
