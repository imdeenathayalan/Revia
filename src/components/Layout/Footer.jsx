import { Container } from 'react-bootstrap';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-8 border-t border-red-800"> {/* Dark theme */}
      <Container className="text-center">
        <p className="mb-2 text-lg font-semibold text-red-400">💰 Finance Tracker</p> {/* Dark red */}
        <p className="mb-2 text-gray-400"> {/* Gray text */}
          &copy; {currentYear} Built with React & Bootstrap. 
          <span className="block sm:inline"> A frontend demonstration project.</span>
        </p>
        <small className="text-gray-500 text-sm"> {/* Dark gray */}
          Data is stored locally in your browser.
        </small>
      </Container>
    </footer>
  );
}

export default Footer;