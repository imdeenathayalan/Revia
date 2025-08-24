// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';

// Import autoTable function directly
import autoTable from 'jspdf-autotable';

// Helper function to safely format numbers
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0.00';
  }
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Helper function to safely format dates
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-IN');
  } catch (error) {
    return 'Invalid Date';
  }
};

export const generatePDF = (reportData, options) => {
  try {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(128, 0, 0); // Maroon color
    doc.text('Revia Financial Report', 105, 20, { align: 'center' });
    
    // Date
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 105, 30, { align: 'center' });
    
    let yPosition = 40;

    // Financial Summary
    doc.setFontSize(16);
    doc.setTextColor(128, 0, 0);
    doc.text('Financial Summary', 14, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Safe access to totals with fallbacks
    const balance = reportData.totals?.balance || 0;
    const income = reportData.totals?.income || 0;
    const expenses = reportData.totals?.expenses || 0;
    
    doc.text(`Total Balance: ${formatCurrency(balance)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Total Income: ${formatCurrency(income)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Total Expenses: ${formatCurrency(expenses)}`, 20, yPosition);
    yPosition += 15;

    // Transactions Table
    if (options.includeTransactions && reportData.transactions && reportData.transactions.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(128, 0, 0);
      doc.text('Transactions', 14, yPosition);
      yPosition += 10;
      
      const tableData = reportData.transactions.map(transaction => [
        formatDate(transaction.date),
        transaction.description || 'No description',
        transaction.category || 'Uncategorized',
        formatCurrency(Math.abs(transaction.amount || 0)),
        (transaction.amount || 0) > 0 ? 'Income' : 'Expense'
      ]);
      
      // Use autoTable function directly
      autoTable(doc, {
        startY: yPosition,
        head: [['Date', 'Description', 'Category', 'Amount', 'Type']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [128, 0, 0],
          textColor: [255, 255, 255]
        },
        styles: {
          fontSize: 10,
          cellPadding: 3
        }
      });
      
      yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Budgets Section
    if (options.includeBudgets && reportData.budgets && reportData.budgets.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(128, 0, 0);
      doc.text('Budgets', 14, yPosition);
      yPosition += 10;
      
      const budgetData = reportData.budgets.map(budget => [
        budget.category || 'No category',
        formatCurrency(budget.amount || 0),
        budget.period || 'Monthly'
      ]);
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Category', 'Amount', 'Period']],
        body: budgetData,
        theme: 'grid',
        headStyles: {
          fillColor: [128, 0, 0],
          textColor: [255, 255, 255]
        }
      });
      
      yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Goals Section
    if (options.includeGoals && reportData.goals && reportData.goals.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(128, 0, 0);
      doc.text('Savings Goals', 14, yPosition);
      yPosition += 10;
      
      const goalData = reportData.goals.map(goal => {
        const current = goal.currentAmount || 0;
        const target = goal.targetAmount || 1;
        const percentage = Math.round((current / target) * 100);
        
        return [
          goal.name || 'Unnamed Goal',
          `${formatCurrency(current)} / ${formatCurrency(target)}`,
          `${percentage}%`
        ];
      });
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Goal', 'Progress', 'Completion']],
        body: goalData,
        theme: 'grid',
        headStyles: {
          fillColor: [128, 0, 0],
          textColor: [255, 255, 255]
        }
      });
    }

    // Save the PDF
    doc.save(`revia-financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
};