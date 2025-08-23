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
          color: '#D1D5DB', // Light gray
          font: {
            size: 14,
            weight: '600',
          },
        }
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses',
        color: '#F87171', // Light red
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)', // Dark gray
        titleColor: '#F87171', // Light red
        bodyColor: '#D1D5DB', // Light gray
        borderColor: '#EF4444', // Red
        borderWidth: 1,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.5)', // Dark gray
        },
        ticks: {
          color: '#9CA3AF', // Gray
          callback: function(value) {
            return '$' + value;
          }
        },
        title: {
          display: true,
          text: 'Amount ($)',
          color: '#F87171', // Light red
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)', // Dark gray
        },
        ticks: {
          color: '#9CA3AF', // Gray
        }
      }
    },
  };

  if (isEmpty) {
    return (
      <Card className="mt-6 shadow-xl border border-red-700 bg-gray-800"> {/* Dark card */}
        <Card.Body className="p-8 text-center">
          <div className="text-6xl mb-4 text-red-400">📊</div> {/* Dark red */}
          <h3 className="text-xl font-semibold text-red-300 mb-2">No Data Available</h3> {/* Light red */}
          <p className="text-gray-400 text-sm"> {/* Gray */}
            Add some transactions to see your monthly financial trends
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-xl border border-red-700 bg-gray-800"> {/* Dark card */}
      <Card.Body className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-red-400">Monthly Overview</h3> {/* Dark red */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Income</span> {/* Light gray */}
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-300">Expenses</span> {/* Light gray */}
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
}

export default MonthlyChart;