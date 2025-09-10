import { formatIndianCurrency } from '../../utils/storage.js';

function SummaryCards({ balance, income, expenses }) {
  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      variant: balance >= 0 ? 'success' : 'danger',
      icon: 'bi-wallet2',
      iconColor: balance >= 0 ? '#60a5fa' : '#f87171',
      textColor: balance >= 0 ? '#4ade80' : '#f87171'
    },
    {
      title: 'Total Income',
      amount: income,
      variant: 'success',
      icon: 'bi-arrow-up-circle',
      iconColor: '#4ade80',
      textColor: '#4ade80'
    },
    {
      title: 'Total Expenses',
      amount: expenses,
      variant: 'danger',
      icon: 'bi-arrow-down-circle',
      iconColor: '#f87171',
      textColor: '#f87171'
    }
  ];

  return (
    <div className="summary-cards-container">
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="summary-card"
          >
            <div className="card-icon" style={{ color: card.iconColor }}>
              <i className={card.icon}></i>
            </div>
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-amount" style={{ color: card.textColor }}>
                {formatIndianCurrency(card.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .summary-cards-container {
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .cards-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }
        
        .summary-card {
          background: linear-gradient(135deg, #0a192f, #020c1b);
          border: 1px solid #112240;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
        }
        
        .summary-card:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
          transform: translateY(-2px);
          border-color: #64ffda;
        }
        
        .summary-card:hover .card-icon {
          transform: scale(1.1);
        }
        
        .card-icon {
          font-size: 2rem;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .card-content {
          flex-grow: 1;
        }
        
        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ccd6f6;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }
        
        .card-amount {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        /* Desktop styles */
        @media (min-width: 768px) {
          .cards-grid {
            flex-direction: row;
            gap: 1.5rem;
          }
          
          .summary-card {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
            flex: 1;
            padding: 2rem 1.5rem;
          }
          
          .card-icon {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            width: 70px;
            height: 70px;
          }
          
          .card-title {
            font-size: 1rem;
          }
          
          .card-amount {
            font-size: 1.75rem;
          }
        }

        /* Animation for icons */
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .card-icon i {
          animation: pulse 2s infinite;
        }
        
        .summary-card:hover .card-icon i {
          animation: none;
        }
      `}</style>

      {/* Add Bootstrap Icons CDN in a better way */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" 
      />
    </div>
  );
}

export default SummaryCards;