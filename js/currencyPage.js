/**
 * SpendWise Currency Converter Page Controller
 */

import { currencyService } from './currencyService.js';
import { UI } from './ui.js';
import { CURRENCIES } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  initCurrencyDropdowns();
  initConverter();
  initMatrix();
});

function initCurrencyDropdowns() {
  const fromSelect = document.getElementById('fromCurrencySelect');
  const toSelect = document.getElementById('toCurrencySelect');

  Object.values(CURRENCIES).forEach(curr => {
    const optFrom = document.createElement('option');
    optFrom.value = curr.code;
    optFrom.textContent = `${curr.flag} ${curr.code} — ${curr.name}`;
    if (curr.code === 'USD') optFrom.selected = true;
    fromSelect.appendChild(optFrom);

    const optTo = document.createElement('option');
    optTo.value = curr.code;
    optTo.textContent = `${curr.flag} ${curr.code} — ${curr.name}`;
    if (curr.code === 'INR') optTo.selected = true;
    toSelect.appendChild(optTo);
  });
}

function initConverter() {
  const amountInput = document.getElementById('currencyAmount');
  const fromSelect = document.getElementById('fromCurrencySelect');
  const toSelect = document.getElementById('toCurrencySelect');
  const swapBtn = document.getElementById('btnSwapCurrencies');
  const refreshBtn = document.getElementById('btnRefreshRates');
  const presetButtons = document.querySelectorAll('.btn-preset-amt');

  // Debounced conversion trigger
  let debounceTimer;
  const triggerConversion = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(executeConversion, 120);
  };

  amountInput.addEventListener('input', triggerConversion);
  fromSelect.addEventListener('change', triggerConversion);
  toSelect.addEventListener('change', triggerConversion);

  // Preset button clicks
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountInput.value = btn.getAttribute('data-val');
      triggerConversion();
    });
  });

  // Swap currencies
  swapBtn.addEventListener('click', () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    // Trigger animation
    swapBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => {
      swapBtn.style.transform = '';
    }, 300);

    triggerConversion();
  });

  // Copy result action
  const copyBtn = document.getElementById('btnCopyResult');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const finalValEl = document.getElementById('convertedFinalAmount');
      const val = finalValEl ? finalValEl.textContent.trim() : '';
      if (!val || val === '--' || val === 'Error') {
        UI.showToast('No valid converted value to copy', 'warning');
        return;
      }
      try {
        await navigator.clipboard.writeText(val);
        UI.showToast(`Copied ${val} to clipboard!`, 'success');
      } catch (e) {
        // Fallback for older browsers
        const tempInp = document.createElement('input');
        tempInp.value = val;
        document.body.appendChild(tempInp);
        tempInp.select();
        document.execCommand('copy');
        document.body.removeChild(tempInp);
        UI.showToast(`Copied ${val} to clipboard!`, 'success');
      }
    });
  }

  // Force refresh
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      UI.showToast('Fetching latest market rates from live API...', 'info');
      // Invalidate cache for current base
      const base = fromSelect.value;
      delete currencyService.cache[base];
      currencyService.saveCache();
      await executeConversion();
      await initMatrix();
      UI.showToast('Rates successfully refreshed', 'success');
    });
  }

  // Initial conversion
  executeConversion();
}

