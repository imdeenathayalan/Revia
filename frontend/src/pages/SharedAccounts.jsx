// src/pages/SharedAccounts.jsx
import { useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { useShared } from '../context/SharedContext';
import SharedAccountsList from '../components/Finance/SharedAccountsList';
import CreateSharedAccountModal from '../components/Finance/CreateSharedAccountModal';
import { formatIndianCurrency } from '../utils/storage';

function SharedAccounts() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { sharedAccounts, isLoading } = useShared();

  if (isLoading) {
    return (
      <Container>
        <div className="text-center py-5">
          <div className="spinner-border text-maroon" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white mt-3">Loading shared accounts...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 p-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            <i className="bi bi-people me-3"></i>
            Shared Accounts
          </h1>
          <p className="text-maroon-light">
            Manage shared budgets with family, roommates, or partners
          </p>
        </div>
        
        <Button 
          variant="maroon"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create Shared Account
        </Button>
      </div>

      {/* Shared Accounts List */}
      <SharedAccountsList />

      {/* Create Account Modal */}
      <CreateSharedAccountModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
      />

      {/* Empty State */}
      {sharedAccounts.length === 0 && (
        <Card className="text-center py-5 bg-grey-dark border-maroon">
          <Card.Body>
            <i className="bi bi-people display-4 text-maroon-light mb-3"></i>
            <h4 className="text-white mb-2">No Shared Accounts</h4>
            <p className="text-maroon-light mb-4">
              Create a shared account to manage finances with others
            </p>
            <Button 
              variant="maroon"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Your First Shared Account
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default SharedAccounts;