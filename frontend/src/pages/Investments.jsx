// src/pages/Investments.jsx
import { useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { useInvestment } from '../context/InvestmentContext';
import InvestmentsList from '../components/Finance/InvestmentsList';
import AddInvestmentModal from '../components/Finance/AddInvestmentModal';
import { formatIndianCurrency } from '../utils/storage';

function Investments() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { investments, calculateTotals, isLoading } = useInvestment();

  if (isLoading) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner-border text-maroon" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading investments...</p>
        </div>
      </Container>
    );
  }

  const totals = calculateTotals();

  return (
    <Container>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 p-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            <i className="bi bi-graph-up-arrow me-3"></i>
            Investments
          </h1>
          <p className="text-maroon-light">
            Track your stocks, mutual funds, and other investments
          </p>
        </div>
        
        <Button 
          variant="maroon"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Investment
        </Button>
      </div>

      {/* Portfolio Summary */}
      {investments.length > 0 && (
        <Row className="g-3 mb-4">
          <Col xs={12} md={4}>
            <Card className="h-100 text-center bg-grey-dark border-maroon">
              <Card.Body className="p-4">
                <div className="text-3xl mb-2 text-white">
                  <i className="bi bi-wallet2"></i>
                </div>
                <Card.Title className="text-white mb-2">Portfolio Value</Card.Title>
                <Card.Text className="text-2xl font-bold text-success">
                  {formatIndianCurrency(totals.portfolioValue)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={12} md={4}>
            <Card className="h-100 text-center bg-grey-dark border-maroon">
              <Card.Body className="p-4">
                <div className="text-3xl mb-2 text-white">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <Card.Title className="text-white mb-2">Total Invested</Card.Title>
                <Card.Text className="text-2xl font-bold text-info">
                  {formatIndianCurrency(totals.investedAmount)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={12} md={4}>
            <Card className="h-100 text-center bg-grey-dark border-maroon">
              <Card.Body className="p-4">
                <div className="text-3xl mb-2 text-white">
                  <i className="bi bi-graph-up"></i>
                </div>
                <Card.Title className="text-white mb-2">Profit/Loss</Card.Title>
                <Card.Text className={`text-2xl font-bold ${totals.gainLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatIndianCurrency(totals.gainLoss)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Investments List */}
      <InvestmentsList />

      {/* Add Investment Modal */}
      <AddInvestmentModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />

      {/* Empty State */}
      {investments.length === 0 && (
        <Card className="text-center py-5 bg-grey-dark border-maroon">
          <Card.Body>
            <i className="bi bi-graph-up-arrow display-4 text-maroon-light mb-3"></i>
            <h4 className="text-white mb-2">No Investments Yet</h4>
            <p className="text-maroon-light mb-4">
              Start tracking your investments to see your portfolio growth
            </p>
            <Button 
              variant="maroon"
              onClick={() => setShowAddModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Your First Investment
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Investments;