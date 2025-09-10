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
    <Modal show={show} onHide={handleClose} size="lg" centered className="border-0">
      <Modal.Header closeButton className="bg-gray-800 border-b border-gray-700 p-4">
        <Modal.Title className="text-white font-semibold text-xl">
          <i className="bi bi-file-earmark-pdf me-2 text-[#ff7b46]"></i>
          Export PDF Report
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-gray-800 text-white p-5">
        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
          className="border-b border-gray-700 mb-4"
        >
          <Tab eventKey="content" title="Content" className="border-0">
            <div className="pt-4">
              <h6 className="text-white mb-3 font-semibold flex items-center">
                <i className="bi bi-layout-wtf me-2 text-[#ff7b46]"></i>
                Report Template
              </h6>
              
              <Row className="g-3 mb-4">
                {Object.values(PDF_TEMPLATES).map(template => (
                  <Col key={template.id} md={6}>
                    <Card 
                      className={`cursor-pointer h-100 border-2 ${
                        exportOptions.template === template.id 
                          ? 'border-[#ff5252] bg-[#3a506b]' 
                          : 'border-gray-600 bg-gray-700 hover:border-[#ff5252]'
                      } transition-all`}
                      onClick={() => handleTemplateChange(template.id)}
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0 me-3">
                            <i className={`bi bi-file-earmark-pdf fs-5 ${
                              exportOptions.template === template.id ? 'text-[#ff5252]' : 'text-gray-400'
                            }`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className={`mb-1 ${exportOptions.template === template.id ? 'text-[#ff5252]' : 'text-white'}`}>
                              {template.name}
                            </h6>
                            <p className={`mb-0 small ${exportOptions.template === template.id ? 'text-[#ff7b46]' : 'text-gray-400'}`}>
                              {template.description}
                            </p>
                          </div>
                          {exportOptions.template === template.id && (
                            <i className="bi bi-check-circle-fill text-green-400"></i>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <h6 className="text-white mb-3 font-semibold flex items-center">
                <i className="bi bi-check2-square me-2 text-[#ff7b46]"></i>
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
                    className="text-white mb-3"
                  />
                  <Form.Check
                    type="checkbox"
                    id="include-budgets"
                    label="Budgets"
                    checked={exportOptions.includeBudgets}
                    onChange={() => handleOptionChange('includeBudgets')}
                    className="text-white mb-3"
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
                    className="text-white mb-3"
                    disabled={true}
                  />
                </Col>
              </Row>
            </div>
          </Tab>

          <Tab eventKey="settings" title="Settings" className="border-0">
            <div className="pt-4">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                      <i className="bi bi-calendar-range me-2 text-[#ff7b46]"></i>
                      Time Period
                    </Form.Label>
                    <div className="relative">
                      <Form.Select
                        value={exportOptions.dateRange}
                        onChange={(e) => handleOptionChange('dateRange', e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
                      >
                        <option value="all">All Time</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                        <option value="custom">Custom Range</option>
                      </Form.Select>
                      <i className="bi bi-calendar-range text-[#ff7b46] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                    </div>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                      <i className="bi bi-calendar me-2 text-[#ff7b46]"></i>
                      {isCustomRange ? 'Custom Date Range*' : 'Date Range'}
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <div className="relative flex-1">
                        <Form.Control
                          type="date"
                          value={exportOptions.startDate}
                          onChange={(e) => handleOptionChange('startDate', e.target.value)}
                          className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
                          disabled={!isCustomRange}
                        />
                        <i className="bi bi-calendar text-[#ff7b46] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                      </div>
                      <div className="relative flex-1">
                        <Form.Control
                          type="date"
                          value={exportOptions.endDate}
                          onChange={(e) => handleOptionChange('endDate', e.target.value)}
                          className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
                          disabled={!isCustomRange}
                        />
                        <i className="bi bi-calendar text-[#ff7b46] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                      </div>
                    </div>
                    {isCustomRange && (
                      <Form.Text className="text-gray-400">
                        * Select start and end dates
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                      <i className="bi bi-file-earmark me-2 text-[#ff7b46]"></i>
                      Paper Size
                    </Form.Label>
                    <div className="relative">
                      <Form.Select
                        value={exportOptions.paperSize}
                        onChange={(e) => handleOptionChange('paperSize', e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
                      >
                        <option value="a4">A4</option>
                        <option value="letter">Letter</option>
                        <option value="legal">Legal</option>
                      </Form.Select>
                      <i className="bi bi-file-earmark text-[#ff7b46] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                      <i className="bi bi-arrow-left-right me-2 text-[#ff7b46]"></i>
                      Orientation
                    </Form.Label>
                    <div className="relative">
                      <Form.Select
                        value={exportOptions.orientation}
                        onChange={(e) => handleOptionChange('orientation', e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-[#ff5252] focus:border-transparent"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </Form.Select>
                      <i className="bi bi-arrow-left-right text-[#ff7b46] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Tab>
        </Tabs>

        {error && (
          <Alert variant="danger" className="bg-red-900 border border-red-700 text-red-200 rounded-lg mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Card className="bg-gray-700 border border-gray-600">
          <Card.Body className="p-4">
            <h6 className="text-white mb-2 font-semibold">Report Preview</h6>
            <div className="text-sm text-gray-300">
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
      
      <Modal.Footer className="bg-gray-800 border-t border-gray-700 p-4">
        <Button 
          variant="outline-secondary" 
          onClick={handleClose}
          disabled={isGenerating}
          className="px-4 py-2 rounded-lg border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Cancel
        </Button>
        
        <Button 
          className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 text-white hover:from-[#ff4141] hover:to-[#ff6b35] transition-colors"
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