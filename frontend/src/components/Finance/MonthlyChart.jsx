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
          backgroundColor: 'rgba(72, 187, 120, 0.7)',
          borderColor: 'rgba(72, 187, 120, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Expenses',
          data: expensesData,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
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
          color: '#ffffff',
          font: {
            size: 14,
            weight: '600',
          },
        }
      },
      title: {
        display: true,
        text: 'Monthly Income vs Expenses (₹)',
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

  if (isEmpty) {
    return (
      <Card className="mt-6 shadow-xl border border-maroon bg-grey-dark">
        <Card.Body className="p-8 text-center">
          <div className="text-6xl mb-4 text-maroon-light">
            <i className="bi bi-bar-chart"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
          <p className="text-white">
            Add some transactions to see your monthly financial trends
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-xl border border-maroon bg-grey-dark">
      <Card.Body className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            <i className="bi bi-graph-up me-2"></i>
            Monthly Overview
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-white">Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-white">Expenses</span>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <Bar data={chartData} options={options} />
        </div>
        
        {chartData.labels.length > 0 && (
          <div className="mt-4 p-4 bg-grey-medium rounded-lg border border-maroon">
            <p className="text-white text-sm text-center">
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