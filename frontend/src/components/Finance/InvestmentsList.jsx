// src/components/Finance/InvestmentsList.jsx
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useInvestment } from '../../context/InvestmentContext';
import { INVESTMENT_TYPE_ICONS, INVESTMENT_TYPE_LABELS } from '../../utils/investmentTypes';
import { formatIndianCurrency } from '../../utils/storage';

function InvestmentsList() {
  const { investments, deleteInvestment } = useInvestment();

  if (investments.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 font-poppins">
      <h3 className="text-white font-semibold mb-4">
        <i className="bi bi-list-ul me-2"></i>
        Your Investments
      </h3>
      
      <Row>
        {investments.map((investment) => (
          <Col key={investment.id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="h-100 dark:bg-dark-card dark:border-dark-border shadow-lg">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="text-white font-semibold mb-1">
                      <i className={`bi ${INVESTMENT_TYPE_ICONS[investment.type] || 'bi-wallet'} me-2`}></i>
                      {investment.name}
                    </h6>
                    <Badge bg="secondary" className="text-uppercase font-medium">
                      {INVESTMENT_TYPE_LABELS[investment.type] || investment.type}
                    </Badge>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteInvestment(investment.id)}
                    className="font-semibold"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-white font-medium">Invested:</span>
                    <strong className="text-white font-semibold">{formatIndianCurrency(investment.investedAmount)}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-white font-medium">Current Value:</span>
                    <strong className="text-white font-semibold">{formatIndianCurrency(investment.currentValue)}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-white font-medium">P&L:</span>
                    <span className={`font-semibold ${investment.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatIndianCurrency(investment.gainLoss)}
                    </span>
                  </div>
                  {investment.quantity > 1 && (
                    <div className="d-flex justify-content-between">
                      <span className="text-white font-medium">Quantity:</span>
                      <span className="text-white font-medium">{investment.quantity}</span>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default InvestmentsList;