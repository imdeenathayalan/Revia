// src/components/Finance/SavedSearchesManager.jsx
import { useState } from 'react';
import { Modal, Button, ListGroup, Badge, Form } from 'react-bootstrap';
import { useSearch } from '../../context/SearchContext';

function SavedSearchesManager({ show, handleClose, onLoadSearch }) {
  const { savedSearches, deleteSavedSearch, pinSearch } = useSearch();
  const [searchName, setSearchName] = useState('');

  const handleSaveCurrentSearch = () => {
    if (searchName.trim()) {
      // This would need to receive current filters as props
      console.log('Saving search:', searchName);
      setSearchName('');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="bg-grey-dark border-maroon">
        <Modal.Title className="text-white">
          <i className="bi bi-bookmark me-2"></i>
          Saved Searches
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-grey-dark text-white">
        {/* Save Current Search */}
        <div className="mb-4 p-3 bg-grey-medium rounded">
          <h6 className="text-white mb-2">Save Current Search</h6>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Name this search..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="bg-grey-dark border-maroon text-white mb-2"
            />
          </Form.Group>
          <Button 
            variant="maroon" 
            size="sm"
            disabled={!searchName.trim()}
            onClick={handleSaveCurrentSearch}
          >
            Save Search
          </Button>
        </div>

        {/* Saved Searches List */}
        <h6 className="text-white mb-3">Your Saved Searches</h6>
        {savedSearches.length === 0 ? (
          <p className="text-maroon-light text-center py-3">
            No saved searches yet
          </p>
        ) : (
          <ListGroup variant="flush">
            {savedSearches.map((search) => (
              <ListGroup.Item key={search.id} className="bg-grey-medium border-maroon text-white">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="d-flex align-items-center mb-1">
                      <span className="fw-bold">{search.name}</span>
                      {search.isPinned && (
                        <Badge bg="warning" className="ms-2">
                          <i className="bi bi-pin"></i>
                        </Badge>
                      )}
                    </div>
                    <small className="text-maroon-light">
                      Created: {new Date(search.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="d-flex gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onLoadSearch(search.filters)}
                    >
                      <i className="bi bi-play"></i>
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => pinSearch(search.id)}
                    >
                      <i className={`bi bi-pin${search.isPinned ? '-fill' : ''}`}></i>
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteSavedSearch(search.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      
      <Modal.Footer className="bg-grey-dark border-maroon">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SavedSearchesManager;