async function executeConversion() {
  const amountInput = document.getElementById('currencyAmount');
  const fromSelect = document.getElementById('fromCurrencySelect');
  const toSelect = document.getElementById('toCurrencySelect');

  const rateTextEl = document.getElementById('primaryExchangeRateText');
  const finalValEl = document.getElementById('convertedFinalAmount');
  const inverseTextEl = document.getElementById('inverseExchangeRateText');
  const attributionEl = document.getElementById('rateAttribution');
  const statusBadge = document.getElementById('apiStatusBadge');
  const statusText = document.getElementById('apiStatusText');

  const amount = Number(amountInput.value) || 0;
  const from = fromSelect.value;
  const to = toSelect.value;

  if (amount <= 0) {
    finalValEl.textContent = '--';
    rateTextEl.textContent = 'Please enter an amount greater than zero';
    inverseTextEl.textContent = '';
    return;
  }

  rateTextEl.textContent = 'Consulting live exchange rates...';

  try {
    const res = await currencyService.convert(amount, from, to);
    
    // Format primary rate
    rateTextEl.textContent = `1 ${from} = ${res.rate.toFixed(4)} ${to}`;
    
    // Converted sum
    finalValEl.textContent = UI.formatCurrency(res.convertedAmount, to);

    // Inverse rate
    const inverse = res.rate > 0 ? (1 / res.rate).toFixed(4) : 0;
    inverseTextEl.textContent = `1 ${to} = ${inverse} ${from}`;

    // Attribution & Freshness
    attributionEl.textContent = `${res.attribution} &bull; ${new Date(res.date).toLocaleDateString('en-IN')}`;

    if (statusBadge && statusText) {
      if (res.status === 'live') {
        statusBadge.className = 'badge badge-primary';
        statusText.textContent = 'Live Market Feed (ECB/OpenER)';
      } else if (res.status === 'cached') {
        statusBadge.className = 'badge badge-warning';
        statusText.textContent = 'Cached Rates Active';
      } else {
        statusBadge.className = 'badge badge-subtle';
        statusText.textContent = 'Verified Offline Reference';
      }
    }

    renderCheatSheet(res.rate, from, to);
  } catch (err) {
    rateTextEl.textContent = 'Failed to fetch conversion rate';
    finalValEl.textContent = 'Error';
    inverseTextEl.textContent = err.message;
  }
}

function renderCheatSheet(rate, from, to) {
  const tbody = document.getElementById('cheatSheetBody');
  const thFrom = document.getElementById('thCheatFrom');
  const thTo = document.getElementById('thCheatTo');
  const subTitle = document.getElementById('cheatSheetSubtitle');

  if (!tbody) return;

  if (thFrom) thFrom.textContent = `${from} Units`;
  if (thTo) thTo.textContent = `Equivalent ${to}`;
  if (subTitle) subTitle.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;

  const intervals = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
  let html = '';

  intervals.forEach(val => {
    const converted = Math.round(val * rate * 100) / 100;
    html += `
      <tr>
        <td style="font-weight:600; color:var(--text-primary);">${val.toLocaleString()} ${from}</td>
        <td class="num-tabular" style="text-align:right; font-weight:700; color:var(--color-primary);">
          ${UI.formatCurrency(converted, to)}
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

async function initMatrix() {
  const tbody = document.getElementById('marketMatrixBody');
  if (!tbody) return;

  try {
    const usdRates = await currencyService.getRates('USD');
    const inrRate = usdRates.rates['INR'] || 86.45;

    const major = ['USD', 'EUR', 'GBP', 'AED', 'JPY', 'CAD', 'AUD', 'SGD', 'CHF'];
    let html = '';

    major.forEach(curr => {
      const currToUsdRate = usdRates.rates[curr] || 1;
      // 1 Unit of curr in INR = inrRate / currToUsdRate
      const oneUnitInInr = inrRate / currToUsdRate;
      // 1000 INR in curr = 1000 / oneUnitInInr
      const thousandInrInCurr = 1000 / oneUnitInInr;

      const flag = CURRENCIES[curr]?.flag || '';

      html += `
        <tr>
          <td>
            <div style="font-weight:600; color:var(--text-primary);">${flag} ${curr}</div>
            <div style="font-size:0.75rem; color:var(--text-tertiary);">${CURRENCIES[curr]?.name || ''}</div>
          </td>
          <td class="num-tabular" style="text-align:right; font-weight:700; color:var(--text-primary);">
            ₹${oneUnitInInr.toFixed(2)}
          </td>
          <td class="num-tabular" style="text-align:right; color:var(--text-secondary);">
            ${thousandInrInCurr.toFixed(2)} ${curr}
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  } catch (err) {
    console.warn('Matrix render error:', err);
  }
}
