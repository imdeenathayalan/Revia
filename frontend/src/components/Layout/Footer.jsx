import { Container } from 'react-bootstrap';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-grey-dark text-white py-6 mt-8 border-t border-maroon">
      <Container className="text-center">
        <p className="mb-2 text-lg font-semibold text-maroon-light">
          <i className="bi bi-currency-rupee me-2"></i>
          Revia - Indian Finance Tracker
        </p>
        <p className="mb-2 text-white">
          &copy; {currentYear} Built by ARC-VORTEX
          <span className="block sm:inline"> | Manage your finances in ₹</span>
        </p>
        <small className="text-grey-light text-sm">
          <i className="bi bi-database me-1"></i>
          Data is stored locally in your browser.
        </small>
      </Container>
    </footer>
  );
}

export default Footer;