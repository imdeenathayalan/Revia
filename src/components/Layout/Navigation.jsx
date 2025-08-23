import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-md"> {/* Tailwind shadow */}
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-xl font-bold"> {/* Tailwind text */}
          💰 Finance Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className="hover:text-gray-200 transition-colors duration-200" // Tailwind
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/transactions"
              className="hover:text-gray-200 transition-colors duration-200" // Tailwind
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