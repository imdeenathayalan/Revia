// src/pages/Debts.jsx
import { useState } from 'react';
import { Button, Card, Row, Col, Alert, ProgressBar, Badge } from 'react-bootstrap';
import { useDebt } from '../context/DebtContext';
import DebtsList from '../components/Finance/DebtsList';
import AddDebtModal from '../components/Finance/AddDebtModal';
import { formatIndianCurrency } from '../utils/storage';
import './Debts.css'; // Import the CSS file for animations

function Debts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { debts, calculateDebtTotals, isLoading } = useDebt();

  if (isLoading) {
    return (
      <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-[#ff5252]" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading debts...</p>
        </div>
      </div>
    );
  }

  const totals = calculateDebtTotals();
  const activeDebts = debts.filter(debt => debt.isActive);
  const paidOffDebts = debts.filter(debt => !debt.isActive);
  
  // Calculate debt progress percentage
  const debtProgressPercentage = totals.totalDebt > 0 
    ? Math.min(100, (totals.totalPaid / (totals.totalDebt + totals.totalPaid)) * 100) 
    : 0;

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto debts-container">
      {/* Header Section - Improved with better visual hierarchy */}
      <div className="debts-header animate-fade-in bg-gradient-to-br from-[#243447] to-[#141d26] border-[#3a506b]">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            <i className="bi bi-cash-coin me-3 text-[#ff7b46]"></i>
            Debt Management
          </h1>
          <p className="text-gray-300 mb-0">
            Track and manage your loans, EMIs, and debts
          </p>
        </div>
        
        <Button 
          className="px-4 py-2 fw-semibold d-flex align-items-center add-debt-btn bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Debt
        </Button>
      </div>

      {/* Overall Progress Bar */}
      {debts.length > 0 && (
        <Card className="bg-[#2c3e50] border-[#3a506b] mb-4 progress-card animate-slide-up shadow-lg">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="text-white mb-0 font-semibold">Overall Debt Progress</h5>
              <Badge className="fs-6 progress-badge bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0">
                {debtProgressPercentage.toFixed(1)}% Paid
              </Badge>
            </div>
            <ProgressBar 
              now={debtProgressPercentage} 
              className="mb-2 progress-bar-animated bg-[#3a506b]"
            >
              <ProgressBar 
                variant={debtProgressPercentage > 70 ? "success" : debtProgressPercentage > 40 ? "warning" : "danger"}
                now={debtProgressPercentage} 
                className={debtProgressPercentage > 70 ? "bg-success" : debtProgressPercentage > 40 ? "bg-warning" : "bg-danger"}
              />
            </ProgressBar>
            <div className="d-flex justify-content-between text-gray-300 small">
              <span>₹0</span>
              <span>{formatIndianCurrency(totals.totalDebt + totals.totalPaid)}</span>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Debt Summary - Improved with better visual indicators */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <Card className="h-100 text-center bg-[#2c3e50] border-[#3a506b] summary-card animate-slide-up delay-1 shadow-lg">
            <Card.Body className="p-4 position-relative">
              <div className="text-3xl mb-2 text-white position-absolute top-0 end-0 mt-3 me-3 opacity-25">
                <i className="bi bi-currency-rupee"></i>
              </div>
              <Card.Title className="text-white mb-2 d-flex align-items-center justify-content-center font-semibold">
                <i className="bi bi-currency-rupee me-2 text-[#ff5252]"></i>
                Total Debt
              </Card.Title>
              <Card.Text className="text-2xl font-bold text-[#ff5252] mb-0">
                {formatIndianCurrency(totals.totalDebt)}
              </Card.Text>
              {totals.totalDebt > 0 && (
                <div className="mt-2 small text-gray-300">
                  {activeDebts.length} active debt{activeDebts.length !== 1 ? 's' : ''}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4}>
          <Card className="h-100 text-center bg-[#2c3e50] border-[#3a506b] summary-card animate-slide-up delay-2 shadow-lg">
            <Card.Body className="p-4 position-relative">
              <div className="text-3xl mb-2 text-white position-absolute top-0 end-0 mt-3 me-3 opacity-25">
                <i className="bi bi-calendar-check"></i>
              </div>
              <Card.Title className="text-white mb-2 d-flex align-items-center justify-content-center font-semibold">
                <i className="bi bi-calendar-check me-2 text-[#ff7b46]"></i>
                Monthly Payments
              </Card.Title>
              <Card.Text className="text-2xl font-bold text-[#ff7b46] mb-0">
                {formatIndianCurrency(totals.totalMonthlyPayment)}
              </Card.Text>
              {totals.totalMonthlyPayment > 0 && (
                <div className="mt-2 small text-gray-300">
                  Due across all debts
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4}>
          <Card className="h-100 text-center bg-[#2c3e50] border-[#3a506b] summary-card animate-slide-up delay-3 shadow-lg">
            <Card.Body className="p-4 position-relative">
              <div className="text-3xl mb-2 text-white position-absolute top-0 end-0 mt-3 me-3 opacity-25">
                <i className="bi bi-check-circle"></i>
              </div>
              <Card.Title className="text-white mb-2 d-flex align-items-center justify-content-center font-semibold">
                <i className="bi bi-check-circle me-2 text-[#48bb78]"></i>
                Total Paid
              </Card.Title>
              <Card.Text className="text-2xl font-bold text-[#48bb78] mb-0">
                {formatIndianCurrency(totals.totalPaid)}
              </Card.Text>
              {totals.totalPaid > 0 && (
                <div className="mt-2 small text-gray-300">
                  Across {paidOffDebts.length} paid off debt{paidOffDebts.length !== 1 ? 's' : ''}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Active Debts - Improved section header */}
      {activeDebts.length > 0 && (
        <div className="mb-4 animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-white mb-0 font-semibold">
              <i className="bi bi-clock-history me-2 text-[#ff7b46]"></i>
              Active Debts <Badge className="ms-2 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0">{activeDebts.length}</Badge>
            </h3>
            <small className="text-gray-300">
              Total monthly payment: {formatIndianCurrency(totals.totalMonthlyPayment)}
            </small>
          </div>
          <DebtsList debts={activeDebts} />
        </div>
      )}

      {/* Paid Off Debts - Improved section header */}
      {paidOffDebts.length > 0 && (
        <div className="mb-4 animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-white mb-0 font-semibold">
              <i className="bi bi-check-circle me-2 text-[#48bb78]"></i>
              Paid Off Debts <Badge bg="success" className="ms-2 bg-[#48bb78] border-0">{paidOffDebts.length}</Badge>
            </h3>
            <small className="text-gray-300">
              Total amount paid: {formatIndianCurrency(totals.totalPaid)}
            </small>
          </div>
          <DebtsList debts={paidOffDebts} />
        </div>
      )}

      {/* Add Debt Modal */}
      <AddDebtModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />

      {/* Empty State - Improved with better visual design */}
      {debts.length === 0 && (
        <Card className="text-center py-5 bg-[#2c3e50] border-[#3a506b] empty-state-card animate-pulse shadow-lg">
          <Card.Body className="p-5">
            <div className="empty-state-icon mb-3">
              <i className="bi bi-cash-coin display-4 text-gray-300"></i>
            </div>
            <h4 className="text-white mb-2 font-semibold">No Debts Tracked</h4>
            <p className="text-gray-300 mb-4 mx-auto" style={{maxWidth: '400px'}}>
              Start tracking your loans and debts to better manage your financial obligations and payment schedules
            </p>
            <Button 
              className="px-4 add-debt-btn bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0"
              onClick={() => setShowAddModal(true)}
              size="lg"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Your First Debt
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Quick Stats - Improved with better layout */}
      {debts.length > 0 && (
        <Card className="bg-[#2c3e50] border-[#3a506b] mt-4 stats-card animate-fade-in shadow-lg">
          <Card.Body className="p-3">
            <h6 className="text-white text-center mb-3 font-semibold">Debt Overview</h6>
            <div className="row text-center">
              <div className="col-4 border-end border-[#3a506b]">
                <div className="h5 text-white font-semibold">{debts.length}</div>
                <small className="text-gray-300">Total Debts</small>
              </div>
              <div className="col-4 border-end border-[#3a506b]">
                <div className="h5 text-[#ff7b46] font-semibold">{activeDebts.length}</div>
                <small className="text-gray-300">Active</small>
              </div>
              <div className="col-4">
                <div className="h5 text-[#48bb78] font-semibold">{paidOffDebts.length}</div>
                <small className="text-gray-300">Paid Off</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Debts;