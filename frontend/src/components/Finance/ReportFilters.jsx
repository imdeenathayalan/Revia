import { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { indianCategories } from '../../utils/storage';

function ReportFilters({ filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : '',
    endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : '',
    dateRange: 'all'
  });
  const [error, setError] = useState('');

  const handleApplyFilters = () => {
    // Validate custom date range
    if (localFilters.dateRange === 'custom') {
      if (!localFilters.startDate || !localFilters.endDate) {
        setError('Please select both start and end dates for custom range');
        return;
      }
      if (new Date(localFilters.startDate) > new Date(localFilters.endDate)) {
        setError('Start date cannot be after end date');
        return;
      }
    }

    const appliedFilters = {
      ...localFilters,
      startDate: localFilters.startDate ? new Date(localFilters.startDate) : null,
      endDate: localFilters.endDate ? new Date(localFilters.endDate) : null
    };
    
    // Clear any preset dates if not using custom range
    if (localFilters.dateRange !== 'custom') {
      appliedFilters.startDate = null;
      appliedFilters.endDate = null;
    }
    
    setFilters(appliedFilters);
    setError('');
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: null,
      endDate: null,
      categories: [],
      type: 'all',
      dateRange: 'all'
    };
    setLocalFilters({
      ...resetFilters,
      startDate: '',
      endDate: ''
    });
    setFilters(resetFilters);
    setError('');
  };

  const handleCategoryToggle = (category) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleDateRangeChange = (range) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      dateRange: range,
      // Clear dates when switching from custom range
      ...(range !== 'custom' && { startDate: '', endDate: '' })
    }));
  };

  const handleDateChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const isCustomRange = localFilters.dateRange === 'custom';

  return (
    <Card className="mb-6 shadow-lg border border-maroon bg-grey-dark">
      <Card.Body className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          <i className="bi bi-funnel me-2"></i>
          Filter Reports
        </h3>

        {error && (
          <Alert variant="danger" className="mb-4 bg-maroon-dark border-maroon text-white">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        <Row className="g-4">
          {/* Date Range Selection */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white mb-2">Time Period</Form.Label>
              <Form.Select
                value={localFilters.dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="bg-grey-medium border-maroon text-white"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Custom Date Range Inputs */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white mb-2">
                {isCustomRange ? 'Custom Date Range*' : 'Date Range'}
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="bg-grey-medium border-maroon text-black"
                  disabled={!isCustomRange}
                  required={isCustomRange}
                />
                <Form.Control
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="bg-grey-medium border-maroon text-black"
                  disabled={!isCustomRange}
                  required={isCustomRange}
                />
              </div>
              {isCustomRange && (
                <Form.Text className="text-maroon-light">
                  * Required for custom range
                </Form.Text>
              )}
            </Form.Group>
          </Col>

          {/* Transaction Type */}
          <Col md={3}>
            <Form.Group>
              <Form.Label className="text-white mb-2">Transaction Type</Form.Label>
              <Form.Select
                value={localFilters.type}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, type: e.target.value }))}
                className="bg-grey-medium border-maroon text-white"
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Action Buttons */}
          <Col md={3} className="d-flex align-items-end">
            <div className="d-flex gap-2 w-100">
              <Button
                onClick={handleApplyFilters}
                className="flex-grow-1 bg-maroon hover:bg-maroon-dark border-maroon"
              >
                <i className="bi bi-check me-2"></i>
                Apply
              </Button>
              <Button
                variant="outline-secondary"
                onClick={handleReset}
                className="border-maroon text-white"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </Button>
            </div>
          </Col>
        </Row>

        {/* Categories */}
        <Form.Group className="mt-4">
          <Form.Label className="text-white mb-2">Categories</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {indianCategories.map(category => (
              <Button
                key={category}
                variant={localFilters.categories.includes(category) ? 'maroon' : 'outline-maroon'}
                size="sm"
                onClick={() => handleCategoryToggle(category)}
                className="rounded-pill border-maroon text-white"
              >
                {category}
                {localFilters.categories.includes(category) && (
                  <i className="bi bi-check ms-2"></i>
                )}
              </Button>
            ))}
          </div>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default ReportFilters;