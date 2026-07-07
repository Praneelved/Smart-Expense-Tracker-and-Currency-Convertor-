# 💰 SpendWise - Smart Expense Tracker with Currency Converter

A production-ready, multi-page Smart Expense Tracker with Currency Converter built with **React.js**, **Bootstrap 5**, **Chart.js**, and the **Frankfurter API**. Track income and expenses, visualize spending patterns, plan budgets, and convert currencies — all in one beautiful app.

> **Micro Project** — Experiment No. 12 | Web Technologies-II

---

## 🎯 Mapped SDGs

| SDG | Goal | How SpendWise Contributes |
|-----|------|--------------------------|
| **SDG 8** | Decent Work & Economic Growth | Promotes financial literacy and economic stability through smart money management |
| **SDG 12** | Responsible Consumption & Production | Encourages mindful spending through visual analytics and budget tracking |

---

## 📋 Problem Statement

Many people earn money every month but find it difficult to track their expenses, manage their budget, and save money. **SpendWise** helps users:
- Record income and expenses
- Calculate remaining balance
- Analyze spending through interactive charts
- Convert currencies using live exchange rates

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💵 **Monthly Income Entry** | Record salary, freelance, investments, and all income sources with categorization |
| 📝 **Expense Management** | Track daily expenses across 9 categories with CRUD operations |
| 💰 **Balance Calculator** | Automatically calculate remaining balance (Income - Expenses) |
| 📊 **Expense Analysis** | Interactive doughnut, bar, and line charts for spending visualization |
| 💱 **Currency Converter** | Live exchange rates using Frankfurter API (fetch + async/await) |
| 🎯 **Budget Planner** | Set monthly budgets with alerts at 80% and 100% usage |
| 📄 **PDF/CSV Export** | Generate downloadable financial reports |
| 🔍 **Search & Filters** | Search transactions by note, filter by category |
| 🌙 **Dark/Light Mode** | Theme toggle with system preference detection |
| 📱 **Fully Responsive** | Mobile-first design that works on all screen sizes |
| 🔔 **Toast Notifications** | Success/error feedback for all user actions |
| 💾 **Local Storage** | Data persists in browser — no account needed |
| 🔄 **Backup/Restore** | Export and import data as JSON backups |

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React.js** | Component-based UI library |
| **Vite** | Next-gen build tool with HMR |
| **Bootstrap 5** | Responsive CSS framework |
| **Chart.js** | Data visualization (Doughnut, Bar, Line charts) |
| **React Router v6** | Client-side routing for multi-page navigation |
| **Framer Motion** | Smooth page transitions and animations |
| **Lucide React** | Modern icon set |
| **Frankfurter API** | Live currency exchange rates (ECB data) |
| **jsPDF** | PDF report generation |
| **react-hot-toast** | Toast notifications |
| **localStorage** | Client-side data persistence |

---

## ⚡ ES6+ Features Used

- ✅ Arrow Functions (`=>`)
- ✅ Template Literals (`` `${}` ``)
- ✅ Destructuring Assignment
- ✅ Spread/Rest Operators (`...`)
- ✅ Modules (`import`/`export`)
- ✅ Promises & `async`/`await`
- ✅ Array Methods (`map`, `filter`, `reduce`)
- ✅ `const` & `let` (Block scoping)
- ✅ Default Parameters
- ✅ Object Shorthand Properties
- ✅ Computed Property Names

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Glassmorphism responsive navbar
│   │   ├── Footer.jsx          # Multi-column footer with SDG badges
│   │   └── Layout.jsx          # Page wrapper with transitions
│   └── charts/
│       ├── ExpensePieChart.jsx  # Doughnut chart for categories
│       ├── IncomeExpenseBar.jsx # Bar chart comparing income vs expenses
│       └── TrendLineChart.jsx  # Line chart for spending trends
├── context/
│   ├── ThemeContext.jsx         # Dark/light mode state management
│   └── DataContext.jsx          # Transactions, budgets, profile (useReducer)
├── pages/
│   ├── Home.jsx                 # Landing page with hero & features
│   ├── Dashboard.jsx            # Summary cards, charts, recent transactions
│   ├── Income.jsx               # Income CRUD with search & filters
│   ├── Expenses.jsx             # Expense CRUD with search & filters
│   ├── Analytics.jsx            # Charts and spending insights
│   ├── BudgetPlanner.jsx        # Monthly budget setting & tracking
│   ├── CurrencyConverter.jsx    # Live currency conversion (API)
│   ├── Reports.jsx              # PDF/CSV export with date filters
│   ├── Profile.jsx              # User settings & data management
│   ├── About.jsx                # Project info, SDGs, tech stack
│   └── Contact.jsx              # Contact form & FAQ accordion
├── utils/
│   ├── constants.js             # Categories, currencies, helpers
│   ├── formatters.js            # Currency, date, number formatting
│   └── exportUtils.js           # PDF and CSV generation
├── App.jsx                      # Router setup & context providers
├── main.jsx                     # Entry point with Bootstrap imports
└── index.css                    # Global styles & design system
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/Praneelved/Smart-Expense-Tracker-and-Currency-Convertor-.git

# Navigate to project directory
cd Smart-Expense-Tracker-and-Currency-Convertor-

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173/`

### Production Build

```bash
npm run build
```

---

## 📸 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero, features, tech stack |
| Dashboard | `/dashboard` | Financial overview with charts and stats |
| Income | `/income` | Add, edit, delete, search, filter income |
| Expenses | `/expenses` | Add, edit, delete, search, filter expenses |
| Analytics | `/analytics` | Pie, bar, line charts + top categories |
| Budget | `/budget` | Set monthly budgets with progress tracking |
| Converter | `/converter` | Live currency conversion with 7-day history |
| Reports | `/reports` | Date-filtered reports with PDF/CSV export |
| Profile | `/profile` | User settings, backup/restore data |
| About | `/about` | Project info, SDG mapping, ES6 features list |
| Contact | `/contact` | Contact form and FAQ accordion |

---

## 🌐 API Used

**Frankfurter API** — [frankfurter.dev](https://frankfurter.dev)
- Source: European Central Bank (ECB)
- No API key required
- 30+ currencies supported
- Historical rates available
- Data fetched using ES6 `fetch()` with `async/await`

```javascript
// ES6 - Example API call from the project
const response = await fetch(
  `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${from}&to=${to}`
);
const { rates, date } = await response.json();
```

---

## 📊 Data Visualization

- **Doughnut Chart** — Expense breakdown by category
- **Bar Chart** — Monthly income vs expenses comparison (6 months)
- **Line Chart** — Daily spending trend (30 days)
- **Progress Bars** — Budget utilization with color-coded alerts

---

## 🎨 Design

- Modern glassmorphism UI with backdrop blur
- Indigo/violet gradient color palette
- Inter font from Google Fonts
- Smooth Framer Motion page transitions
- Dark/light mode with system preference detection
- Mobile-responsive with Bootstrap grid

---

## 👥 Team

| Name | Roll No |
|------|---------|
| Praneel Ved | — |

---

## 📄 License

This project is created for educational purposes as part of the Web Technologies-II Micro Project.

---

<p align="center">Made with ❤️ for Web Technologies-II</p>
