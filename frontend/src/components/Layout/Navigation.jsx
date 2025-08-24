import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Navigation({ authState, updateAuthState }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    updateAuthState(false, null);
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-lg border-b border-red-800">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-xl font-bold text-red-400">
          💰 Finance Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-red-600" />
        <Navbar.Collapse id="basic-navbar-nav">
          {authState.isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className="hover:text-red-300 transition-colors duration-200 text-gray-300"
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/transactions"
                  className="hover:text-red-300 transition-colors duration-200 text-gray-300"
                >
                  Transactions
                </Nav.Link>
              </Nav>
              <Nav>
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-light" 
                    id="dropdown-basic"
                    className="border-red-600 text-red-300 hover:bg-red-700 hover:text-white"
                  >
                    👤 {authState.user?.name || 'User'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bg-gray-800 border border-red-700">
                    <Dropdown.Item 
                      className="text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={handleLogout}
                    >
                      🚪 Logout
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
                className="hover:text-red-300 transition-colors duration-200 text-gray-300"
              >
                Login
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/signup"
                className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Sign Up
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;