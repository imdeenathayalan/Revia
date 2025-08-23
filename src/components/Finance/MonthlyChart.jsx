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
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Expenses',
          data: expensesData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
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
          color: '#374151',
          font: {
            size: 14,
            weight: '600',
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
        color: '#1F2937',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
          callback: function(value) {
            return '$' + value;
          }
        },
        title: {
          display: true,
          text: 'Amount ($)',
          color: '#374151',
          font: {
            size: 14,
            weight: '600',
          },
          padding: {
            top: 10,
            bottom: 10
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(229, 231, 235, 0.3)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500',
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  if (isEmpty) {
    return (
      <Card className="mt-6 shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50"> {/* Tailwind gradient */}
        <Card.Body className="p-8 text-center"> {/* Tailwind padding */}
          <div className="text-6xl mb-4 text-gray-400">📊</div> {/* Tailwind */}
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3> {/* Tailwind */}
          <p className="text-gray-500 text-sm"> {/* Tailwind */}
            Add some transactions to see your monthly financial trends
          </p>
          <div className="mt-4 bg-white rounded-lg p-3 inline-block shadow-sm"> {/* Tailwind */}
            <p className="text-xs text-gray-400">💡 Tip: Transactions from different months will appear here</p> {/* Tailwind */}
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-xl border-0 bg-white"> {/* Tailwind */}
      <Card.Body className="p-6"> {/* Tailwind */}
        <div className="flex justify-between items-center mb-6"> {/* Tailwind */}
          <h3 className="text-lg font-semibold text-gray-800">Monthly Overview</h3> {/* Tailwind */}
          <div className="flex items-center space-x-4"> {/* Tailwind */}
            <div className="flex items-center"> {/* Tailwind */}
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div> {/* Tailwind */}
              <span className="text-sm text-gray-600">Income</span> {/* Tailwind */}
            </div>
            <div className="flex items-center"> {/* Tailwind */}
              <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div> {/* Tailwind */}
              <span className="text-sm text-gray-600">Expenses</span> {/* Tailwind */}
            </div>
          </div>
        </div>
        
        <div className="h-80"> {/* Fixed height for chart container */}
          <Bar data={chartData} options={options} />
        </div>
        
        {chartData.labels.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg"> {/* Tailwind */}
            <p className="text-sm text-gray-600 text-center"> {/* Tailwind */}
              Showing data for {chartData.labels.length} month{chartData.labels.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default MonthlyChart;