import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../utils/logo.png";
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          footer.classList.add('footer-visible');
        }
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <footer className={`w-full py-4 mt-5 border-t border-[#3a506b] footer-animate ${isVisible ? 'footer-visible' : ''}`}>
      <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto">
        <Row className="justify-content-between">
          <Col xs={12} md={6} lg={4} className="mb-4 mb-md-0">
            <div className="d-flex flex-column h-100">
              <p className="mb-2 text-lg font-semibold text-white d-flex align-items-center logo-text">
                <img
                  src={logo}
                  alt="Revia Logo"
                  className="h-5 w-5 me-2 logo-spin"
                />
                Revia - Indian Finance Tracker
              </p>
              <p className="text-gray-200 mb-2 flex-grow-1 small">
                Manage your personal finances with ease. Track expenses, investments, and debts in Indian Rupees.
              </p>
              <div className="social-links d-flex gap-2">
                <a href="https://www.linkedin.com/in/imdeenathayalan/" className="text-gray-200 social-link" aria-label="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="https://www.facebook.com/imdeenathayalan/" className="text-gray-200 social-link" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://www.instagram.com/deenathayalan_m_/" className="text-gray-200 social-link" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://github.com/imdeenathayalan" className="text-gray-200 social-link" aria-label="GitHub">
                  <i className="bi bi-github"></i>
                </a>
              </div>
            </div>
          </Col>
          
          <Col xs={6} md={3} className="mb-4 mb-md-0">
            <h5 className="text-white mb-2 small-header">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-1">
                <a href="mailto:imdeenathayalan@gmail.com" className="text-gray-200 footer-link small">
                  <i className="bi bi-envelope me-1"></i>Gmail
                </a>
              </li>
            </ul>
          </Col>
          
          <Col xs={12} md={6} lg={4} className="text-md-end">
            <h5 className="text-white mb-2 small-header">About Revia</h5>
            <p className="text-gray-200 mb-2 copyright-text small">
              &copy; {currentYear} Built by ARC-VORTEX
              <span className="d-block">Manage your finances in ₹</span>
            </p>
            <small className="text-gray-400 data-storage small">
              <i className="bi bi-database me-1 pulse-icon"></i>
              Data is stored locally in your browser for privacy.
            </small>
            <div className="mt-2 app-badges">
              <button className="btn btn-outline-light btn-sm me-1 mb-1 small">
                <i className="bi bi-google-play me-1"></i> Play
              </button>
              <button className="btn btn-outline-light btn-sm mb-1 small">
                <i className="bi bi-apple me-1"></i> App Store
              </button>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-3 pt-3 border-top border-[#3a506b]">
          <Col xs={12}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="mb-2 mb-md-0 text-center text-md-start">
                <span className="text-gray-400 small">Privacy Policy</span>
                <span className="mx-1 text-[#3a506b]">•</span>
                <span className="text-gray-400 small">Terms of Service</span>
                <span className="mx-1 text-[#3a506b]">•</span>
                <span className="text-gray-400 small">Cookie Policy</span>
              </div>
              <div className="text-gray-400 small text-center text-md-end">
                Version 1.2.0 • Updated April 2023
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
}

export default Footer;