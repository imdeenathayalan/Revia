import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="grey-dark" variant="dark" expand="lg" className="mb-4 shadow-lg border-b border-maroon">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-xl font-bold text-white">
          <i className="bi bi-currency-rupee me-2"></i>
          Revia
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-maroon" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className="hover:text-maroon-dark transition-colors duration-200 text-white"
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/transactions"
                  className="hover:text-maroon-dark transition-colors duration-200 text-white"
                >
                  <i className="bi bi-currency-exchange me-1"></i>
                  Transactions
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/reports"
                  className="hover:text-maroon-dark transition-colors duration-200 text-white"
                >
                  <i className="bi bi-bar-chart me-1"></i>
                  Reports
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/settings"
                  className="hover:text-maroon-dark transition-colors duration-200 text-white"
                >
                  <i className="bi bi-gear me-1"></i>
                  Settings
                </Nav.Link>
              </Nav>
              <Nav>
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-light" 
                    id="dropdown-basic"
                    className="border-maroon text-white bg-transparent dropdown-custom"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name || 'User'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bg-grey-dark border border-maroon p-0 overflow-hidden dropdown-menu-custom">
                    <Dropdown.Item 
                      className="text-white dropdown-item-custom py-2"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link 
                as={Link} 
                to="/login"
                className="hover:text-maroon-dark transition-colors duration-200 text-white"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/signup"
                className="ml-2 px-4 py-2 bg-maroon hover:bg-maroon-dark text-white rounded-lg transition-colors duration-200"
              >
                <i className="bi bi-person-plus me-1"></i>
                Sign Up
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
      
      <style>{`
        .dropdown-custom:hover, .dropdown-custom:focus {
          background-color: var(--color-maroon-dark) !important;
          border-color: var(--color-maroon-dark) !important;
          color: white !important;
        }
        .dropdown-menu-custom {
          border-color: var(--color-maroon) !important;
        }
        .dropdown-item-custom:hover, .dropdown-item-custom:focus {
          background-color: var(--color-maroon-dark) !important;
          color: white !important;
        }
        .dropdown-item-custom:hover ~ .dropdown-menu-custom,
        .dropdown-menu-custom:hover {
          border-color: var(--color-maroon-dark) !important;
        }
        .dropdown-menu {
          min-width: 100% !important;
        }
        .dropdown-item {
          padding: 0.5rem 1rem !important;
          margin: 0 !important;
          border-radius: 0 !important;
        }
      `}</style>
    </Navbar>
  );
}

export default Navigation;