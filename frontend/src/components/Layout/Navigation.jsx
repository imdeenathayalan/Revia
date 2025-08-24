import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Navigation({ authState, updateAuthState }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    updateAuthState(false, null);
    navigate('/login');
  };

  return (
    <Navbar bg="white" variant="light" expand="lg" className="mb-4 shadow-lg border-b border-red-600">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-xl font-bold text-red-600">
          <i className="bi bi-currency-rupee me-2"></i>
          Revia
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-red-600" />
        <Navbar.Collapse id="basic-navbar-nav">
          {authState.isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className="hover:text-red-700 transition-colors duration-200 text-black"
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/transactions"
                  className="hover:text-red-700 transition-colors duration-200 text-black"
                >
                  <i className="bi bi-currency-exchange me-1"></i>
                  Transactions
                </Nav.Link>
              </Nav>
              <Nav>
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-danger" 
                    id="dropdown-basic"
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {authState.user?.name || 'User'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bg-white border border-red-600">
                    <Dropdown.Item 
                      className="text-black hover:bg-red-100 hover:text-red-700"
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
                className="hover:text-red-700 transition-colors duration-200 text-black"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/signup"
                className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                <i className="bi bi-person-plus me-1"></i>
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