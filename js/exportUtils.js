/**
 * SpendWise Export & Data Management Utilities
 */

import { store } from './store.js';
import { FinancialAnalytics } from './analytics.js';

export class ExportUtils {
  /**
   * Export transactions as RFC 4180 compliant CSV
   */
  static exportToCSV(expenses, salary = 0) {
    if (!expenses || expenses.length === 0) {
      throw new Error('No expenses available to export');
    }

    const headers = ['Transaction ID', 'Date', 'Title', 'Category', 'Amount', 'Currency', 'Payment Method', 'Notes'];
    
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = expenses.map(exp => [
      escapeCsv(exp.id),
      escapeCsv(exp.date),
      escapeCsv(exp.title),
      escapeCsv(exp.category),
      exp.amount,
      escapeCsv(exp.currency || 'INR'),
      escapeCsv(exp.paymentMethod || 'UPI / PhonePe / GPay'),
      escapeCsv(exp.notes || '')
    ]);

    const totalSpent = FinancialAnalytics.getTotalSpent(expenses);
    const balance = salary - totalSpent;

    // Summary metadata rows
    const summaryRows = [
      [],
      ['Summary Metrics'],
      ['Total Transactions', expenses.length],
      ['Total Expenses (INR)', totalSpent],
      ['Recorded Salary (INR)', salary],
      ['Net Balance (INR)', balance],
      ['Exported At', new Date().toLocaleString('en-IN')]
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(',')),
      ...summaryRows.map(r => r.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SpendWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export full backup JSON
   */
  static exportToJSON() {
    const jsonStr = store.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SpendWise_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Import JSON backup from file input
   */
  static async importFromJSONFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          store.importJSON(content);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Generate an executive printable statement in a print window
   */
  static printFinancialStatement(expenses, salary, budget) {
    const totalSpent = FinancialAnalytics.getTotalSpent(expenses);
    const balance = salary - totalSpent;
    const catBreakdown = FinancialAnalytics.getCategoryBreakdown(expenses);
    const today = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const printHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SpendWise Financial Statement</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      padding: 40px;
      margin: 0;
      background: #ffffff;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand {
      font-size: 24px;
      font-weight: 800;
      color: #059669;
    }
    .brand-sub {
      font-size: 13px;
      color: #64748b;
    }
    .doc-meta {
      text-align: right;
      font-size: 13px;
      color: #64748b;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 36px;
    }
    .summary-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .summary-box .label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 4px;
    }
    .summary-box .val {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
    }
    h2 {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin: 28px 0 12px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 24px;
    }
    th {
      background: #f8fafc;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid #cbd5e1;
      color: #475569;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    .text-right { text-align: right; }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      background: #f1f5f9;
      color: #475569;
    }
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">SpendWise</div>
      <div class="brand-sub">Smart Expense & Financial Management Statement</div>
    </div>
    <div class="doc-meta">
      <div><strong>Date:</strong> ${today}</div>
      <div><strong>Report ID:</strong> RPT-${Date.now().toString(36).toUpperCase()}</div>
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-box">
      <div class="label">Monthly Salary</div>
      <div class="val" style="color:#059669;">₹${salary.toLocaleString('en-IN')}</div>
    </div>
    <div class="summary-box">
      <div class="label">Total Expenses</div>
      <div class="val" style="color:#dc2626;">₹${totalSpent.toLocaleString('en-IN')}</div>
    </div>
    <div class="summary-box">
      <div class="label">Net Balance</div>
      <div class="val" style="color:#2563eb;">₹${balance.toLocaleString('en-IN')}</div>
    </div>
  </div>

  <h2>Category Spending Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th class="text-right">Transactions</th>
        <th class="text-right">Total (₹)</th>
        <th class="text-right">Share (%)</th>
      </tr>
    </thead>
    <tbody>
      ${catBreakdown.map(c => `
        <tr>
          <td><strong>${c.category}</strong></td>
          <td class="text-right">${c.count}</td>
          <td class="text-right">₹${c.total.toLocaleString('en-IN')}</td>
          <td class="text-right">${c.percentage}%</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Transaction Ledger (${expenses.length} Records)</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Category</th>
        <th>Payment Method</th>
        <th class="text-right">Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${expenses.map(e => `
        <tr>
          <td>${e.date}</td>
          <td>${e.title}</td>
          <td><span class="badge">${e.category}</span></td>
          <td>${e.paymentMethod || 'UPI'}</td>
          <td class="text-right" style="font-weight:600; color:#dc2626;">₹${Number(e.amount).toLocaleString('en-IN')}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    SpendWise Personal Finance Engine &bull; Generated directly from client-side persistent storage &bull; Confidential
  </div>
</body>
</html>
    `;

    const printWin = window.open('', '_blank');
    if (!printWin) {
      throw new Error('Pop-up window blocked by browser. Please allow pop-ups for this site.');
    }
    printWin.document.write(printHtml);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
    }, 300);
  }
}
