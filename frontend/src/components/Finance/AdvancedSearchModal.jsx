// src/components/Finance/AdvancedSearchModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Card, Badge, InputGroup } from 'react-bootstrap';
import { useSearch } from '../../context/SearchContext';
import { useFinance } from '../../context/FinanceContext';
import { indianCategories } from '../../utils/storage';

function AdvancedSearchModal({ show, handleClose, onSearchResults }) {
  const [filters, setFilters] = useState({
    query: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    categories: [],
    type: 'all'
  });
  const [suggestions, setSuggestions] = useState([]);
  const { searchTransactions, getSearchSuggestions } = useSearch();
  const { transactions } = useFinance();

  useEffect(() => {
    if (filters.query && filters.query.length > 2) {
      setSuggestions(getSearchSuggestions(filters.query));
    } else {
      setSuggestions([]);
    }
  }, [filters.query, getSearchSuggestions]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryToggle = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSearch = () => {
    // Convert amount filters to numbers
    const processedFilters = {
      ...filters,
      minAmount: filters.minAmount ? parseFloat(filters.minAmount) : undefined,
      maxAmount: filters.maxAmount ? parseFloat(filters.maxAmount) : undefined
    };

    const results = searchTransactions(processedFilters);
    onSearchResults(results, processedFilters);
    handleClose();
  };

  const handleSuggestionClick = (suggestion) => {
    setFilters(prev => ({ ...prev, query: suggestion }));
    setSuggestions([]);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      categories: [],
      type: 'all'
    });
    setSuggestions([]);
  };

  const hasActiveFilters = () => {
    return filters.query || filters.minAmount || filters.maxAmount || 
           filters.startDate || filters.endDate || 
           filters.categories.length > 0 || filters.type !== 'all';
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="advanced-search-modal">
      <Modal.Header closeButton className="bg-grey-dark border-maroon">
        <Modal.Title className="text-white">
          <i className="bi bi-search-heart me-2"></i>
          Advanced Search
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-grey-dark text-white p-4">
        {/* Search Query */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white mb-2">
            <i className="bi bi-search me-1"></i>
            Search Text
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Search in descriptions, categories, notes..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="bg-grey-medium border-maroon text-white"
          />
          {suggestions.length > 0 && (
            <Card className="mt-2 bg-grey-medium border-maroon">
              <Card.Body className="p-2">
                <small className="text-maroon-light mb-1 d-block">Suggestions:</small>
                <div className="d-flex flex-wrap gap-1">
                  {suggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      bg="secondary"
                      className="cursor-pointer hover-bg-maroon"
                      onClick={() => handleSuggestionClick(suggestion)}
                      style={{ cursor: 'pointer' }}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Form.Group>

        <Row className="g-3 mb-4">
          {/* Amount Range */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white">
                <i className="bi bi-currency-rupee me-1"></i>
                Min Amount
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-grey-medium border-maroon text-white">₹</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  className="bg-grey-medium border-maroon text-white"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white">
                <i className="bi bi-currency-rupee me-1"></i>
                Max Amount
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-grey-medium border-maroon text-white">₹</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="100000"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  className="bg-grey-medium border-maroon text-white"
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          {/* Date Range */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white">
                <i className="bi bi-calendar me-1"></i>
                From Date
              </Form.Label>
              <Form.Control
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="bg-grey-medium border-maroon text-white"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white">
                <i className="bi bi-calendar me-1"></i>
                To Date
              </Form.Label>
              <Form.Control
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="bg-grey-medium border-maroon text-white"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Transaction Type */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white">
            <i className="bi bi-filter me-1"></i>
            Transaction Type
          </Form.Label>
          <Form.Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-grey-medium border-maroon text-white"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </Form.Select>
        </Form.Group>

        {/* Categories */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white">
            <i className="bi bi-tags me-1"></i>
            Categories
          </Form.Label>
          <Card className="bg-grey-medium border-maroon">
            <Card.Body className="p-3">
              <div className="d-flex flex-wrap gap-2">
                {indianCategories.map(category => (
                  <Badge
                    key={category}
                    bg={filters.categories.includes(category) ? "maroon" : "secondary"}
                    className="cursor-pointer px-3 py-2"
                    onClick={() => handleCategoryToggle(category)}
                    style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                  >
                    {category}
                    {filters.categories.includes(category) && (
                      <i className="bi bi-check-lg ms-2"></i>
                    )}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Form.Group>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <Card className="bg-maroon border-maroon mb-4">
            <Card.Body className="p-3">
              <h6 className="text-white mb-2">
                <i className="bi bi-funnel me-2"></i>
                Active Filters:
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {filters.query && (
                  <Badge bg="light" text="dark" className="px-2 py-1">
                    <i className="bi bi-search me-1"></i>
                    "{filters.query}"
                  </Badge>
                )}
                {filters.minAmount && (
                  <Badge bg="warning" text="dark" className="px-2 py-1">
                    <i className="bi bi-arrow-up me-1"></i>
                    Min: ₹{filters.minAmount}
                  </Badge>
                )}
                {filters.maxAmount && (
                  <Badge bg="warning" text="dark" className="px-2 py-1">
                    <i className="bi bi-arrow-down me-1"></i>
                    Max: ₹{filters.maxAmount}
                  </Badge>
                )}
                {filters.startDate && (
                  <Badge bg="success" className="px-2 py-1">
                    <i className="bi bi-calendar-plus me-1"></i>
                    From: {filters.startDate}
                  </Badge>
                )}
                {filters.endDate && (
                  <Badge bg="success" className="px-2 py-1">
                    <i className="bi bi-calendar-minus me-1"></i>
                    To: {filters.endDate}
                  </Badge>
                )}
                {filters.type !== 'all' && (
                  <Badge bg="primary" className="px-2 py-1">
                    <i className="bi bi-filter me-1"></i>
                    {filters.type}
                  </Badge>
                )}
                {filters.categories.map(cat => (
                  <Badge key={cat} bg="info" className="px-2 py-1">
                    <i className="bi bi-tag me-1"></i>
                    {cat}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      
      <Modal.Footer className="bg-grey-dark border-maroon p-3">
        <Button 
          variant="outline-secondary" 
          onClick={clearFilters}
          disabled={!hasActiveFilters()}
        >
          <i className="bi bi-x-circle me-2"></i>
          Clear All
        </Button>
        <div className="flex-grow-1"></div>
        <Button variant="outline-light" onClick={handleClose}>
          <i className="bi bi-x me-2"></i>
          Cancel
        </Button>
        <Button variant="maroon" onClick={handleSearch}>
          <i className="bi bi-search me-2"></i>
          Search
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AdvancedSearchModal;