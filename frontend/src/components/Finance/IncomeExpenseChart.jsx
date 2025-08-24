// src/components/Finance/IncomeExpenseChart.jsx
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function IncomeExpenseChart({ transactions }) {
  const chartData = useMemo(() => {
    const monthlyData = {};
    
    // Group by month and calculate income/expenses
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          label: monthName,
          income: 0,
          expenses: 0
        };
      }

      if (transaction.amount > 0) {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expenses += Math.abs(transaction.amount);
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(month => monthlyData[month].label);
    
    const incomeData = sortedMonths.map(month => monthlyData[month].income);
    const expensesData = sortedMonths.map(month => monthlyData[month].expenses);

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(72, 187, 120, 0.8)',
          borderColor: 'rgba(72, 187, 120, 1)',
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.6,
        },
        {
          label: 'Expenses',
          data: expensesData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.6,
        },
      ],
    };
  }, [transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            size: 14,
            weight: '600',
          },
        }
      },
      title: {
        display: true,
        text: 'Income vs Expenses Comparison',
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
            return `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        },
        title: {
          display: true,
          text: 'Amount (₹)',
          color: '#ffffff',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        }
      }
    },
  };

  if (transactions.length === 0) {
    return (
      <Card className="h-100 shadow-xl border border-maroon bg-grey-dark">
        <Card.Body className="p-6 text-center">
          <div className="text-6xl mb-4 text-maroon-light">
            <i className="bi bi-bar-chart"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
          <p className="text-white">
            Add transactions to see income vs expenses comparison
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 shadow-xl border border-maroon bg-grey-dark">
      <Card.Body className="p-6">
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
        <div className="mt-4 p-4 bg-grey-medium rounded-lg border border-maroon">
          <p className="text-sm text-white text-center">
            <i className="bi bi-calendar me-2"></i>
            Showing data for {chartData.labels.length} month{chartData.labels.length !== 1 ? 's' : ''}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}

export default IncomeExpenseChart;