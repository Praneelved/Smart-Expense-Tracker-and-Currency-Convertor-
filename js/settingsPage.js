/**
 * SpendWise Settings & Data Governance Controller
 */

import { store } from './store.js';
import { currencyService } from './currencyService.js';
import { ExportUtils } from './exportUtils.js';
import { UI } from './ui.js';
import { CURRENCIES, STORAGE_KEYS } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  UI.init();
  initSettingsForm();
  initDataActions();
});

function initSettingsForm() {
  const currencySelect = document.getElementById('prefBaseCurrency');
  const themeSelect = document.getElementById('prefTheme');
  const form = document.getElementById('preferencesForm');

  const currentSettings = store.getSettings();
  const currentTheme = localStorage.getItem('spendwise_theme') || currentSettings.theme || 'system';

  // Populate Currencies
  Object.values(CURRENCIES).forEach(curr => {
    const opt = document.createElement('option');
    opt.value = curr.code;
    opt.textContent = `${curr.flag} ${curr.code} — ${curr.name} (${curr.symbol})`;
    if (curr.code === (currentSettings.baseCurrency || 'INR')) {
      opt.selected = true;
    }
    currencySelect.appendChild(opt);
  });

  // Pre-select Theme
  if (themeSelect) {
    themeSelect.value = currentTheme;
  }

  // Save Preferences
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newBase = currencySelect.value;
    const newTheme = themeSelect.value;

    store.updateSettings({
      baseCurrency: newBase,
      theme: newTheme
    });

    if (newTheme === 'system') {
      localStorage.removeItem('spendwise_theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('spendwise_theme', newTheme);
    }

    UI.showToast('Preferences updated successfully!', 'success');
  });
}

function initDataActions() {
  const btnExportJson = document.getElementById('btnExportJsonBackup');
  const inputImportJson = document.getElementById('settingsImportJson');
  const btnExportCsv = document.getElementById('btnExportCsvLedger');
  const btnLoadDemo = document.getElementById('btnSettingsLoadDemo');
  const btnClearAll = document.getElementById('btnSettingsClearAll');
  const btnPurgeCache = document.getElementById('btnPurgeRateCache');

  // JSON Export
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      ExportUtils.exportToJSON();
      UI.showToast('JSON backup downloaded', 'success');
    });
  }

  // JSON Import
  if (inputImportJson) {
    inputImportJson.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (confirm('Importing this file will merge or restore your financial transactions and budgets. Continue?')) {
        try {
          await ExportUtils.importFromJSONFile(file);
          UI.showToast('Backup restored successfully!', 'success');
        } catch (err) {
          UI.showToast(err.message, 'error');
        }
      }
      inputImportJson.value = '';
    });
  }

  // CSV Export
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      try {
        ExportUtils.exportToCSV(store.getExpenses(), store.getSalary());
        UI.showToast('CSV transaction report downloaded', 'success');
      } catch (err) {
        UI.showToast(err.message, 'error');
      }
    });
  }

  // Load Demo Data
  if (btnLoadDemo) {
    btnLoadDemo.addEventListener('click', () => {
      if (confirm('Load realistic 30-day demo transactions and monthly budget caps? This will replace current data.')) {
        store.loadDemoData();
        UI.showToast('Realistic demo data loaded successfully', 'success');
      }
    });
  }

  // Purge Rate Cache
  if (btnPurgeCache) {
    btnPurgeCache.addEventListener('click', () => {
      currencyService.cache = {};
      localStorage.removeItem(STORAGE_KEYS.RATES_CACHE);
      UI.showToast('Forex cache flushed. Fresh live rates will be requested.', 'info');
    });
  }

  // Clear All Data
  if (btnClearAll) {
    btnClearAll.addEventListener('click', () => {
      const verify = prompt('CAUTION: This will permanently purge your expenses, salary, and budgets. Type "DELETE" to confirm:');
      if (verify === 'DELETE') {
        store.clearAllData();
        UI.showToast('All data purged from local storage', 'warning');
      } else if (verify !== null) {
        UI.showToast('Purge cancelled (confirmation text did not match)', 'info');
      }
    });
  }
}
