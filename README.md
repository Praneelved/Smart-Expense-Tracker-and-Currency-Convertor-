# 💰 SpendWise — Executive Smart Expense Tracker & Currency Hub

> **A high-performance, privacy-first personal finance command center featuring real-time foreign exchange valuation, category budget management, and interactive analytics.**

[![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passing%20(100%25)-10b981?style=for-the-badge&logo=checkmarx)](tests/testSuite.js)
[![Architecture](https://img.shields.io/badge/Architecture-Vanilla%20ES6%2B%20Modular-3b82f6?style=for-the-badge&logo=javascript)](about.html)
[![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=for-the-badge)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Deployment-GitHub%20Pages-059669?style=for-the-badge&logo=github)](https://praneelved.github.io/Smart-Expense-Tracker-and-Currency-Convertor-/)

---

## 🌟 Project Overview

**SpendWise** is a production-quality, client-side financial management web application developed to eliminate personal finance blind spots. Built without heavyweight framework bloat or invasive tracking, it provides individuals and freelancers with an executive dashboard to record multi-currency expenses, monitor budget utilization in real time, analyze cash flows, and convert world currencies using live European Central Bank (ECB) and Open Exchange Rates market feeds.

Originally conceived as a college micro-project for **Web Technologies II**, this upgraded version has been completely re-architected into a modular, production-ready fintech dashboard engineered with strict software development standards.

### 🔗 Quick Links
- **Live Application**: [https://praneelved.github.io/Smart-Expense-Tracker-and-Currency-Convertor-/](https://praneelved.github.io/Smart-Expense-Tracker-and-Currency-Convertor-/)
- **Source Repository**: [https://github.com/Praneelved/Smart-Expense-Tracker-and-Currency-Convertor-](https://github.com/Praneelved/Smart-Expense-Tracker-and-Currency-Convertor-)

---

## 📸 Screenshots & Visual Tour

| Executive Financial Dashboard | Expense & Budget Ledger |
| :---: | :---: |
| *[Screenshot Placeholder: Dashboard with 30-Day Trajectory Chart, Metric Cards & Live FX Ticker]* | *[Screenshot Placeholder: Expense Management Suite with Search, Filters & Category Budget Modal]* |

| Real-Time Currency Converter Studio | Interactive Financial Analytics |
| :---: | :---: |
| *[Screenshot Placeholder: Currency Converter with Live Rates, Cheat-Sheet & Exchange Matrix]* | *[Screenshot Placeholder: 4-Chart Analytical Grid with Budget vs Actual & Cashflow Comparison]* |

---

## ✨ Comprehensive Feature Matrix

### 1. 📊 Executive Financial Dashboard (`index.html`)
- **Live Market Forex Ticker**: Real-time cross rates for USD/INR, EUR/INR, GBP/INR, and AED/INR with live pulse status.
- **Top-Line KPI Metric Cards**:
  - Net monthly expenditure with transaction count metadata.
  - Baseline monthly salary inflow with instant configuration.
  - Remaining surplus/deficit balance color-coded dynamically.
  - Budget utilization percentage with responsive status progression (Safe, Warning, Danger, Exceeded).
- **30-Day Spending Trajectory Chart**: Interactive curved area spline chart tracking daily cash burn.
- **Category Expense Allocation**: Doughnut chart illustrating percentage distribution across functional categories.
- **Recent Transactions Ledger**: Quick-view ledger with instant record deletion.
- **Dynamic Financial Insights**: Algorithmic assessment of spending velocity, burn rate, and projected month-end totals.
- **Quick Currency Converter Widget**: In-place currency calculator embedded on the dashboard.

### 2. 💳 Expense & Budget Management Suite (`expense.html`)
- **Full CRUD Capabilities**: Add, edit, delete, and inspect transaction details.
- **Schema Fields**: Unique ID, Merchant/Title, Amount, Currency, Category, Transaction Date, Payment Method, and Notes.
- **Robust Input Validation**: Strict client-side validation rejecting empty descriptions, non-positive numbers, and malformed dates.
- **Advanced Filtering & Search**:
  - Live search across titles, merchants, and notes.
  - Category dropdown filter (Food, Shopping, Transportation, Medical, Entertainment, Bills, Education, Investments, Other).
  - Payment method filter (UPI, Credit Card, Debit Card, Net Banking, Cash).
  - Date period filter (All Time, This Month, Last Month, Last 30 Days, This Year).
  - Multi-criteria sorting (Date desc/asc, Amount desc/asc, Title A-Z).
  - Clean pagination with selectable page navigation.
- **Monthly Budgeting & Category Caps**:
  - Set overall monthly spending budget.
  - Set category-specific budget ceilings with visual warning thresholds (75% warning, 90% danger, 100%+ exceeded).
- **Multi-Format Export & Backup**:
  - **RFC 4180 Compliant CSV Export**: With metadata, proper escaping, and financial summaries.
  - **Executive Printable Statement**: Invoice-grade printable financial statement.
  - **JSON Backup & Restore**: Full local backup export and validated JSON file restoration.
  - **Destructive Action Confirmation**: Safe deletion dialogs and one-click demo data loading.

### 3. 💱 Global Currency Exchange Studio (`currency.html`)
- **Dual Live API Strategy**: Primary queries Open Exchange Rates API (`open.er-api.com`), with fallback to the European Central Bank (ECB) via Frankfurter API.
- **3-Tier Resiliency Architecture**:
  1. *Live Market Feed*: Fetches real-time market rates.
  2. *Persistent Cache*: Caches valid rate responses in `localStorage` for 1 hour to prevent redundant requests.
  3. *Offline Verified Reference Matrix*: Gracefully computes cross-rates if the client is completely offline without network connectivity.
- **Transparent Attribution**: Distinctly declares whether rates are **LIVE**, **CACHED**, or **OFFLINE REFERENCE** with exact timestamps.
- **Interactive Currency Swapper**: Animated 180° rotation swapping source and target currencies.
- **Quick Conversion Cheat-Sheet**: Instant conversion table for 1, 5, 10, 50, 100, 500, and 1,000 units.
- **Major Currencies Matrix**: Live comparison table of 9 major global currencies against INR.

### 4. 📈 Financial Analytics & Visualizations (`analytics.html`)
- **Analytical Metrics**: Average daily burn rate, projected month-end spend, highest single transaction, and primary payment channel.
- **4 Interactive Visualizations (Chart.js)**:
  1. *Category Allocation (Doughnut Chart)*: Proportional breakdown by functional spending area.
  2. *Budget vs. Actual (Grouped Horizontal Bar Chart)*: Actual expenditures plotted against category budgets.
  3. *Cash Flow Inflow vs. Outflow (Bar Chart)*: Salary income versus outflow with net surplus/deficit.
  4. *Payment Channels (Pie / Polar Chart)*: Transaction distribution across payment methods.
- **Granular Category Performance Table**: Volume, average ticket size, budget cap, and status pill per category.

### 5. 🌱 UN Sustainable Development Goals Alignment (`sdg.html`)
- **SDG 8 (Decent Work & Economic Growth)**: Promoting personal financial capability, savings discipline, and debt mitigation.
- **SDG 12 (Responsible Consumption & Production)**: Discouraging impulse spending through category limits and feedback loops.
- **Interactive Mindful Consumption Calculator**: Simulates the 5-year compounding impact of cutting 10% from discretionary spending at 10% CAGR.

### 6. 🎨 Design & Polish
- **FinTech Design System**: Neutral slate palettes with vibrant emerald green financial accents.
- **Dark / Light Theme Toggle**: Seamless transition with system OS preference (`prefers-color-scheme`) detection and localStorage persistence.
- **True Mobile Responsiveness**: Sticky header, slide-out hamburger drawer, and fixed bottom navigation bar for one-thumb mobile usage.
- **Decimal-Safe Precision**: Financial math scaled to integer cents to eliminate floating-point calculation anomalies (`0.1 + 0.2 === 0.3`).

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Markup & Structure** | Semantic HTML5 | Accessible, SEO-friendly, clean heading hierarchy |
| **Styling & Design Tokens** | Vanilla CSS3 (Custom Properties) | Zero bundle overhead, responsive flexbox/grid, theme switching |
| **Core Logic & Architecture** | Vanilla ES6+ Native Modules | Sub-millisecond load times, zero build steps, complete portability |
| **Data Visualization** | Chart.js v4.4.x (via CDN) | Canvas-accelerated, responsive, interactive tooltips |
| **State & Persistence** | Browser LocalStorage + Memory Store | 100% private client-side data sovereignty with schema migration |
| **Foreign Exchange APIs** | Open Exchange Rates & Frankfurter (ECB) | Reliable, open endpoints with automated failover and offline matrix |
| **Typography** | Inter & JetBrains Mono (Google Fonts) | Crisp UI legibility and tabular numerals for financial figures |
| **Testing** | Node.js Test Runner (`node tests/testSuite.js`) | Automated verification of calculations, validation, and storage |

---

## 📁 Repository Structure

```
├── index.html              # Executive Financial Dashboard & Overview
├── expense.html            # Expense Ledger, CRUD & Category Budget Suite
├── currency.html           # Real-Time Currency Converter Studio & Rates Matrix
├── analytics.html          # Interactive Charts, Cashflow & Deep-Dive Analytics
├── sdg.html                # UN Sustainable Development Goals & Impact Simulator
├── about.html              # System Architecture, ES6+ Features & Credentials
├── package.json            # Project manifest & test runner configuration
├── README.md               # Production documentation & portfolio guide
│
├── css/
│   ├── tokens.css          # Design tokens (colors, dark/light themes, spacing)
│   ├── base.css            # CSS reset, typography, and container utilities
│   ├── nav.css             # Sticky header, mobile drawer & bottom navigation
│   ├── components.css      # Cards, stat cards, tables, forms, modals & toasts
│   └── pages.css           # Page-specific layout definitions
│
├── js/
│   ├── constants.js        # Categories, currencies, payment methods, demo data
│   ├── store.js            # Central reactive pub/sub store & localStorage engine
│   ├── currencyService.js  # 3-tier Forex service (API, Cache, Offline fallback)
│   ├── analytics.js        # Decimal-safe arithmetic & financial projection math
│   ├── exportUtils.js      # CSV generator, JSON backup, and printable statements
│   ├── ui.js               # Theme toggler, toasts, modals, and formatters
│   ├── dashboard.js        # Dashboard page controller & spline chart
│   ├── expenseManager.js   # Ledger controller (search, filter, pagination, CRUD)
│   ├── currencyPage.js     # Currency studio controller & cheat-sheet
│   └── analyticsPage.js    # Multi-chart visualizer controller
│
└── tests/
    └── testSuite.js        # 14-test automated unit & integration suite
```

---

## 🚀 Getting Started & Local Development

Because SpendWise is built with native ES Modules, it can be run using any static web server:

### Prerequisites
- Modern Web Browser (Chrome, Firefox, Safari, Edge)
- Optional: [Node.js](https://nodejs.org/) (v18+) for running automated tests

### 1. Clone the Repository
```bash
git clone https://github.com/Praneelved/Smart-Expense-Tracker-and-Currency-Convertor-.git
cd Smart-Expense-Tracker-and-Currency-Convertor-
```

### 2. Run Locally
You can serve the directory using Node.js:
```bash
npx -y serve . -p 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

*(Alternatively, use Python: `python -m http.server 8080`, or the VS Code "Live Server" extension).*

### 3. Run Automated Tests
SpendWise includes an automated test suite verifying decimal precision, budget health thresholds, store CRUD operations, JSON import/export, and currency conversions:
```bash
npm test
```

Expected output:
```
======================================================
🧪 Starting SpendWise Automated Verification Suite
======================================================
--- 1. Precision Financial Arithmetic & Calculation Tests ---
  ✔ PASS: Decimal safety: accurately sums floating point currency values
  ✔ PASS: Multi-item currency precision with cents rounding
  ✔ PASS: Empty dataset handling returns 0 without crashing
--- 2. Budget Health & Warning Threshold Tests ---
  ✔ PASS: Zero budget handled safely without NaN or invalid percentages
  ✔ PASS: Safe budget status below 75% utilization
  ✔ PASS: Warning status between 75% and 90% utilization
  ✔ PASS: Danger status between 90% and 100% utilization
  ✔ PASS: Exceeded status above 100% with negative remaining calculation
--- 3. Category Breakdown & Period Filtering Tests ---
  ✔ PASS: Correct category grouping and percentage distribution
--- 4. Store State Management & Validation Tests ---
  ✔ PASS: Expense validation: rejects empty titles or invalid amounts
  ✔ PASS: Store CRUD: successfully adds, updates, and deletes transactions
--- 5. Currency Converter Service Tests ---
  ✔ PASS: Same currency conversion returns exact 1.0 rate
  ✔ PASS: Multi-currency conversion returned live rate
--- 6. JSON Export & Backup Validation Tests ---
  ✔ PASS: JSON backup export and import integrity test
======================================================
🏁 Test Results: 14/14 Passed (100%)
======================================================
```

---

## 🌐 API Configuration & Limitations

- **Providers Used**:
  - [Open Exchange Rates (Free Open Endpoint)](https://open.er-api.com/v6/latest/)
  - [Frankfurter API (European Central Bank data)](https://api.frankfurter.dev/v1/latest)
- **Authentication**: No private secret API keys are embedded in public frontend code.
- **Cache Policy**: Valid exchange rates are automatically cached in `localStorage` for 60 minutes.
- **Offline Fallback**: If network requests fail or the device is offline, SpendWise computes cross-rates from a verified European Central Bank reference snapshot, clearly flagging the status as `Offline Verified Reference` to maintain complete honesty about rate freshness.

---

## 🔒 Security & Data Privacy

1. **Client-Side Storage**: All expenses, salary, and budget data are stored exclusively in your browser's sandboxed `localStorage`.
2. **Zero Telemetry**: No third-party trackers, analytics scripts, or tracking cookies.
3. **Data Protection**: Destructive operations (Clear All, Import) require explicit user confirmation.
4. **CSV Injection Safeguards**: All exported fields escape quotes and formula triggers.

---

## 💼 LinkedIn Showcase & Portfolio Summary

### Suggested Post Text:
> 🚀 Excited to share **SpendWise** — an executive personal finance and real-time currency conversion web application!
>
> 💡 **What problem does it solve?**
> Managing daily cash flows, setting realistic monthly category budgets, and navigating international currency conversions can be cumbersome. SpendWise solves this with an executive fintech dashboard built entirely with **Vanilla ES6+ Modules**, **CSS Design Tokens**, and **Chart.js** — delivering sub-millisecond load times with zero framework bloat.
>
> ✨ **Key Highlights:**
> • **Executive Dashboard**: Live 30-day spending trajectory, category allocation doughnut, and real-time forex ticker.
> • **Ledger & Budgeting**: Full CRUD, live multi-field search, date/category filters, sorting, and category-level budget alert thresholds.
> • **Resilient Forex Engine**: 3-tier currency converter leveraging European Central Bank market feeds with persistent caching and offline fallback.
> • **100% Privacy by Design**: All data stays client-side in localStorage with JSON backup/restore and RFC-4180 CSV exports.
> • **Comprehensive Test Suite**: 14/14 automated unit tests verifying decimal-safe financial math and budget algorithms.
>
> 🔗 Live Project: https://praneelved.github.io/Smart-Expense-Tracker-and-Currency-Convertor-/
> 💻 GitHub Repo: https://github.com/Praneelved/Smart-Expense-Tracker-and-Currency-Convertor-
>
> #WebDevelopment #FinTech #JavaScript #CSS #OpenSource #PortfolioProject #WebTech

---

## 👨‍💻 Author & Academic Project Context

- **Author**: Praneel Ved
- **Course**: Web Technologies II (Micro-Project)
- **GitHub**: [@Praneelved](https://github.com/Praneelved)

---

<p align="center">Made with ❤️ for Web Technologies II &bull; Spend Smart, Save More, Convert with Confidence</p>
