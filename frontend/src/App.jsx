import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Layout/Navigation.jsx';
import Footer from './components/Layout/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-gray-900 text-white"> {/* Dark background */}
        <Navigation />
        <Container className="my-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;