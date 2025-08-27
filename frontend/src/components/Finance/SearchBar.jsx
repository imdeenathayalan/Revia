// src/components/Finance/SearchBar.jsx
import { useState } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { useSearch } from '../../context/SearchContext';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const { getSearchSuggestions } = useSearch();

  const handleSearch = () => {
    if (query.trim()) {
      onSearch({ query: query.trim() });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch({});
  };

  return (
    <InputGroup className="mb-3">
      <Form.Control
        type="text"
        placeholder="Search transactions..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="bg-grey-medium border-maroon text-black"
      />
      {query && (
        <Button
          variant="outline-secondary"
          onClick={clearSearch}
          className="border-maroon"
        >
          <i className="bi bi-x"></i>
        </Button>
      )}
      <Button
        variant="maroon"
        onClick={handleSearch}
        disabled={!query.trim()}
      >
        <i className="bi bi-search"></i>
      </Button>
    </InputGroup>
  );
}

export default SearchBar;