import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';
import ReportFilters from '../components/Finance/ReportFilters';
import CategoryPieChart from '../components/Finance/CategoryPieChart';
import IncomeExpenseChart from '../components/Finance/IncomeExpenseChart';
import PDFExportModal from '../components/Finance/PDFExportModal';
import { formatIndianCurrency, calculateTotals } from '../utils/storage';

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

  const handleExportCSV = () => {
    try {
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
    }
  };

  const handleQuickPDFExport = async () => {
    try {
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
    }
  };

  return (
    <Container fluid="lg" className="px-3 px-md-4 px-lg-5">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 p-3 p-md-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <div className="flex-grow-1">
          <h1 className="text-2xl font-bold text-white mb-2 mb-md-0">
            <i className="bi bi-bar-chart me-2"></i>
            Financial Reports
          </h1>
          <p className="text-maroon-light mb-0 d-none d-md-block">
            Analyze your financial data with comprehensive reports
          </p>
        </div>
        
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          {/* CSV Export Button */}
          <Button 
            variant="success"
            onClick={handleExportCSV}
            className="flex-grow-1 flex-sm-grow-0 px-3 px-sm-4 py-2 rounded-lg border-2 border-success text-white hover:bg-green-700 transition-colors d-flex align-items-center justify-content-center"
            size="sm"
          >
            <i className="bi bi-file-earmark-spreadsheet me-1 me-sm-2"></i>
            <span className="d-none d-sm-inline">Export</span> CSV
          </Button>
          
          {/* Quick PDF Export Button */}
          <Button 
            variant="info"
            onClick={handleQuickPDFExport}
            className="flex-grow-1 flex-sm-grow-0 px-3 px-sm-4 py-2 rounded-lg border-2 border-info text-white hover:bg-blue-700 transition-colors d-flex align-items-center justify-content-center"
            size="sm"
          >
            <i className="bi bi-file-earmark-pdf me-1 me-sm-2"></i>
            <span className="d-none d-sm-inline">Quick</span> PDF
          </Button>
          
          {/* Advanced PDF Export Button */}
          <Button 
            variant="danger"
            onClick={() => setShowPDFModal(true)}
            className="flex-grow-1 flex-sm-grow-0 px-3 px-sm-4 py-2 rounded-lg border-2 border-maroon bg-maroon hover:bg-maroon-dark text-white transition-colors d-flex align-items-center justify-content-center"
            size="sm"
          >
            <i className="bi bi-gear-wide-connected me-1 me-sm-2"></i>
            <span className="d-none d-sm-inline">Advanced</span> PDF
          </Button>
        </div>
      </div>

      {exportMessage && (
        <Alert variant={exportMessage.includes('Error') ? 'danger' : 'success'} className="mb-4">
          <i className={`bi ${exportMessage.includes('Error') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
          {exportMessage}
        </Alert>
      )}

      <ReportFilters filters={filters} setFilters={setFilters} />

      {/* Summary Cards - Fixed responsive layout */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={4} className="mb-3 mb-md-0">
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon transition-colors">
            <Card.Body className="p-3 p-md-4">
              <div className="text-2xl text-3xl-md mb-2 text-green-400">
                <i className="bi bi-arrow-up-circle"></i>
              </div>
              <Card.Title className="text-md font-semibold text-white mb-2">
                Total Income
              </Card.Title>
              <Card.Text className="text-xl text-2xl-md font-bold text-green-400">
                {formatIndianCurrency(totals.income)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4} className="mb-3 mb-md-0">
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon transition-colors">
            <Card.Body className="p-3 p-md-4">
              <div className="text-2xl text-3xl-md mb-2 text-red-400">
                <i className="bi bi-arrow-down-circle"></i>
              </div>
              <Card.Title className="text-md font-semibold text-white mb-2">
                Total Expenses
              </Card.Title>
              <Card.Text className="text-xl text-2xl-md font-bold text-red-400">
                {formatIndianCurrency(totals.expenses)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} md={4}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon transition-colors">
            <Card.Body className="p-3 p-md-4">
              <div className="text-2xl text-3xl-md mb-2 text-white">
                <i className="bi bi-wallet2"></i>
              </div>
              <Card.Title className="text-md font-semibold text-white mb-2">
                Net Balance
              </Card.Title>
              <Card.Text className={`text-xl text-2xl-md font-bold ${totals.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatIndianCurrency(totals.balance)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section - Fixed responsive layout */}
      <Row className="g-3 mb-4">
        <Col xs={12} lg={6} className="mb-4 mb-lg-0">
          <div className="h-100">
            <CategoryPieChart transactions={filteredTransactions} />
          </div>
        </Col>
        <Col xs={12} lg={6}>
          <div className="h-100">
            <IncomeExpenseChart transactions={filteredTransactions} />
          </div>
        </Col>
      </Row>

      {/* Info Card */}
      <Card className="bg-grey-dark border border-maroon transition-colors">
        <Card.Body className="p-3 p-md-4 text-center">
          <p className="text-white mb-1">
            <i className="bi bi-info-circle me-2"></i>
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} 
            {filters.startDate && filters.endDate && 
              ` from ${new Date(filters.startDate).toLocaleDateString('en-IN')} to ${new Date(filters.endDate).toLocaleDateString('en-IN')}`
            }
          </p>
          {filteredTransactions.length > 0 && (
            <p className="text-maroon-light mt-2">
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
    </Container>
  );
}

export default Reports;