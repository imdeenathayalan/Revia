// src/components/Finance/DebtsList.jsx
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useDebt } from '../../context/DebtContext';
import { DEBT_TYPE_ICONS, DEBT_TYPE_LABELS } from '../../utils/debtTypes';
import { formatIndianCurrency } from '../../utils/storage';

function DebtsList({ debts }) {
  const { deleteDebt } = useDebt();

  if (debts.length === 0) {
    return null;
  }

  return (
    <Row>
      {debts.map((debt) => (
        <Col key={debt.id} xs={12} md={6} lg={4} className="mb-3">
          <Card className="h-100 bg-grey-dark border-maroon">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-white mb-1">
                    <i className={`bi ${DEBT_TYPE_ICONS[debt.type] || 'bi-cash'} me-2`}></i>
                    {debt.name}
                  </h6>
                  <Badge bg={debt.isActive ? "warning" : "success"} className="text-uppercase">
                    {debt.isActive ? "Active" : "Paid Off"}
                  </Badge>
                  {debt.lender && (
                    <Badge bg="secondary" className="ms-2">
                      {debt.lender}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteDebt(debt.id)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="d-flex justify-content-between">
                  <span className="text-white">Original:</span>
                  <strong className="text-white">{formatIndianCurrency(debt.originalAmount)}</strong>
                </div>
                
                {debt.isActive ? (
                  <>
                    <div className="d-flex justify-content-between">
                      <span className="text-white">Remaining:</span>
                      <strong className="text-white">{formatIndianCurrency(debt.remainingAmount)}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-white">Monthly:</span>
                      <span className="text-warning">{formatIndianCurrency(debt.monthlyPayment)}</span>
                    </div>
                    {debt.interestRate > 0 && (
                      <div className="d-flex justify-content-between">
                        <span className="text-white">Interest:</span>
                        <span className="text-white">{debt.interestRate}%</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-between">
                      <span className="text-white">Total Paid:</span>
                      <strong className="text-success">{formatIndianCurrency(debt.totalPaid)}</strong>
                    </div>
                    {debt.paidOffDate && (
                      <div className="d-flex justify-content-between">
                        <span className="text-white">Paid Off:</span>
                        <span className="text-white">
                          {new Date(debt.paidOffDate).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default DebtsList;