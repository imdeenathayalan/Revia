// src/pages/Reports.jsx
import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';
import ReportFilters from '../components/Finance/ReportFilters';
import CategoryPieChart from '../components/Finance/CategoryPieChart';
import IncomeExpenseChart from '../components/Finance/IncomeExpenseChart';
import { formatIndianCurrency, calculateTotals } from '../utils/storage';

function Reports() {
  const { transactions } = useFinance();
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    categories: [],
    type: 'all' // all, income, expense
  });

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by date range
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= filters.startDate && 
               transactionDate <= filters.endDate;
      });
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(transaction => 
        filters.categories.includes(transaction.category)
      );
    }

    // Filter by type
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
        <Button 
          variant="outline-light"
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-lg border border-maroon text-white hover:bg-maroon transition-colors"
        >
          <i className="bi bi-download me-2"></i>
          Export CSV
        </Button>
      </div>

      <ReportFilters filters={filters} setFilters={setFilters} />

      {/* Summary Cards */}
      <Row className="g-4 mb-6">
        <Col md={4}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-green-400">
                <i className="bi bi-arrow-up-circle"></i>
              </div>
              <Card.Title className="text-lg font-semibold text-white mb-2">
                Total Income
              </Card.Title>
              <Card.Text className="text-2xl font-bold text-green-400">
                {formatIndianCurrency(totals.income)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-red-400">
                <i className="bi bi-arrow-down-circle"></i>
              </div>
              <Card.Title className="text-lg font-semibold text-white mb-2">
                Total Expenses
              </Card.Title>
              <Card.Text className="text-2xl font-bold text-red-400">
                {formatIndianCurrency(totals.expenses)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon">
            <Card.Body className="p-4">
              <div className="text-3xl mb-2 text-white">
                <i className="bi bi-wallet2"></i>
              </div>
              <Card.Title className="text-lg font-semibold text-white mb-2">
                Net Balance
              </Card.Title>
              <Card.Text className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatIndianCurrency(totals.balance)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4">
        <Col lg={6}>
          <CategoryPieChart transactions={filteredTransactions} />
        </Col>
        <Col lg={6}>
          <IncomeExpenseChart transactions={filteredTransactions} />
        </Col>
      </Row>

      {/* Transaction Count */}
      <Card className="mt-6 bg-grey-dark border border-maroon">
        <Card.Body className="p-4 text-center">
          <p className="text-white mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} 
            {filters.startDate && filters.endDate && 
              ` from ${filters.startDate.toLocaleDateString('en-IN')} to ${filters.endDate.toLocaleDateString('en-IN')}`
            }
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Reports;