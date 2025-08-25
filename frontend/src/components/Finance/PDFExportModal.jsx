import { useState } from 'react';
import { Modal, Button, Form, Card, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';
import { useFinance } from '../../context/FinanceContext';
import { useBudget } from '../../context/BudgetContext';
import { useGoal } from '../../context/GoalContext';
import { generatePDF, PDF_TEMPLATES } from '../../utils/pdfGenerator';
import { formatIndianCurrency, formatDisplayDate } from '../../utils/storage';

function PDFExportModal({ show, handleClose, reportData }) {
  const [exportOptions, setExportOptions] = useState({
    template: 'STANDARD',
    includeTransactions: true,
    includeBudgets: false,
    includeGoals: false,
    dateRange: 'all',
    startDate: '',
    endDate: '',
    paperSize: 'a4',
    orientation: 'portrait'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('content');

  const handleOptionChange = (option, value = null) => {
    const newValue = value !== null ? value : !exportOptions[option];
    setExportOptions(prev => ({
      ...prev,
      [option]: newValue
    }));
  };

  const handleTemplateChange = (templateId) => {
    const template = PDF_TEMPLATES[templateId];
    setExportOptions(prev => ({
      ...prev,
      template: templateId,
      orientation: template.layout
    }));
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
    setError('');
    
    try {
      // Prepare data for PDF generation
      const pdfData = {
        totals: reportData.totals,
        transactions: exportOptions.includeTransactions ? reportData.transactions : [],
        budgets: exportOptions.includeBudgets ? [] : [], // Placeholder for future
        goals: exportOptions.includeGoals ? [] : [], // Placeholder for future
        filters: reportData.filters
      };

      await generatePDF(pdfData, exportOptions);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      // Don't close automatically on error so user can see the error message
      if (!error) {
        handleClose();
      }
    }
  };

  const isCustomRange = exportOptions.dateRange === 'custom';
  const selectedTemplate = PDF_TEMPLATES[exportOptions.template];

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="shadow-xl">
      <Modal.Header closeButton className="border-b border-maroon bg-white">
        <Modal.Title className="text-xl font-semibold text-black">
          <i className="bi bi-file-earmark-pdf me-2"></i>
          Export PDF Report
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0 bg-white">
        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="px-4 pt-3 border-bottom border-maroon"
        >
          <Tab eventKey="content" title="Content" className="border-0">
            <div className="p-3">
              <h6 className="text-black mb-3">
                <i className="bi bi-layout-wtf me-2"></i>
                Report Template
              </h6>
              
              <Row className="g-3 mb-4">
                {Object.values(PDF_TEMPLATES).map(template => (
                  <Col key={template.id} md={6}>
                    <Card 
                      className={`cursor-pointer h-100 border-2 ${
                        exportOptions.template === template.id 
                          ? 'border-maroon bg-maroon-light' 
                          : 'border-gray-300 bg-gray-50 hover-border-maroon'
                      } transition-all`}
                      onClick={() => handleTemplateChange(template.id)}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0 me-3">
                            <i className={`bi bi-file-earmark-pdf fs-5 ${
                              exportOptions.template === template.id ? 'text-maroon' : 'text-gray-600'
                            }`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className={`mb-1 ${exportOptions.template === template.id ? 'text-maroon' : 'text-black'}`}>
                              {template.name}
                            </h6>
                            <p className={`mb-0 small ${exportOptions.template === template.id ? 'text-maroon' : 'text-gray-600'}`}>
                              {template.description}
                            </p>
                          </div>
                          {exportOptions.template === template.id && (
                            <i className="bi bi-check-circle-fill text-success"></i>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <h6 className="text-black mb-3">
                <i className="bi bi-check2-square me-2"></i>
                Report Content
              </h6>
              
              <Row>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    id="include-transactions"
                    label="Transactions"
                    checked={exportOptions.includeTransactions}
                    onChange={() => handleOptionChange('includeTransactions')}
                    className="text-black mb-3"
                  />
                  <Form.Check
                    type="checkbox"
                    id="include-budgets"
                    label="Budgets"
                    checked={exportOptions.includeBudgets}
                    onChange={() => handleOptionChange('includeBudgets')}
                    className="text-black mb-3"
                    disabled={true}
                  />
                </Col>
                <Col md={6}>
                  <Form.Check
                    type="checkbox"
                    id="include-goals"
                    label="Goals"
                    checked={exportOptions.includeGoals}
                    onChange={() => handleOptionChange('includeGoals')}
                    className="text-black mb-3"
                    disabled={true}
                  />
                </Col>
              </Row>
            </div>
          </Tab>

          <Tab eventKey="settings" title="Settings" className="border-0">
            <div className="p-3">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-black">Time Period</Form.Label>
                    <Form.Select
                      value={exportOptions.dateRange}
                      onChange={(e) => handleOptionChange('dateRange', e.target.value)}
                      className="border-gray-300 text-black"
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
                        onChange={(e) => handleOptionChange('startDate', e.target.value)}
                        className="border-gray-300 text-black"
                        disabled={!isCustomRange}
                      />
                      <Form.Control
                        type="date"
                        value={exportOptions.endDate}
                        onChange={(e) => handleOptionChange('endDate', e.target.value)}
                        className="border-gray-300 text-black"
                        disabled={!isCustomRange}
                      />
                    </div>
                    {isCustomRange && (
                      <Form.Text className="text-muted">
                        * Select start and end dates
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-black">Paper Size</Form.Label>
                    <Form.Select
                      value={exportOptions.paperSize}
                      onChange={(e) => handleOptionChange('paperSize', e.target.value)}
                      className="border-gray-300 text-black"
                    >
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                      <option value="legal">Legal</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-black">Orientation</Form.Label>
                    <Form.Select
                      value={exportOptions.orientation}
                      onChange={(e) => handleOptionChange('orientation', e.target.value)}
                      className="border-gray-300 text-black"
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Tab>
        </Tabs>

        {error && (
          <Alert variant="danger" className="m-3 mb-0 bg-red-100 border-red-400 text-red-800">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Card className="m-3 bg-light border-maroon">
          <Card.Body className="p-3">
            <h6 className="text-black mb-2">Report Preview</h6>
            <div className="text-sm text-black">
              <p className="mb-1">
                <strong>Template:</strong> {selectedTemplate.name}
              </p>
              <p className="mb-1">
                <strong>Transactions:</strong> {exportOptions.includeTransactions ? reportData.transactions.length : 0} records
              </p>
              <p className="mb-1">
                <strong>Time Period:</strong> {exportOptions.dateRange === 'custom' ? 'Custom range' : exportOptions.dateRange}
              </p>
              <p className="mb-0">
                <strong>Layout:</strong> {exportOptions.orientation.toUpperCase()}, {exportOptions.paperSize.toUpperCase()}
              </p>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
      
      <Modal.Footer className="border-t border-maroon px-4 py-3 bg-white">
        <Button 
          variant="outline-secondary" 
          onClick={handleClose}
          disabled={isGenerating}
          className="px-4 py-2"
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancel
        </Button>
        
        <Button 
          className="px-4 py-2 bg-maroon hover:bg-maroon-dark text-white border-maroon"
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