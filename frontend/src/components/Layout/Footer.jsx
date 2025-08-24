import { Container } from 'react-bootstrap';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-8 border-t border-red-800">
      <Container className="text-center">
        <p className="mb-2 text-lg font-semibold text-red-400">
          <i className="bi bi-graph-up-arrow me-2"></i>
          Revia
        </p>
        <p className="mb-2 text-gray-400">
          &copy; {currentYear} Built by ARC-VORTEX
          <span className="block sm:inline"> | A frontend demonstration project.</span>
        </p>
        <small className="text-gray-500 text-sm">
          <i className="bi bi-database me-1"></i>
          Data is stored locally in your browser.
        </small>
      </Container>
    </footer>
  );
}

export default Footer;