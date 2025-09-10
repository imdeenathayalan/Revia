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
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="lg" 
      className="advanced-search-modal w-full"
      contentClassName="bg-gradient-to-br from-[#0a192f] to-[#020c1b] border-[#3a506b]"
    >
      <Modal.Header closeButton className="bg-[#2c3e50] border-[#3a506b]">
        <Modal.Title className="text-white font-semibold font-poppins">
          <i className="bi bi-search-heart me-2"></i>
          Advanced Search
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-gradient-to-br from-[#0a192f] to-[#020c1b] text-white p-4 px-4 xl:px-6 2xl:px-8">
        {/* Search Query */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white mb-2 font-medium font-poppins">
            <i className="bi bi-search me-1"></i>
            Search Text
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Search in descriptions, categories, notes..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="bg-[#2c3e50] border-[#3a506b] text-white font-poppins placeholder-gray-400"
            style={{ color: 'white !important' }}
          />
          {suggestions.length > 0 && (
            <Card className="mt-2 bg-[#2c3e50] border-[#3a506b] shadow-lg">
              <Card.Body className="p-2">
                <small className="text-gray-300 mb-1 d-block font-medium font-poppins">Suggestions:</small>
                <div className="d-flex flex-wrap gap-1">
                  {suggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      className="cursor-pointer bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 font-medium font-poppins"
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
              <Form.Label className="text-white font-medium font-poppins">
                <i className="bi bi-currency-rupee me-1"></i>
                Min Amount
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-[#2c3e50] border-[#3a506b] text-white font-poppins">
                  <i className="bi bi-currency-rupee text-white"></i>
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  className="bg-[#2c3e50] border-[#3a506b] text-white font-poppins placeholder-gray-400"
                  style={{ color: 'white !important' }}
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white font-medium font-poppins">
                <i className="bi bi-currency-rupee me-1"></i>
                Max Amount
              </Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-[#2c3e50] border-[#3a506b] text-white font-poppins">
                  <i className="bi bi-currency-rupee text-white"></i>
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="100000"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  className="bg-[#2c3e50] border-[#3a506b] text-white font-poppins placeholder-gray-400"
                  style={{ color: 'white !important' }}
                />
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          {/* Date Range */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white font-medium font-poppins">
                <i className="bi bi-calendar me-1"></i>
                From Date
              </Form.Label>
              <Form.Control
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="bg-[#2c3e50] border-[#3a506b] text-white font-poppins"
                style={{ color: 'white !important' }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white font-medium font-poppins">
                <i className="bi bi-calendar me-1"></i>
                To Date
              </Form.Label>
              <Form.Control
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="bg-[#2c3e50] border-[#3a506b] text-white font-poppins"
                style={{ color: 'white !important' }}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Transaction Type */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white font-medium font-poppins">
            <i className="bi bi-filter me-1"></i>
            Transaction Type
          </Form.Label>
          <Form.Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-[#2c3e50] border-[#3a506b] text-white font-poppins"
            style={{ color: 'white !important' }}
          >
            <option value="all" className="text-white bg-[#2c3e50]">All Transactions</option>
            <option value="income" className="text-white bg-[#2c3e50]">Income Only</option>
            <option value="expense" className="text-white bg-[#2c3e50]">Expenses Only</option>
          </Form.Select>
        </Form.Group>

        {/* Categories */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white font-medium font-poppins">
            <i className="bi bi-tags me-1"></i>
            Categories
          </Form.Label>
          <Card className="bg-[#2c3e50] border-[#3a506b] shadow-lg">
            <Card.Body className="p-3">
              <div className="d-flex flex-wrap gap-2">
                {indianCategories.map(category => (
                  <Badge
                    key={category}
                    className={`cursor-pointer px-3 py-2 font-medium font-poppins ${
                      filters.categories.includes(category) 
                        ? "bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 text-white" 
                        : "bg-[#3a506b] border-0 text-white"
                    }`}
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
          <Card className="bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 shadow-lg mb-4">
            <Card.Body className="p-3">
              <h6 className="text-white mb-2 font-semibold font-poppins">
                <i className="bi bi-funnel me-2"></i>
                Active Filters:
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {filters.query && (
                  <Badge className="px-2 py-1 font-medium font-poppins bg-white text-gray-800">
                    <i className="bi bi-search me-1"></i>
                    "{filters.query}"
                  </Badge>
                )}
                {filters.minAmount && (
                  <Badge className="px-2 py-1 font-medium font-poppins bg-white text-gray-800">
                    <i className="bi bi-arrow-up me-1"></i>
                    Min: ₹{filters.minAmount}
                  </Badge>
                )}
                {filters.maxAmount && (
                  <Badge className="px-2 py-1 font-medium font-poppins bg-white text-gray-800">
                    <i className="bi bi-arrow-down me-1"></i>
                    Max: ₹{filters.maxAmount}
                  </Badge>
                )}
                {filters.startDate && (
                  <Badge className="px-2 py-1 font-medium font-poppins bg-white text-gray-800">
                    <i className="bi bi-calendar-plus me-1"></i>
                    From: {filters.startDate}
                  </Badge>
                )}
                {filters.endDate && (
                  <Badge className="px-2 py-1 font-medium font-poppins bg-white text-gray-800">
                    <i className="bi bi-calendar-minus me-1"></i>
                    To: {filters.endDate}
                  </Badge>
                )}
                {filters.type !== 'all' && (
                  <Badge className="px-2 py-1 font-medium font-poppins bg-white text-gray-800">
                    <i className="bi bi-filter me-1"></i>
                    {filters.type}
                  </Badge>
                )}
                {filters.categories.map(cat => (
                  <Badge key={cat} className="px-2 py-1 font-medium font-poppins bg-white text-gray-800">
                    <i className="bi bi-tag me-1"></i>
                    {cat}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
      
      <Modal.Footer className="bg-[#2c3e50] border-[#3a506b] p-3">
        <Button 
          variant="outline-light" 
          onClick={clearFilters}
          disabled={!hasActiveFilters()}
          className="font-semibold font-poppins"
        >
          <i className="bi bi-x-circle me-2"></i>
          Clear All
        </Button>
        <div className="flex-grow-1"></div>
        <Button variant="outline-light" onClick={handleClose} className="font-semibold font-poppins">
          <i className="bi bi-x me-2"></i>
          Cancel
        </Button>
        <Button 
          className="bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 font-semibold font-poppins"
          onClick={handleSearch}
        >
          <i className="bi bi-search me-2"></i>
          Search
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AdvancedSearchModal;