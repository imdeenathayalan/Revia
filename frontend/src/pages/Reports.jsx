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
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <h1 className="text-2xl font-bold text-white m-0">
          <i className="bi bi-bar-chart me-3"></i>
          Financial Reports
        </h1>
        <div className="d-flex gap-2">
          {/* CSV Export Button - Green Theme */}
          <Button 
            variant="success"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-lg border-2 border-success text-white hover:bg-green-700 hover:border-green-700 transition-colors d-flex align-items-center"
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Export CSV
          </Button>
          
          {/* PDF Export Button - Red/Maroon Theme */}
          <Button 
            variant="danger"
            onClick={() => setShowPDFModal(true)}
            className="px-4 py-2 rounded-lg border-2 border-maroon bg-maroon hover:bg-maroon-dark hover:border-maroon-dark text-white transition-colors d-flex align-items-center"
          >
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Export PDF
          </Button>
        </div>
      </div>

      <ReportFilters filters={filters} setFilters={setFilters} />

      <Row className="g-4 mb-6">
        <Col md={4}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon hover:bg-grey-medium transition-colors">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-green-400">
                <i className="bi bi-arrow-up-circle"></i>
              </div>
              <Card.Title className="text-lg font-semibold text-white mb-2 hover:text-black">
                Total Income
              </Card.Title>
              <Card.Text className="text-2xl font-bold text-green-400 hover:text-black">
                {formatIndianCurrency(totals.income)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon hover:bg-grey-medium transition-colors">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-red-400">
                <i className="bi bi-arrow-down-circle"></i>
              </div>
              <Card.Title className="text-lg font-semibold text-white mb-2 hover:text-black">
                Total Expenses
              </Card.Title>
              <Card.Text className="text-2xl font-bold text-red-400 hover:text-black">
                {formatIndianCurrency(totals.expenses)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon hover:bg-grey-medium transition-colors">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-white">
                <i className="bi bi-wallet2"></i>
              </div>
              <Card.Title className="text-lg font-semibold text-white mb-2 hover:text-black">
                Net Balance
              </Card.Title>
              <Card.Text className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-400' : 'text-red-400'} hover:text-black`}>
                {formatIndianCurrency(totals.balance)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <CategoryPieChart transactions={filteredTransactions} />
        </Col>
        <Col lg={6}>
          <IncomeExpenseChart transactions={filteredTransactions} />
        </Col>
      </Row>

      <Card className="mt-6 bg-grey-dark border border-maroon hover:bg-grey-medium transition-colors">
        <Card.Body className="p-4 text-center">
          <p className="text-white mb-0 hover:text-black">
            <i className="bi bi-info-circle me-2"></i>
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} 
            {filters.startDate && filters.endDate && 
              ` from ${new Date(filters.startDate).toLocaleDateString('en-IN')} to ${new Date(filters.endDate).toLocaleDateString('en-IN')}`
            }
          </p>
        </Card.Body>
      </Card>

      <PDFExportModal
        show={showPDFModal}
        handleClose={() => setShowPDFModal(false)}
      />
    </Container>
  );
}

export default Reports;