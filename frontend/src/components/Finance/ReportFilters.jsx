// src/components/Finance/ReportFilters.jsx
import { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { indianCategories } from '../../utils/storage';

function ReportFilters({ filters, setFilters }) {
  const [localFilters, setLocalFilters] = useState({
    ...filters,
    startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : '',
    endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''
  });

  const handleApplyFilters = () => {
    const appliedFilters = {
      ...localFilters,
      startDate: localFilters.startDate ? new Date(localFilters.startDate) : null,
      endDate: localFilters.endDate ? new Date(localFilters.endDate) : null
    };
    setFilters(appliedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: null,
      endDate: null,
      categories: [],
      type: 'all'
    };
    setLocalFilters({
      ...resetFilters,
      startDate: '',
      endDate: ''
    });
    setFilters(resetFilters);
  };

  const handleCategoryToggle = (category) => {
    setLocalFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleDateChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="mb-6 shadow-lg border border-maroon bg-grey-dark">
      <Card.Body className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          <i className="bi bi-funnel me-2"></i>
          Filter Reports
        </h3>

        <Row className="g-4">
          {/* Date Range */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white mb-2">Date Range</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="bg-grey-medium border-maroon text-white"
                />
                <Form.Control
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="bg-grey-medium border-maroon text-white"
                />
              </div>
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
                className="rounded-pill border-maroon"
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