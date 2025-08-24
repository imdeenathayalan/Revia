import { useState } from 'react';
import { Modal, Button, Form, Card, Row, Col, Alert } from 'react-bootstrap';
import { useFinance } from '../../context/FinanceContext';
import { useBudget } from '../../context/BudgetContext';
import { useGoal } from '../../context/GoalContext';
import { generatePDF } from '../../utils/pdfGenerator';
import { formatIndianCurrency, formatDisplayDate } from '../../utils/storage';

function PDFExportModal({ show, handleClose }) {
  const [exportOptions, setExportOptions] = useState({
    includeTransactions: true,
    includeCharts: true,
    includeBudgets: true,
    includeGoals: true,
    dateRange: 'all',
    startDate: '',
    endDate: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const { transactions, totals } = useFinance();
  const { budgets } = useBudget();
  const { goals } = useGoal();

  const handleOptionChange = (option) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleDateRangeChange = (range) => {
    setExportOptions(prev => ({ 
      ...prev, 
      dateRange: range,
      ...(range !== 'custom' && { startDate: '', endDate: '' })
    }));
    setError('');
  };

  const handleDateChange = (field, value) => {
    setExportOptions(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleExportPDF = async () => {
    if (exportOptions.dateRange === 'custom') {
      if (!exportOptions.startDate || !exportOptions.endDate) {
        setError('Please select both start and end dates for custom range');
        return;
      }
      if (new Date(exportOptions.startDate) > new Date(exportOptions.endDate)) {
        setError('Start date cannot be after end date');
        return;
      }
    }

    setIsGenerating(true);
    
    try {
      const reportData = {
        totals: totals,
        transactions: exportOptions.includeTransactions ? transactions : [],
        budgets: exportOptions.includeBudgets ? budgets : [],
        goals: exportOptions.includeGoals ? goals : []
      };

      // Generate actual PDF
      generatePDF(reportData, {
        includeSummary: true,
        includeTransactions: exportOptions.includeTransactions,
        includeBudgets: exportOptions.includeBudgets,
        includeGoals: exportOptions.includeGoals
      });

    } catch (error) {
      console.error('PDF generation failed:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      handleClose();
    }
  };

  const isCustomRange = exportOptions.dateRange === 'custom';

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="shadow-xl">
      <Modal.Header closeButton className="border-b border-maroon bg-white">
        <Modal.Title className="text-xl font-semibold text-black">
          <i className="bi bi-file-earmark-pdf me-2"></i>
          Export PDF Report
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-6 bg-white">
        {error && (
          <Alert variant="danger" className="mb-4 bg-red-100 border-red-400 text-red-800">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <div className="mb-4">
          <h4 className="text-black font-semibold mb-3">Report Options</h4>
          
          <Card className="mb-3 border-maroon">
            <Card.Body className="p-3">
              <Form.Check
                type="switch"
                id="include-transactions"
                label="Include Transactions"
                checked={exportOptions.includeTransactions}
                onChange={() => handleOptionChange('includeTransactions')}
                className="text-black mb-2"
              />
              <Form.Check
                type="switch"
                id="include-charts"
                label="Include Charts"
                checked={exportOptions.includeCharts}
                onChange={() => handleOptionChange('includeCharts')}
                className="text-black mb-2"
              />
              <Form.Check
                type="switch"
                id="include-budgets"
                label="Include Budgets"
                checked={exportOptions.includeBudgets}
                onChange={() => handleOptionChange('includeBudgets')}
                className="text-black mb-2"
              />
              <Form.Check
                type="switch"
                id="include-goals"
                label="Include Goals"
                checked={exportOptions.includeGoals}
                onChange={() => handleOptionChange('includeGoals')}
                className="text-black"
              />
            </Card.Body>
          </Card>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-black">Time Period</Form.Label>
                <Form.Select
                  value={exportOptions.dateRange}
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                  className="border-maroon text-black"
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-black">
                  {isCustomRange ? 'Custom Date Range*' : 'Date Range'}
                </Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="date"
                    value={exportOptions.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="border-maroon text-black"
                    disabled={!isCustomRange}
                    required={isCustomRange}
                  />
                  <Form.Control
                    type="date"
                    value={exportOptions.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="border-maroon text-black"
                    disabled={!isCustomRange}
                    required={isCustomRange}
                  />
                </div>
                {isCustomRange && (
                  <Form.Text className="text-maroon">
                    * Select start and end dates
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
        </div>

        <Card className="bg-grey-light border-maroon">
          <Card.Body className="p-3">
            <h5 className="text-black font-semibold mb-2">Report Preview</h5>
            <div className="text-sm text-black">
              <p>• Financial Summary: {formatIndianCurrency(totals.balance)} Balance</p>
              <p>• Transactions: {transactions.length} records</p>
              <p>• Budgets: {budgets.length} active budgets</p>
              <p>• Goals: {goals.length} savings goals</p>
              <p>• Generated: {formatDisplayDate(new Date())}</p>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
      
      <Modal.Footer className="border-t border-maroon px-6 py-4 bg-white">
        <Button 
          variant="outline-secondary" 
          onClick={handleClose}
          disabled={isGenerating}
          className="px-4 py-2 rounded-lg border border-gray-400 text-black hover:bg-gray-100"
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancel
        </Button>
        <Button 
          className="px-4 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white border border-maroon"
          onClick={handleExportPDF}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Generating...
            </>
          ) : (
            <>
              <i className="bi bi-download me-2"></i>
              Generate PDF
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PDFExportModal;