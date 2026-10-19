/**
 * SpendWise Currency Service - Live Exchange Rates with Caching & Offline Resilience
 */

import { STORAGE_KEYS } from './constants.js';

// Verified reference rates (ECB / OpenExchange snapshot) for graceful offline operation
const OFFLINE_REFERENCE_MATRIX = {
  base: 'USD',
  date: '2025-01-15',
  rates: {
    USD: 1.0,
    INR: 86.45,
    EUR: 0.962,
    GBP: 0.812,
    AED: 3.6725,
    JPY: 154.2,
    SGD: 1.348,
    CAD: 1.415,
    AUD: 1.582,
    CHF: 0.908
  }
};

class CurrencyService {
  constructor() {
    this.cache = this.loadCache();
    this.cacheDurationMs = 60 * 60 * 1000; // 1 hour cache duration
  }

  loadCache() {
    try {
      if (typeof localStorage === 'undefined') return {};
      const stored = localStorage.getItem(STORAGE_KEYS.RATES_CACHE);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  saveCache() {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEYS.RATES_CACHE, JSON.stringify(this.cache));
    } catch (e) {
      console.warn('Failed to save exchange rate cache:', e);
    }
  }

  /**
   * Fetch exchange rates for a base currency
   * Strategy:
   * 1. Check in-memory / localStorage cache (valid for 1 hour)
   * 2. Try Open Exchange Rates API (https://open.er-api.com/v6/latest/{base})
   * 3. Fallback to Frankfurter API (https://api.frankfurter.dev/v1/latest?from={base})
   * 4. Fallback to cached rates if expired
   * 5. Fallback to offline reference matrix if no network and no cache
   */
  async getRates(base = 'USD') {
    const baseCode = base.toUpperCase();
    const now = Date.now();

    // 1. Check cache validity
    if (this.cache[baseCode] && now - this.cache[baseCode].timestamp < this.cacheDurationMs) {
      return {
        rates: this.cache[baseCode].rates,
        base: baseCode,
        timestamp: this.cache[baseCode].timestamp,
        date: this.cache[baseCode].date,
        status: 'cached',
        attribution: 'Cached from Open Exchange API'
      };
    }

    // 2. Fetch from Open Exchange Rates API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const res = await fetch(`https://open.er-api.com/v6/latest/${baseCode}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data && data.rates && typeof data.rates === 'object') {
        const ratePayload = {
          rates: data.rates,
          timestamp: now,
          date: data.time_last_update_utc || new Date().toUTCString(),
          provider: 'Open Exchange Rates (open.er-api.com)'
        };
        this.cache[baseCode] = ratePayload;
        this.saveCache();

        return {
          rates: data.rates,
          base: baseCode,
          timestamp: now,
          date: ratePayload.date,
          status: 'live',
          attribution: 'Live via Open Exchange Rates API'
        };
      }
    } catch (apiError) {
      console.warn(`Primary currency API failed for ${baseCode}, trying fallback:`, apiError.message);
    }

    // 3. Fallback to Frankfurter API if supported
    try {
      const frankfurterController = new AbortController();
      const timeout = setTimeout(() => frankfurterController.abort(), 5000);
      const fRes = await fetch(`https://api.frankfurter.dev/v1/latest?from=${baseCode}`, {
        signal: frankfurterController.signal
      });
      clearTimeout(timeout);

      if (fRes.ok) {
        const fData = await fRes.json();
        const combinedRates = { ...fData.rates, [baseCode]: 1.0 };
        this.cache[baseCode] = {
          rates: combinedRates,
          timestamp: now,
          date: fData.date,
          provider: 'Frankfurter (ECB data)'
        };
        this.saveCache();

        return {
          rates: combinedRates,
          base: baseCode,
          timestamp: now,
          date: fData.date,
          status: 'live',
          attribution: 'Live via European Central Bank (Frankfurter API)'
        };
      }
    } catch (fallbackError) {
      console.warn('Fallback currency API also failed:', fallbackError.message);
    }

    // 4. If network failed, check if we have ANY expired cache for this base
    if (this.cache[baseCode]) {
      return {
        rates: this.cache[baseCode].rates,
        base: baseCode,
        timestamp: this.cache[baseCode].timestamp,
        date: this.cache[baseCode].date,
        status: 'cached',
        attribution: 'Offline Cache (Rate from previous online session)'
      };
    }

    // 5. Ultimate fallback: Compute cross-rates from OFFLINE_REFERENCE_MATRIX
    const usdRates = OFFLINE_REFERENCE_MATRIX.rates;
    const baseToUsd = usdRates[baseCode] ? 1 / usdRates[baseCode] : 1;
    const crossRates = {};

    Object.keys(usdRates).forEach(curr => {
      crossRates[curr] = usdRates[curr] * baseToUsd;
    });

    return {
      rates: crossRates,
      base: baseCode,
      timestamp: now,
      date: OFFLINE_REFERENCE_MATRIX.date,
      status: 'fallback',
      attribution: 'Offline Verified Reference Snapshot'
    };
  }

  /**
   * Convert an amount between two currencies
   */
  async convert(amount, from, to) {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      throw new Error('Please enter a valid amount');
    }

    const fromCode = from.toUpperCase();
    const toCode = to.toUpperCase();

    if (fromCode === toCode) {
      return {
        originalAmount: numAmount,
        convertedAmount: numAmount,
        rate: 1.0,
        from: fromCode,
        to: toCode,
        status: 'live',
        date: new Date().toISOString(),
        attribution: 'Same currency'
      };
    }

    const rateResult = await this.getRates(fromCode);
    const targetRate = rateResult.rates[toCode];

    if (!targetRate) {
      throw new Error(`Exchange rate for ${toCode} not available`);
    }

    const converted = Math.round(numAmount * targetRate * 100) / 100;

    return {
      originalAmount: numAmount,
      convertedAmount: converted,
      rate: targetRate,
      from: fromCode,
      to: toCode,
      status: rateResult.status,
      date: rateResult.date,
      attribution: rateResult.attribution
    };
  }
}

export const currencyService = new CurrencyService();
