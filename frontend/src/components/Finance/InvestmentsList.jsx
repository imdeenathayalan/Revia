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
    <div className="mb-4">
      <h3 className="text-white mb-3">
        <i className="bi bi-list-ul me-2"></i>
        Your Investments
      </h3>
      
      <Row>
        {investments.map((investment) => (
          <Col key={investment.id} xs={12} md={6} lg={4} className="mb-3">
            <Card className="h-100 bg-grey-dark border-maroon">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="text-white mb-1">
                      <i className={`bi ${INVESTMENT_TYPE_ICONS[investment.type] || 'bi-wallet'} me-2`}></i>
                      {investment.name}
                    </h6>
                    <Badge bg="secondary" className="text-uppercase">
                      {INVESTMENT_TYPE_LABELS[investment.type] || investment.type}
                    </Badge>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteInvestment(investment.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-white">Invested:</span>
                    <strong className="text-white">{formatIndianCurrency(investment.investedAmount)}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-white">Current Value:</span>
                    <strong className="text-white">{formatIndianCurrency(investment.currentValue)}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-white">P&L:</span>
                    <span className={investment.gainLoss >= 0 ? 'text-success' : 'text-danger'}>
                      {formatIndianCurrency(investment.gainLoss)}
                    </span>
                  </div>
                  {investment.quantity > 1 && (
                    <div className="d-flex justify-content-between">
                      <span className="text-white">Quantity:</span>
                      <span className="text-white">{investment.quantity}</span>
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