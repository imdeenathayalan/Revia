import { useEffect, useState } from 'react';
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
import './MonthlyChart.css';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      prepareChartData();
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(76, 175, 80, 1)',
        },
        {
          label: 'Expenses',
          data: expensesData,
          backgroundColor: 'rgba(244, 67, 54, 0.8)',
          borderColor: 'rgba(244, 67, 54, 1)',
          borderWidth: 2,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(244, 67, 54, 1)',
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'Poppins',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 37, 48, 0.95)',
        titleColor: '#ff7b46',
        bodyColor: '#e2e8f0',
        borderColor: '#ff7b46',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`;
          },
          title: function(context) {
            return `Month: ${context[0].label}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#e2e8f0',
          font: {
            family: 'Poppins',
            size: 12
          },
          callback: function(value) {
            if (value >= 1000) {
              return '₹' + (value / 1000).toFixed(1) + 'k';
            }
            return '₹' + value;
          }
        },
        title: {
          display: true,
          text: 'Amount (₹)',
          color: '#e2e8f0',
          font: {
            family: 'Poppins',
            size: 12,
            weight: '600'
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#e2e8f0',
          font: {
            family: 'Poppins',
            size: 12
          }
        }
      }
    },
  };

  if (isLoading) {
    return (
      <div className="monthly-chart-content animate-pulse">
        <div className="h-64 bg-[#3a506b] rounded-lg"></div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="monthly-chart-content text-center flex flex-col justify-center items-center h-full">
        <div className="text-5xl mb-4 text-[#ff7b46]">
          <i className="bi bi-bar-chart"></i>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Data Available</h3>
        <p className="text-gray-300">
          Add some transactions to see your monthly financial trends
        </p>
      </div>
    );
  }

  return (
    <div className="monthly-chart-content">
      {/* Chart Container */}
      <div className="chart-content">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Chart Info Footer */}
      {chartData.labels.length > 0 && (
        <div className="chart-footer">
          <div className="chart-info">
            <p className="chart-info-text">
              <i className="bi bi-info-circle mr-2 text-[#ff7b46]"></i>
              Showing data for {chartData.labels.length} month{chartData.labels.length !== 1 ? 's' : ''}
            </p>
            <div className="chart-info-stats">
              <span className="chart-stat bg-green-800/30 text-green-300">
                <i className="bi bi-arrow-up mr-1"></i>
                Highest: ₹{Math.max(...chartData.datasets[0].data).toLocaleString('en-IN')}
              </span>
              <span className="chart-stat bg-blue-800/30 text-blue-300">
                <i className="bi bi-calendar mr-1"></i>
                {chartData.labels[chartData.labels.length - 1]}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyChart;