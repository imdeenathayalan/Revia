import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-lg border-b border-red-800"> {/* Dark red border */}
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-xl font-bold text-red-400"> {/* Dark red text */}
          💰 Finance Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-red-600" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className="hover:text-red-300 transition-colors duration-200 text-gray-300" // Dark theme colors
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/transactions"
              className="hover:text-red-300 transition-colors duration-200 text-gray-300" // Dark theme colors
            >
              Transactions
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;