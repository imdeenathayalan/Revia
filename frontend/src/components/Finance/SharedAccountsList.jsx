// src/components/Finance/SharedAccountsList.jsx
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useShared } from '../../context/SharedContext';
import { formatIndianCurrency } from '../../utils/storage';

function SharedAccountsList() {
  const { sharedAccounts } = useShared();

  if (sharedAccounts.length === 0) {
    return null;
  }

  const getAccountTypeBadge = (type) => {
    const typeConfig = {
      household: { variant: 'primary', icon: 'bi-house' },
      roommate: { variant: 'info', icon: 'bi-people' },
      couple: { variant: 'danger', icon: 'bi-heart' },
      project: { variant: 'warning', icon: 'bi-briefcase' },
      other: { variant: 'secondary', icon: 'bi-wallet' }
    };
    
    const config = typeConfig[type] || typeConfig.other;
    return (
      <Badge bg={config.variant} className="me-2">
        <i className={`${config.icon} me-1`}></i>
        {type}
      </Badge>
    );
  };

  return (
    <Row>
      {sharedAccounts.map((account) => (
        <Col key={account.id} xs={12} md={6} lg={4} className="mb-3">
          <Card className="h-100 bg-grey-dark border-maroon">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="text-white mb-1">
                    <i className="bi bi-wallet me-2"></i>
                    {account.name}
                  </h6>
                  {getAccountTypeBadge(account.type)}
                  <Badge bg="light" text="dark">
                    {account.currency}
                  </Badge>
                </div>
                <Button
                  variant="outline-primary"
                  size="sm"
                >
                  <i className="bi bi-eye"></i>
                </Button>
              </div>
              
              {account.description && (
                <p className="text-maroon-light small mb-3">{account.description}</p>
              )}
              
              <div className="space-y-2">
                <div className="d-flex justify-content-between">
                  <span className="text-white">Balance:</span>
                  <strong className="text-white">{formatIndianCurrency(account.balance)}</strong>
                </div>
                
                <div className="d-flex justify-content-between">
                  <span className="text-white">Members:</span>
                  <span className="text-white">{account.members.length}</span>
                </div>
                
                {account.invitations && account.invitations.length > 0 && (
                  <div className="d-flex justify-content-between">
                    <span className="text-white">Pending Invites:</span>
                    <span className="text-warning">{account.invitations.length}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <Button variant="outline-light" size="sm" className="me-2">
                  <i className="bi bi-pencil me-1"></i>
                  Edit
                </Button>
                <Button variant="outline-info" size="sm">
                  <i className="bi bi-person-plus me-1"></i>
                  Invite
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default SharedAccountsList;