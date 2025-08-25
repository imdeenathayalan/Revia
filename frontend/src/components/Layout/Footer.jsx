import { Container } from 'react-bootstrap';
import logo from "../../utils/logo.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-grey-dark text-white py-6 mt-8 border-t border-maroon">
      <Container className="text-center">
        <p className="mb-2 text-lg font-semibold text-maroon-light flex items-center justify-center">
          <img
            src={logo}
            alt="Revia Logo"
            className="h-6 w-6 me-2"
          />
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