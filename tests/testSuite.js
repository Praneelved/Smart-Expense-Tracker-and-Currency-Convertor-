/**
 * Automated Unit & Integration Test Suite for SpendWise
 * Run with: npm test
 */

import assert from 'node:assert';

// Mock localStorage for Node environment if not present
if (typeof globalThis.localStorage === 'undefined') {
  const memoryStore = {};
  globalThis.localStorage = {
    getItem: (key) => memoryStore[key] || null,
    setItem: (key, val) => { memoryStore[key] = String(val); },
    removeItem: (key) => { delete memoryStore[key]; },
    clear: () => { Object.keys(memoryStore).forEach(k => delete memoryStore[k]); }
  };
}

import { FinancialAnalytics } from '../js/analytics.js';
import { currencyService } from '../js/currencyService.js';
import { store } from '../js/store.js';

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${description}`);
    console.error(`    ${err.message}`);
  }
}

async function runAllTests() {
  console.log('\n======================================================');
  console.log('🧪 Starting SpendWise Automated Verification Suite');
  console.log('======================================================\n');

  console.log('--- 1. Precision Financial Arithmetic & Calculation Tests ---');

  test('Decimal safety: accurately sums floating point currency values', () => {
    const expenses = [
      { amount: 0.1 },
      { amount: 0.2 }
    ];
    const total = FinancialAnalytics.getTotalSpent(expenses);
    assert.strictEqual(total, 0.3, `Expected 0.3 but got ${total}`);
  });

  test('Multi-item currency precision with cents rounding', () => {
    const expenses = [
      { amount: 10.99 },
      { amount: 20.01 },
      { amount: 0.05 },
      { amount: 100.45 }
    ];
    const total = FinancialAnalytics.getTotalSpent(expenses);
    assert.strictEqual(total, 131.50, `Expected 131.50 but got ${total}`);
  });

  test('Empty dataset handling returns 0 without crashing', () => {
    assert.strictEqual(FinancialAnalytics.getTotalSpent([]), 0);
    assert.strictEqual(FinancialAnalytics.getTotalSpent(null), 0);
  });

  console.log('\n--- 2. Budget Health & Warning Threshold Tests ---');

  test('Zero budget handled safely without NaN or invalid percentages', () => {
    const health = FinancialAnalytics.calculateBudgetHealth(2500, 0);
    assert.strictEqual(health.hasBudget, false);
    assert.strictEqual(health.utilizationPct, 0);
    assert.strictEqual(health.status, 'none');
  });

  test('Safe budget status below 75% utilization', () => {
    const health = FinancialAnalytics.calculateBudgetHealth(5000, 10000);
    assert.strictEqual(health.hasBudget, true);
    assert.strictEqual(health.utilizationPct, 50);
    assert.strictEqual(health.remaining, 5000);
    assert.strictEqual(health.status, 'safe');
  });

  test('Warning status between 75% and 90% utilization', () => {
    const health = FinancialAnalytics.calculateBudgetHealth(8000, 10000);
    assert.strictEqual(health.utilizationPct, 80);
    assert.strictEqual(health.status, 'warning');
  });

  test('Danger status between 90% and 100% utilization', () => {
    const health = FinancialAnalytics.calculateBudgetHealth(9500, 10000);
    assert.strictEqual(health.utilizationPct, 95);
    assert.strictEqual(health.status, 'danger');
  });

  test('Exceeded status above 100% with negative remaining calculation', () => {
    const health = FinancialAnalytics.calculateBudgetHealth(12500, 10000);
    assert.strictEqual(health.utilizationPct, 125);
    assert.strictEqual(health.remaining, -2500);
    assert.strictEqual(health.status, 'exceeded');
  });

  console.log('\n--- 3. Category Breakdown & Period Filtering Tests ---');

  test('Correct category grouping and percentage distribution', () => {
    const sample = [
      { category: 'Food', amount: 2000 },
      { category: 'Food', amount: 2000 },
      { category: 'Transportation', amount: 6000 }
    ];
    const breakdown = FinancialAnalytics.getCategoryBreakdown(sample);
    assert.strictEqual(breakdown.length, 2);
    assert.strictEqual(breakdown[0].category, 'Transportation'); // 6000 is highest
    assert.strictEqual(breakdown[0].total, 6000);
    assert.strictEqual(breakdown[0].percentage, 60);
    assert.strictEqual(breakdown[1].category, 'Food');
    assert.strictEqual(breakdown[1].total, 4000);
    assert.strictEqual(breakdown[1].count, 2);
    assert.strictEqual(breakdown[1].percentage, 40);
  });

  console.log('\n--- 4. Store State Management & Validation Tests ---');

  test('Expense validation: rejects empty titles or invalid amounts', () => {
    assert.throws(() => {
      store.addExpense({ title: '', amount: 100, date: '2026-01-01' });
    }, /required/);

    assert.throws(() => {
      store.addExpense({ title: 'Coffee', amount: -50, date: '2026-01-01' });
    }, /positive/);

    assert.throws(() => {
      store.addExpense({ title: 'Coffee', amount: 'abc', date: '2026-01-01' });
    }, /positive/);
  });

  test('Store CRUD: successfully adds, updates, and deletes transactions', () => {
    const added = store.addExpense({
      title: 'Espresso',
      amount: 150,
      date: '2026-02-15',
      category: 'Food',
      paymentMethod: 'UPI'
    });
    assert.ok(added.id, 'Transaction must receive a unique ID');

    const updated = store.updateExpense(added.id, {
      amount: 180,
      notes: 'Double shot'
    });
    assert.strictEqual(updated.amount, 180);
    assert.strictEqual(updated.notes, 'Double shot');

    const deleted = store.deleteExpense(added.id);
    assert.strictEqual(deleted, true);
    assert.strictEqual(store.getExpenses().some(e => e.id === added.id), false);
  });

  console.log('\n--- 5. Currency Converter Service Tests ---');

  await (async () => {
    totalTests++;
    try {
      const sameCurrency = await currencyService.convert(100, 'USD', 'USD');
      assert.strictEqual(sameCurrency.convertedAmount, 100);
      assert.strictEqual(sameCurrency.rate, 1.0);
      console.log('  \x1b[32m✔ PASS\x1b[0m: Same currency conversion returns exact 1.0 rate');
      passedTests++;
    } catch (e) {
      console.error('  \x1b[31m✖ FAIL\x1b[0m: Same currency conversion:', e.message);
    }
  })();

  await (async () => {
    totalTests++;
    try {
      const conv = await currencyService.convert(100, 'USD', 'INR');
      assert.ok(conv.convertedAmount > 0, 'Converted amount must be positive');
      assert.ok(conv.rate > 0, 'Exchange rate must be positive');
      assert.ok(['live', 'cached', 'fallback'].includes(conv.status), 'Status must be transparently declared');
      console.log(`  \x1b[32m✔ PASS\x1b[0m: Multi-currency conversion returned ${conv.convertedAmount} INR (Rate: ${conv.rate}, Status: ${conv.status})`);
      passedTests++;
    } catch (e) {
      console.error('  \x1b[31m✖ FAIL\x1b[0m: Multi-currency conversion:', e.message);
    }
  })();

  console.log('\n--- 6. JSON Export & Backup Validation Tests ---');

  test('JSON backup export and import integrity test', () => {
    const exportedStr = store.exportJSON();
    assert.ok(exportedStr.includes('version'), 'Backup must contain schema version');

    // Test import validation
    assert.doesNotThrow(() => {
      store.importJSON(exportedStr);
    });

    // Test corrupted JSON rejection
    assert.throws(() => {
      store.importJSON('{ malformed json ...');
    });
  });

  console.log('\n======================================================');
  console.log(`🏁 Test Results: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAllTests();
