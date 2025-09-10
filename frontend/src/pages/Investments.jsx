// src/pages/Investments.jsx
import { useState } from 'react';
import { Button, Card, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { useInvestment } from '../context/InvestmentContext';
import InvestmentsList from '../components/Finance/InvestmentsList';
import AddInvestmentModal from '../components/Finance/AddInvestmentModal';
import { formatIndianCurrency } from '../utils/storage';
import './Investments.css';

function Investments() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { investments, calculateTotals, isLoading } = useInvestment();

  if (isLoading) {
    return (
      <div className="w-full px-3 xl:px-5 2xl:px-6 mx-auto">
        <div className="text-center py-6">
          <div className="spinner-border text-accent-from" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3 text-sm">Loading investments...</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();
  const gainLossPercentage = totals.investedAmount > 0 
    ? (totals.gainLoss / totals.investedAmount) * 100 
    : 0;

  return (
    <div className="w-full px-3 xl:px-5 2xl:px-6 mx-auto font-poppins bg-gradient-to-br from-[#0a192f] to-[#020c1b] min-h-screen py-5">
      {/* Fixed Header Section with Icon and Text on Left for Desktop */}
      <div className="header-container animate-fade-in">
        <div className="header-content">
          <div className="rounded-icon-container">
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <div className="header-text">
            <h1>Investment Portfolio</h1>
            <p>Track stocks, mutual funds, and investments</p>
          </div>
        </div>
        
        <div className="header-actions">
          <Button 
            className="btn-enhanced"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            <span>Add Investment</span>
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      {investments.length > 0 && (
        <>
          {/* Overall Performance Card with increased top spacing */}
          <div className="mb-8">
            <Card className="bg-[#2c3e50] border-[#3a506b] shadow-md performance-card-spaced">
              <Card.Body className="p-5 md:p-6">
                <div className="d-flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-4 gap-2">
                  <h5 className="text-white font-semibold mb-0 text-sm md:text-base">Portfolio Performance</h5>
                  <Badge bg={totals.gainLoss >= 0 ? "success" : "danger"} className="px-3 py-2 text-xs md:text-sm rounded-md">
                    {gainLossPercentage >= 0 ? "+" : ""}{gainLossPercentage.toFixed(2)}%
                  </Badge>
                </div>
                <ProgressBar 
                  now={Math.abs(gainLossPercentage)} 
                  variant={totals.gainLoss >= 0 ? "success" : "danger"}
                  className="mb-4 performance-bar h-2"
                  max={100}
                />
                <div className="d-flex flex-col md:flex-row justify-content-between text-gray-300 font-medium text-sm md:text-base gap-3 md:gap-0">
                  <span className="bg-[#3a506b] px-3 py-2 rounded-md">Invested: {formatIndianCurrency(totals.investedAmount)}</span>
                  <span className="bg-[#3a506b] px-3 py-2 rounded-md">Current: {formatIndianCurrency(totals.portfolioValue)}</span>
                </div>
              </Card.Body>
            </Card>
          </div>

          <Row className="g-4 mb-8">
            <Col xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 text-center bg-[#2c3e50] border-[#3a506b] summary-card shadow-md">
                <Card.Body className="p-4 md:p-5 position-relative">
                  <div className="text-xl md:text-2xl mb-1 text-white position-absolute top-0 end-0 mt-3 me-3 opacity-20">
                    <i className="bi bi-wallet2"></i>
                  </div>
                  <div className="flex justify-center mb-3">
                    <div className="bg-green-500/20 p-3 rounded-full">
                      <i className="bi bi-wallet2 text-green-500 text-lg md:text-xl"></i>
                    </div>
                  </div>
                  <Card.Title className="text-white font-semibold mb-3 text-sm md:text-base">
                    Portfolio Value
                  </Card.Title>
                  <Card.Text className="text-lg md:text-xl font-semibold text-green-500 mb-0">
                    {formatIndianCurrency(totals.portfolioValue)}
                  </Card.Text>
                  {totals.gainLoss !== 0 && (
                    <div className={`mt-3 text-xs ${totals.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                      {totals.gainLoss >= 0 ? '↑' : '↓'} {formatIndianCurrency(Math.abs(totals.gainLoss))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 text-center bg-[#2c3e50] border-[#3a506b] summary-card shadow-md">
                <Card.Body className="p-4 md:p-5 position-relative">
                  <div className="text-xl md:text-2xl mb-1 text-white position-absolute top-0 end-0 mt-3 me-3 opacity-20">
                    <i className="bi bi-currency-rupee"></i>
                  </div>
                  <div className="flex justify-center mb-3">
                    <div className="bg-blue-400/20 p-3 rounded-full">
                      <i className="bi bi-currency-rupee text-blue-400 text-lg md:text-xl"></i>
                    </div>
                  </div>
                  <Card.Title className="text-white font-semibold mb-3 text-sm md:text-base">
                    Total Invested
                  </Card.Title>
                  <Card.Text className="text-lg md:text-xl font-semibold text-blue-400 mb-0">
                    {formatIndianCurrency(totals.investedAmount)}
                  </Card.Text>
                  <div className="mt-3 text-xs text-gray-300 font-medium">
                    {investments.length} investment{investments.length !== 1 ? 's' : ''}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs={12} lg={4} className="mb-4">
              <Card className="h-100 text-center bg-[#2c3e50] border-[#3a506b] summary-card shadow-md">
                <Card.Body className="p-4 md:p-5 position-relative">
                  <div className="text-xl md:text-2xl mb-1 text-white position-absolute top-0 end-0 mt-3 me-3 opacity-20">
                    <i className="bi bi-graph-up"></i>
                  </div>
                  <div className="flex justify-center mb-3">
                    <div className="bg-yellow-400/20 p-3 rounded-full">
                      <i className="bi bi-graph-up text-yellow-400 text-lg md:text-xl"></i>
                    </div>
                  </div>
                  <Card.Title className="text-white font-semibold mb-3 text-sm md:text-base">
                    Profit/Loss
                  </Card.Title>
                  <Card.Text className={`text-lg md:text-xl font-semibold ${totals.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'} mb-0`}>
                    {formatIndianCurrency(totals.gainLoss)}
                  </Card.Text>
                  <div className={`mt-3 text-xs ${totals.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                    {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Investments List */}
      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg md:text-xl mb-3 section-header">Your Investments</h3>
        </div>
        <InvestmentsList />
      </div>

      {/* Add Investment Modal */}
      <AddInvestmentModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />

      {/* Empty State */}
      {investments.length === 0 && (
        <Card className="text-center py-6 bg-[#2c3e50] border-[#3a506b] shadow-md my-6">
          <Card.Body className="p-5 md:p-6">
            <div className="empty-state-icon mb-4">
              <div className="bg-gray-300/20 p-4 rounded-full inline-flex">
                <i className="bi bi-graph-up-arrow text-2xl md:text-3xl text-gray-300"></i>
              </div>
            </div>
            <h4 className="text-white font-semibold mb-3 text-base md:text-lg">No Investments Yet</h4>
            <p className="text-gray-300 font-medium mb-4 mx-auto max-w-xs text-xs md:text-sm">
              Track investments to monitor portfolio growth
            </p>
            <Button 
              className="bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 font-semibold hover:opacity-90 transition-all duration-300 px-4 py-2 text-xs md:text-sm rounded-lg"
              onClick={() => setShowAddModal(true)}
              size="sm"
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add First Investment
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* Quick Stats */}
      {investments.length > 0 && (
        <Card className="bg-[#2c3e50] border-[#3a506b] mt-8 shadow-md">
          <Card.Body className="p-4 md:p-5">
            <h6 className="text-white font-semibold text-center mb-4 text-sm md:text-base">Investment Overview</h6>
            <div className="row text-center">
              <div className="col-4 border-end border-[#3a506b] py-3">
                <div className="h5 text-white font-semibold">{investments.length}</div>
                <small className="text-gray-300 font-medium text-xs">Total</small>
              </div>
              <div className="col-4 border-end border-[#3a506b] py-3">
                <div className="h5 text-green-500 font-semibold">{investments.filter(inv => inv.currentValue > inv.investedAmount).length}</div>
                <small className="text-gray-300 font-medium text-xs">Profitable</small>
              </div>
              <div className="col-4 py-3">
                <div className="h5 text-red-500 font-semibold">{investments.filter(inv => inv.currentValue <= inv.investedAmount).length}</div>
                <small className="text-gray-300 font-medium text-xs">Underwater</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Investments;