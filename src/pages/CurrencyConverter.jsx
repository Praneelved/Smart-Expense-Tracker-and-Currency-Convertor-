// ES6 - Currency Converter using Frankfurter API with fetch + async/await
// Demonstrates: async/await, fetch API, try/catch, destructuring, template literals, arrow functions
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeftRight, RefreshCw, TrendingUp, Clock, Globe } from 'lucide-react';
import { CURRENCIES } from '../utils/constants';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [historicalRates, setHistoricalRates] = useState([]);

  // ES6 - Async/await with fetch API for currency conversion
  const convertCurrency = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      // ES6 - Template literal for URL construction
      const url = `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;

      // ES6 - fetch with async/await
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // ES6 - Destructuring the JSON response
      const data = await response.json();
      const { rates, date } = data;
      const convertedAmount = rates[toCurrency];

      setResult(convertedAmount);
      setRate(convertedAmount / parseFloat(amount));
      setLastUpdated(date);

      // Fetch historical rates for last 7 days
      await fetchHistoricalRates();

    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to fetch exchange rates. Please try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  // ES6 - Async function to fetch historical rates
  const fetchHistoricalRates = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      // ES6 - Template literals for date formatting
      const start = startDate.toISOString().slice(0, 10);
      const end = endDate.toISOString().slice(0, 10);

      const url = `https://api.frankfurter.dev/v1/${start}..${end}?from=${fromCurrency}&to=${toCurrency}`;
      const response = await fetch(url);
      const data = await response.json();

      // ES6 - Object.entries + map to transform data
      const rates = Object.entries(data.rates).map(([date, rateObj]) => ({
        date,
        rate: rateObj[toCurrency],
      }));

      setHistoricalRates(rates);
    } catch (error) {
      console.error('Historical rates error:', error);
    }
  };

  // Auto-convert on mount and when currencies change
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency]);

  // ES6 - Arrow function to swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // ES6 - Helper to get currency info
  const getCurrencyInfo = (code) => CURRENCIES.find(c => c.code === code) || { flag: '🌍', name: code, symbol: code };

  const fromInfo = getCurrencyInfo(fromCurrency);
  const toInfo = getCurrencyInfo(toCurrency);

  // Popular pairs for quick conversion
  const popularPairs = [
    { from: 'USD', to: 'INR' },
    { from: 'EUR', to: 'INR' },
    { from: 'GBP', to: 'INR' },
    { from: 'USD', to: 'EUR' },
    { from: 'JPY', to: 'INR' },
    { from: 'AUD', to: 'INR' },
  ];

  return (
    <div className="container py-4">
      <div className="page-header">
        <h1><ArrowLeftRight size={28} style={{ color: 'var(--primary)', marginRight: 8 }} />Currency Converter</h1>
        <p>Convert between 150+ currencies using live ECB exchange rates</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Main Converter Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="converter-card mb-4"
          >
            <div className="row g-3 align-items-end">
              {/* Amount */}
              <div className="col-md-3">
                <label className="form-label-custom">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-control form-control-custom"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  style={{ fontSize: '1.1rem', fontWeight: 600 }}
                />
              </div>

              {/* From Currency */}
              <div className="col-md-3">
                <label className="form-label-custom">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="form-select form-select-custom"
                >
                  {CURRENCIES.map(({ code, name, flag }) => (
                    <option key={code} value={code}>{flag} {code} - {name}</option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="col-md-2 text-center">
                <button className="swap-btn mx-auto" onClick={handleSwap} title="Swap currencies">
                  <ArrowLeftRight size={20} />
                </button>
              </div>

              {/* To Currency */}
              <div className="col-md-3">
                <label className="form-label-custom">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="form-select form-select-custom"
                >
                  {CURRENCIES.map(({ code, name, flag }) => (
                    <option key={code} value={code}>{flag} {code} - {name}</option>
                  ))}
                </select>
              </div>

              {/* Convert Button */}
              <div className="col-12 mt-3">
                <button
                  className="btn-gradient w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={convertCurrency}
                  disabled={loading}
                  style={{ padding: '12px' }}
                >
                  {loading ? (
                    <><RefreshCw size={18} className="spin" /> Converting...</>
                  ) : (
                    <><ArrowLeftRight size={18} /> Convert</>
                  )}
                </button>
              </div>
            </div>

            {/* Result */}
            {result !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-3 text-center"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 4 }}>
                  {fromInfo.flag} {parseFloat(amount).toLocaleString()} {fromCurrency} =
                </div>
                <h2 className="gradient-text fw-bold mb-1" style={{ fontSize: '2rem' }}>
                  {toInfo.flag} {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {toCurrency}
                </h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}
                </div>
                {lastUpdated && (
                  <div className="d-flex align-items-center justify-content-center gap-1 mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Clock size={12} /> Rates as of {lastUpdated}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Historical Rates */}
          {historicalRates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-static p-4"
            >
              <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp size={18} className="me-2" style={{ color: 'var(--primary)' }} />
                7-Day Rate History ({fromCurrency} → {toCurrency})
              </h6>
              <div className="table-responsive">
                <table className="table table-borderless mb-0" style={{ color: 'var(--text-primary)' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <th style={{ fontWeight: 500, border: 'none' }}>Date</th>
                      <th style={{ fontWeight: 500, border: 'none', textAlign: 'right' }}>Rate</th>
                      <th style={{ fontWeight: 500, border: 'none', textAlign: 'right' }}>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalRates.map((item, i) => {
                      const prevRate = i > 0 ? historicalRates[i - 1].rate : item.rate;
                      const change = item.rate - prevRate;
                      const changePercent = prevRate > 0 ? ((change / prevRate) * 100).toFixed(3) : '0.000';

                      return (
                        <tr key={item.date} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ fontSize: '0.85rem', padding: '10px 0', border: 'none' }}>
                            {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </td>
                          <td style={{ fontSize: '0.85rem', textAlign: 'right', fontWeight: 600, border: 'none', padding: '10px 0' }}>
                            {item.rate.toFixed(4)}
                          </td>
                          <td style={{ fontSize: '0.8rem', textAlign: 'right', border: 'none', padding: '10px 0' }}>
                            <span style={{ color: change >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                              {change >= 0 ? '▲' : '▼'} {changePercent}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Popular Pairs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card-static p-4 mb-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              🔥 Popular Pairs
            </h6>
            {popularPairs.map(({ from, to }) => {
              const fromI = getCurrencyInfo(from);
              const toI = getCurrencyInfo(to);
              return (
                <button
                  key={`${from}-${to}`}
                  className="d-flex align-items-center gap-2 w-100 mb-2 p-2 rounded-3 border-0"
                  style={{
                    background: from === fromCurrency && to === toCurrency ? 'rgba(var(--primary-rgb), 0.1)' : 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.85rem',
                    textAlign: 'left',
                  }}
                  onClick={() => { setFromCurrency(from); setToCurrency(to); }}
                >
                  <span>{fromI.flag}</span>
                  <span className="fw-medium">{from}</span>
                  <ArrowLeftRight size={14} style={{ color: 'var(--text-muted)' }} />
                  <span>{toI.flag}</span>
                  <span className="fw-medium">{to}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card-static p-4"
          >
            <h6 className="fw-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              <Globe size={18} className="me-2" style={{ color: 'var(--primary)' }} />
              About Exchange Rates
            </h6>
            <ul className="list-unstyled mb-0">
              {[
                'Rates sourced from European Central Bank (ECB)',
                'Updated daily on business days',
                'Supports 30+ world currencies',
                'Free API powered by Frankfurter',
                'Data fetched using ES6 async/await & fetch API',
              ].map((item, i) => (
                <li key={i} className="d-flex gap-2 mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
