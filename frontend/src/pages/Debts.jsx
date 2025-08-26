// src/pages/Debts.jsx
import { useState } from 'react';
import { Container, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useDebt } from '../context/DebtContext';
import DebtsList from '../components/Finance/DebtsList';
import AddDebtModal from '../components/Finance/AddDebtModal';
import { formatIndianCurrency } from '../utils/storage';

function Debts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { debts, calculateDebtTotals, isLoading } = useDebt();

  if (isLoading) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner-border text-maroon" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading debts...</p>
        </div>
      </Container>
    );
  }

  const totals = calculateDebtTotals();
  const activeDebts = debts.filter(debt => debt.isActive);
  const paidOffDebts = debts.filter(debt => !debt.isActive);

  return (
    <Container>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 p-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            <i className="bi bi-cash-coin me-3"></i>
            Debt Management
          </h1>
          <p className="text-maroon-light">
            Track and manage your loans, EMIs, and debts
          </p>
        </div>
        
        <Button 
          variant="maroon"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Debt
        </Button>
      </div>

      {/* Debt Summary */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Card className="h-100 text-center bg-grey-dark border-maroon">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-white">
                <i className="bi bi-currency-rupee"></i>
              </div>
              <Card.Title className="text-white mb-2">Total Debt</Card.Title>
              <Card.Text className="text-2xl font-bold text-danger">
                {formatIndianCurrency(totals.totalDebt)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4}>
          <Card className="h-100 text-center bg-grey-dark border-maroon">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-white">
                <i className="bi bi-calendar-check"></i>
              </div>
              <Card.Title className="text-white mb-2">Monthly Payments</Card.Title>
              <Card.Text className="text-2xl font-bold text-warning">
                {formatIndianCurrency(totals.totalMonthlyPayment)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4}>
          <Card className="h-100 text-center bg-grey-dark border-maroon">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-white">
                <i className="bi bi-check-circle"></i>
              </div>
              <Card.Title className="text-white mb-2">Total Paid</Card.Title>
              <Card.Text className="text-2xl font-bold text-success">
                {formatIndianCurrency(totals.totalPaid)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Active Debts */}
      {activeDebts.length > 0 && (
        <div className="mb-4">
          <h3 className="text-white mb-3">
            <i className="bi bi-clock-history me-2"></i>
            Active Debts ({activeDebts.length})
          </h3>
          <DebtsList debts={activeDebts} />
        </div>
      )}

      {/* Paid Off Debts */}
      {paidOffDebts.length > 0 && (
        <div className="mb-4">
          <h3 className="text-white mb-3">
            <i className="bi bi-check-circle me-2"></i>
            Paid Off Debts ({paidOffDebts.length})
          </h3>
          <DebtsList debts={paidOffDebts} />
        </div>
      )}

      {/* Add Debt Modal */}
      <AddDebtModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />

      {/* Empty State */}
      {debts.length === 0 && (
        <Card className="text-center py-5 bg-grey-dark border-maroon">
          <Card.Body>
            <i className="bi bi-cash-coin display-4 text-maroon-light mb-3"></i>
            <h4 className="text-white mb-2">No Debts Tracked</h4>
            <p className="text-maroon-light mb-4">
              Start tracking your loans and debts to manage your financial obligations
            </p>
            <Button 
              variant="maroon"
              onClick={() => setShowAddModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Your First Debt
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Quick Stats */}
      {debts.length > 0 && (
        <Card className="bg-grey-dark border-maroon mt-4">
          <Card.Body className="p-3">
            <div className="row text-center">
              <div className="col-4">
                <div className="h6 text-white">{debts.length}</div>
                <small className="text-maroon-light">Total Debts</small>
              </div>
              <div className="col-4">
                <div className="h6 text-white">{activeDebts.length}</div>
                <small className="text-maroon-light">Active</small>
              </div>
              <div className="col-4">
                <div className="h6 text-white">{paidOffDebts.length}</div>
                <small className="text-maroon-light">Paid Off</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Debts;