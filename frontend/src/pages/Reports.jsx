import { useState, useMemo } from 'react';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';
import ReportFilters from '../components/Finance/ReportFilters';
import CategoryPieChart from '../components/Finance/CategoryPieChart';
import IncomeExpenseChart from '../components/Finance/IncomeExpenseChart';
import PDFExportModal from '../components/Finance/PDFExportModal';
import { formatIndianCurrency, calculateTotals } from '../utils/storage';
import './Reports.css'; // Import the custom CSS file

function Reports() {
  const { transactions } = useFinance();
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    categories: [],
    type: 'all'
  });
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= filters.startDate && 
               transactionDate <= filters.endDate;
      });
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(transaction => 
        filters.categories.includes(transaction.category)
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(transaction => 
        filters.type === 'income' ? transaction.amount > 0 : transaction.amount < 0
      );
    }

    return filtered;
  }, [transactions, filters]);

  const totals = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions]);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
      const csvData = filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString('en-IN'),
        t.description,
        t.category,
        Math.abs(t.amount).toFixed(2),
        t.amount > 0 ? 'Income' : 'Expense'
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revia-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      setExportMessage('CSV exported successfully!');
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      setExportMessage('Error exporting CSV. Please try again.');
      setTimeout(() => setExportMessage(''), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickPDFExport = async () => {
    setIsExporting(true);
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const { generateQuickPDF } = await import('../utils/pdfGenerator');
      const reportData = {
        totals: totals,
        transactions: filteredTransactions,
        filters: filters
      };
      
      generateQuickPDF(reportData);
      setExportMessage('Quick PDF generated successfully!');
      setTimeout(() => setExportMessage(''), 3000);
    } catch (error) {
      setExportMessage('Error generating PDF. Please try again.');
      setTimeout(() => setExportMessage(''), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto reports-container">
      {/* Header Section */}
      <div className="reports-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 p-3 p-md-4 rounded-lg shadow-lg border border-[#3a506b] bg-gradient-to-br from-[#243447] to-[#141d26]">
        <div className="flex-grow-1">
          <h1 className="text-2xl font-semibold text-white mb-2 mb-md-0 d-flex align-items-center">
            <i className="bi bi-bar-chart me-2"></i>
            Financial Reports
          </h1>
          <p className="text-gray-300 mb-0 d-none d-md-block">
            Analyze your financial data with comprehensive reports
          </p>
        </div>
        
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          {/* CSV Export Button */}
          <Button 
            variant="success"
            onClick={handleExportCSV}
            disabled={isExporting || filteredTransactions.length === 0}
            className="export-btn csv-btn flex-grow-1 flex-sm-grow-0 px-3 px-sm-4 py-2 rounded-lg border-2 border-success text-white d-flex align-items-center justify-content-center"
            size="sm"
          >
            {isExporting ? (
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i className="bi bi-file-earmark-spreadsheet me-1 me-sm-2"></i>
            )}
            <span className="d-none d-sm-inline">Export</span> CSV
          </Button>
          
          {/* Quick PDF Export Button */}
          <Button 
            variant="info"
            onClick={handleQuickPDFExport}
            disabled={isExporting || filteredTransactions.length === 0}
            className="export-btn pdf-btn flex-grow-1 flex-sm-grow-0 px-3 px-sm-4 py-2 rounded-lg border-2 border-info text-white d-flex align-items-center justify-content-center"
            size="sm"
          >
            {isExporting ? (
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <i className="bi bi-file-earmark-pdf me-1 me-sm-2"></i>
            )}
            <span className="d-none d-sm-inline">Quick</span> PDF
          </Button>
          
          {/* Advanced PDF Export Button */}
          <Button 
            variant="danger"
            onClick={() => setShowPDFModal(true)}
            disabled={filteredTransactions.length === 0}
            className="export-btn advanced-btn flex-grow-1 flex-sm-grow-0 px-3 px-sm-4 py-2 rounded-lg border-2 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] text-white d-flex align-items-center justify-content-center"
            size="sm"
          >
            <i className="bi bi-gear-wide-connected me-1 me-sm-2"></i>
            <span className="d-none d-sm-inline">Advanced</span> PDF
          </Button>
        </div>
      </div>

      {exportMessage && (
        <Alert 
          variant={exportMessage.includes('Error') ? 'danger' : 'success'} 
          className="export-alert mb-4 d-flex align-items-center"
          dismissible
          onClose={() => setExportMessage('')}
        >
          <i className={`bi ${exportMessage.includes('Error') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
          {exportMessage}
        </Alert>
      )}

      {/* Filters Section with increased bottom margin */}
      <div className="filters-section mb-5">
        <ReportFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Summary Cards - Fixed responsive layout */}
      <Row className="summary-cards g-3 mb-5">
        <Col xs={12} md={4} className="mb-3 mb-md-0">
          <Card className="summary-card income-card h-100 text-center border-0 shadow-lg bg-[#2c3e50] border-[#3a506b]">
            <Card.Body className="p-3 p-md-4 d-flex flex-column justify-content-center align-items-center">
              <div className="summary-icon text-green-400 mb-2 d-flex align-items-center justify-content-center">
                <i className="bi bi-arrow-up-circle fs-1"></i>
              </div>
              <Card.Title className="text-md font-semibold text-white mb-2">
                Total Income
              </Card.Title>
              <Card.Text className="summary-amount text-green-400 mb-0">
                {formatIndianCurrency(totals.income)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4} className="mb-3 mb-md-0">
          <Card className="summary-card expense-card h-100 text-center border-0 shadow-lg bg-[#2c3e50] border-[#3a506b]">
            <Card.Body className="p-3 p-md-4 d-flex flex-column justify-content-center align-items-center">
              <div className="summary-icon text-red-400 mb-2 d-flex align-items-center justify-content-center">
                <i className="bi bi-arrow-down-circle fs-1"></i>
              </div>
              <Card.Title className="text-md font-semibold text-white mb-2">
                Total Expenses
              </Card.Title>
              <Card.Text className="summary-amount text-red-400 mb-0">
                {formatIndianCurrency(totals.expenses)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4}>
          <Card className="summary-card balance-card h-100 text-center border-0 shadow-lg bg-[#2c3e50] border-[#3a506b]">
            <Card.Body className="p-3 p-md-4 d-flex flex-column justify-content-center align-items-center">
              <div className="summary-icon text-white mb-2 d-flex align-items-center justify-content-center">
                <i className="bi bi-wallet2 fs-1"></i>
              </div>
              <Card.Title className="text-md font-semibold text-white mb-2">
                Net Balance
              </Card.Title>
              <Card.Text className={`summary-amount mb-0 ${totals.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatIndianCurrency(totals.balance)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section - Fixed responsive layout */}
      <Row className="charts-section g-3 mb-5">
        <Col xs={12} lg={6} className="mb-4 mb-lg-0">
          <div className="chart-container h-100 bg-[#2c3e50] border border-[#3a506b] rounded-lg p-3">
            <CategoryPieChart transactions={filteredTransactions} />
          </div>
        </Col>
        <Col xs={12} lg={6}>
          <div className="chart-container h-100 bg-[#2c3e50] border border-[#3a506b] rounded-lg p-3">
            <IncomeExpenseChart transactions={filteredTransactions} />
          </div>
        </Col>
      </Row>

      {/* Info Card */}
      <Card className="info-card bg-[#2c3e50] border border-[#3a506b]">
        <Card.Body className="p-3 p-md-4 text-center d-flex flex-column flex-md-row justify-content-center align-items-center">
          <p className="text-white mb-1 mb-md-0 d-flex align-items-center">
            <i className="bi bi-info-circle me-2"></i>
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} 
            {filters.startDate && filters.endDate && 
              ` from ${new Date(filters.startDate).toLocaleDateString('en-IN')} to ${new Date(filters.endDate).toLocaleDateString('en-IN')}`
            }
          </p>
          {filteredTransactions.length > 0 && (
            <p className="text-gray-300 mt-2 mt-md-0 ms-md-3 d-flex align-items-center">
              <i className="bi bi-filter me-2"></i>
              {filters.categories.length > 0 && `${filters.categories.length} categor${filters.categories.length !== 1 ? 'ies' : 'y'} selected • `}
              {filters.type !== 'all' && `${filters.type} only`}
              {filters.categories.length === 0 && filters.type === 'all' && 'All categories and types'}
            </p>
          )}
        </Card.Body>
      </Card>

      <PDFExportModal
        show={showPDFModal}
        handleClose={() => setShowPDFModal(false)}
        reportData={{
          totals: totals,
          transactions: filteredTransactions,
          filters: filters
        }}
      />
    </div>
  );
}

export default Reports;