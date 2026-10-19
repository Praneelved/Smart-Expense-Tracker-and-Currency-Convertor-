/**
 * SpendWise Analytics & Financial Calculation Engine
 */

export class FinancialAnalytics {
  /**
   * Filter expenses by date period
   * period: 'all' | 'this_month' | 'last_month' | 'last_30_days' | 'this_year' | 'custom'
   */
  static filterByPeriod(expenses, period = 'this_month', customStart = null, customEnd = null) {
    if (!Array.isArray(expenses) || expenses.length === 0) return [];
    if (period === 'all') return expenses;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    return expenses.filter(exp => {
      if (!exp.date) return false;
      const expDate = new Date(exp.date + 'T00:00:00');

      if (period === 'this_month') {
        return expDate.getFullYear() === currentYear && expDate.getMonth() === currentMonth;
      }
      if (period === 'last_month') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return expDate.getFullYear() === lastMonthYear && expDate.getMonth() === lastMonth;
      }
      if (period === 'last_30_days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
        return expDate >= thirtyDaysAgo && expDate <= now;
      }
      if (period === 'this_year') {
        return expDate.getFullYear() === currentYear;
      }
      if (period === 'custom' && customStart && customEnd) {
        const start = new Date(customStart + 'T00:00:00');
        const end = new Date(customEnd + 'T23:59:59');
        return expDate >= start && expDate <= end;
      }
      return true;
    });
  }

  /**
   * Total sum of expenses with 2-decimal precision
   */
  static getTotalSpent(expenses) {
    if (!Array.isArray(expenses) || expenses.length === 0) return 0;
    const cents = expenses.reduce((acc, exp) => {
      const amt = Number(exp.amount) || 0;
      return acc + Math.round(amt * 100);
    }, 0);
    return cents / 100;
  }

  /**
   * Category breakdown with totals, counts, and percentages
   */
  static getCategoryBreakdown(expenses) {
    const totalSpent = this.getTotalSpent(expenses);
    const categoryMap = {};

    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      const amt = Number(exp.amount) || 0;
      if (!categoryMap[cat]) {
        categoryMap[cat] = {
          category: cat,
          total: 0,
          count: 0,
          percentage: 0
        };
      }
      categoryMap[cat].total = Math.round((categoryMap[cat].total + amt) * 100) / 100;
      categoryMap[cat].count += 1;
    });

    const result = Object.values(categoryMap).map(item => {
      item.percentage = totalSpent > 0 ? Math.round((item.total / totalSpent) * 1000) / 10 : 0;
      return item;
    });

    // Sort descending by total amount
    result.sort((a, b) => b.total - a.total);
    return result;
  }

  /**
   * Budget analysis and warning thresholds
   */
  static calculateBudgetHealth(totalSpent, budget) {
    const numBudget = Number(budget) || 0;
    if (numBudget <= 0) {
      return {
        hasBudget: false,
        budget: 0,
        spent: totalSpent,
        remaining: 0,
        utilizationPct: 0,
        status: 'none', // none, safe, warning, danger, exceeded
        message: 'No budget set for this period'
      };
    }

    const remaining = Math.round((numBudget - totalSpent) * 100) / 100;
    const utilizationPct = Math.round((totalSpent / numBudget) * 1000) / 10;

    let status = 'safe';
    let message = 'Spending within comfortable limits';

    if (utilizationPct >= 100) {
      status = 'exceeded';
      message = `Budget exceeded by ₹${Math.abs(remaining).toLocaleString('en-IN')}`;
    } else if (utilizationPct >= 90) {
      status = 'danger';
      message = 'Critical: Over 90% of budget utilized';
    } else if (utilizationPct >= 75) {
      status = 'warning';
      message = 'Caution: Over 75% of budget utilized';
    }

    return {
      hasBudget: true,
      budget: numBudget,
      spent: totalSpent,
      remaining,
      utilizationPct,
      status,
      message
    };
  }

  /**
   * Daily spending grouped by date for charts & timelines
   */
  static getDailySpendingTrend(expenses, days = 30) {
    const trendMap = {};
    const now = new Date();

    // Initialize past days with 0 so chart has continuous timeline
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateKey = d.toISOString().split('T')[0];
      trendMap[dateKey] = 0;
    }

    expenses.forEach(exp => {
      if (exp.date && trendMap[exp.date] !== undefined) {
        trendMap[exp.date] = Math.round((trendMap[exp.date] + Number(exp.amount)) * 100) / 100;
      }
    });

    return {
      labels: Object.keys(trendMap),
      values: Object.values(trendMap)
    };
  }

  /**
   * Spending velocity & projections
   */
  static getSpendingVelocity(expenses, salary, monthlyBudget) {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = Math.max(1, now.getDate());

    const thisMonthExpenses = this.filterByPeriod(expenses, 'this_month');
    const totalSpentThisMonth = this.getTotalSpent(thisMonthExpenses);

    const avgDailySpend = Math.round((totalSpentThisMonth / currentDay) * 100) / 100;
    const projectedMonthEnd = Math.round(avgDailySpend * daysInMonth);

    const daysRemaining = daysInMonth - currentDay;
    const remainingBudget = monthlyBudget > 0 ? monthlyBudget - totalSpentThisMonth : 0;
    const recommendedDailyCap = daysRemaining > 0 && remainingBudget > 0
      ? Math.round(remainingBudget / daysRemaining)
      : 0;

    return {
      daysInMonth,
      currentDay,
      daysRemaining,
      avgDailySpend,
      projectedMonthEnd,
      recommendedDailyCap,
      isProjectedToOverspend: monthlyBudget > 0 && projectedMonthEnd > monthlyBudget
    };
  }

  /**
   * Financial Summary Card Data Generator
   */
  static getExecutiveSummary(expenses, salary, monthlyBudget) {
    const thisMonthExpenses = this.filterByPeriod(expenses, 'this_month');
    const totalSpent = this.getTotalSpent(thisMonthExpenses);
    const balance = Math.round((salary - totalSpent) * 100) / 100;
    const savingsRate = salary > 0 ? Math.max(0, Math.round((balance / salary) * 1000) / 10) : 0;
    const budgetHealth = this.calculateBudgetHealth(totalSpent, monthlyBudget);
    const categoryBreakdown = this.getCategoryBreakdown(thisMonthExpenses);
    const velocity = this.getSpendingVelocity(expenses, salary, monthlyBudget);

    return {
      salary,
      totalSpent,
      balance,
      savingsRate,
      budgetHealth,
      categoryBreakdown,
      velocity,
      transactionCount: thisMonthExpenses.length
    };
  }
}
