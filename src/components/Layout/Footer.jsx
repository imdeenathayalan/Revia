import { Container } from 'react-bootstrap';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-6 mt-8 shadow-inner"> {/* Tailwind */}
      <Container className="text-center">
        <p className="mb-2 text-lg font-semibold">💰 Finance Tracker</p> {/* Tailwind */}
        <p className="mb-2 text-gray-300"> {/* Tailwind */}
          &copy; {currentYear} Built with React & Bootstrap. 
          <span className="block sm:inline"> A frontend demonstration project.</span> {/* Tailwind */}
        </p>
        <small className="text-gray-400 text-sm"> {/* Tailwind */}
          Data is stored locally in your browser.
        </small>
      </Container>
    </footer>
  );
}

export default Footer;