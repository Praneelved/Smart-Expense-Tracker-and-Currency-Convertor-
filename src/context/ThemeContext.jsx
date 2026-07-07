// ES6 - Theme Context with React Context API, localStorage, and system preference detection
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

// ES6 Custom hook (arrow function)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // ES6 - Arrow function to get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    const saved = localStorage.getItem('spendwise-theme');
    if (saved) return saved;
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('spendwise-theme', theme);
  }, [theme]);

  // ES6 - Toggle function using ternary
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const isDark = theme === 'dark';

  // ES6 - Spread/shorthand property
  const value = { theme, toggleTheme, isDark };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
