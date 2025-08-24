// src/components/Finance/CategoryPieChart.jsx
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryPieChart({ transactions }) {
  const chartData = useMemo(() => {
    const categoryTotals = {};
    
    // Calculate totals for each category (expenses only)
    transactions.forEach(transaction => {
      if (transaction.amount < 0) {
        const amount = Math.abs(transaction.amount);
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + amount;
      }
    });

    const categories = Object.keys(categoryTotals);
    const totals = Object.values(categoryTotals);
    const totalExpenses = totals.reduce((sum, total) => sum + total, 0);

    // Generate colors based on category
    const generateColors = (count) => {
      const baseColors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFE66D', '#FF9F1C',
        '#6A0572', '#AB83A1', '#5C80BC', '#4CB5AE', '#F4A261',
        '#2A9D8F', '#E76F51', '#264653', '#E9C46A', '#F4A261'
      ];
      return baseColors.slice(0, count);
    };

    return {
      labels: categories.map(category => `${category} (${((categoryTotals[category] / totalExpenses) * 100).toFixed(1)}%)`),
      datasets: [
        {
          data: totals,
          backgroundColor: generateColors(categories.length),
          borderColor: '#2d2d2d',
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            weight: '600',
          },
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Spending by Category',
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(45, 45, 45, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#800000',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label.split(' (')[0]}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const expenseTransactions = transactions.filter(t => t.amount < 0);
  
  if (expenseTransactions.length === 0) {
    return (
      <Card className="h-100 shadow-xl border border-maroon bg-grey-dark">
        <Card.Body className="p-6 text-center">
          <div className="text-6xl mb-4 text-maroon-light">
            <i className="bi bi-pie-chart"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Expense Data</h3>
          <p className="text-white">
            Add some expense transactions to see category breakdown
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 shadow-xl border border-maroon bg-grey-dark">
      <Card.Body className="p-6">
        <div className="h-80">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="mt-4 p-4 bg-grey-medium rounded-lg border border-maroon">
          <p className="text-sm text-white text-center">
            <i className="bi bi-info-circle me-2"></i>
            Showing {expenseTransactions.length} expense transaction{expenseTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CategoryPieChart;