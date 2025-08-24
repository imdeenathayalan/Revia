import { useEffect, useState } from 'react';
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyChart({ transactions }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    prepareChartData();
  }, [transactions]);

  const prepareChartData = () => {
    if (transactions.length === 0) {
      setIsEmpty(true);
      setChartData({ labels: [], datasets: [] });
      return;
    }

    setIsEmpty(false);
    
    // Group transactions by month and calculate income/expenses
    const monthlyData = {};
    
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

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(month => monthlyData[month].label);
    
    const incomeData = sortedMonths.map(month => monthlyData[month].income);
    const expensesData = sortedMonths.map(month => monthlyData[month].expenses);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(72, 187, 120, 0.7)', // Green
          borderColor: 'rgba(72, 187, 120, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Expenses',
          data: expensesData,
          backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000000', // Black text
          font: {
            size: 14,
            weight: '600',
          },
        }
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
        color: '#dc2626', // Red-600
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // White background
        titleColor: '#000000', // Black text
        bodyColor: '#000000', // Black text
        borderColor: '#e5e7eb', // Gray border
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Light black grid
        },
        ticks: {
          color: '#000000', // Black text
          callback: function(value) {
            return '$' + value;
          }
        },
        title: {
          display: true,
          text: 'Amount ($)',
          color: '#000000', // Black text
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Light black grid
        },
        ticks: {
          color: '#000000', // Black text
        }
      }
    },
  };

  if (isEmpty) {
    return (
      <Card className="mt-6 shadow-xl border border-red-700 bg-gray-100">
        <Card.Body className="p-8 text-center">
          <div className="text-6xl mb-4 text-red-600">
            <i className="bi bi-bar-chart"></i>
          </div>
          <h3 className="text-xl font-semibold text-black mb-2">No Data Available</h3>
          <p className="text-gray-600">
            Add some transactions to see your monthly financial trends
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-xl border border-red-700 bg-gray-100">
      <Card.Body className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-black">
            <i className="bi bi-graph-up me-2"></i>
            Monthly Overview
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-black">Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-black">Expenses</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
        
        {chartData.labels.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-300">
            <p className="text-black text-sm text-center">
              <i className="bi bi-calendar me-2"></i>
              Showing data for {chartData.labels.length} month{chartData.labels.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default MonthlyChart;