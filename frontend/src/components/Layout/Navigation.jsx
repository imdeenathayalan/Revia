// components/Navigation.jsx
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import NotificationBell from '../UI/NotificationBell.jsx';
import { useEffect, useState } from 'react';
import logo from "../../utils/logo.png"; // Import the logo
import './Navigation.css';

function Navigation({
  // Customization props with defaults
  variant = 'dark',
  bg = 'grey-dark',
  fixed = 'top',
  showBrand = true,
  showNotifications = true,
  showUserMenu = true,
  customNavItems = null,
  ...props
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  const defaultNavItems = [
    { to: '/', icon: 'bi-speedometer2', label: 'Dashboard' },
    { to: '/transactions', icon: 'bi-currency-exchange', label: 'Transactions' },
    { to: '/recurring', icon: 'bi-arrow-repeat', label: 'Recurring' },
    { to: '/investments', icon: 'bi-graph-up-arrow', label: 'Investments' },
    { to: '/debts', icon: 'bi-cash-coin', label: 'Debts' },
    { to: '/reports', icon: 'bi-bar-chart', label: 'Reports' },
  ];

  const navItems = customNavItems || defaultNavItems;

  return (
    <>
      <Navbar 
        bg={bg} 
        variant={variant} 
        fixed={fixed} 
        expand="lg" 
        expanded={expanded}
        onToggle={setExpanded}
        className={`shadow-lg border-b border-maroon navigation-bar ${scrolled ? 'scrolled' : ''}`}
        {...props}
      >
        <Container fluid className="px-3 px-md-4 px-lg-5">
          {showBrand && (
            <Navbar.Brand 
              as={Link} 
              to="/" 
              className="text-xl fw-bold text-white d-flex align-items-center gap-2 brand-animate"
              aria-label="Go to homepage"
              onClick={handleNavClick}
            >
              {/* Replace the rupee icon with your logo */}
              <img 
                src={logo} 
                alt="Revia Logo" 
                className="brand-logo"
                style={{ height: '32px', width: 'auto' }}
              />
              <span className="brand-text">Revia</span>
            </Navbar.Brand>
          )}
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            className="border-maroon toggle-button" 
            aria-label="Toggle navigation menu"
          />
          
          <Navbar.Collapse id="basic-navbar-nav" className="collapse-animation">
            {isAuthenticated ? (
              <>
                <Nav className="me-auto flex-column flex-lg-row">
                  {navItems.map(({ to, icon, label }, index) => (
                    <Nav.Link
                      as={Link}
                      to={to}
                      key={to}
                      className={`text-white py-3 py-lg-2 px-lg-3 d-flex align-items-center gap-2 hover:text-maroon-dark transition-all duration-300 nav-link-animate ${activePage === to ? 'active-page' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      aria-current={activePage === to ? 'page' : undefined}
                      onClick={handleNavClick}
                    >
                      <i className={`bi ${icon} nav-icon`}></i>
                      <span className="nav-label">{label}</span>
                      {activePage === to && <span className="active-indicator" />}
                    </Nav.Link>
                  ))}
                  
                  <div className="d-lg-none mt-3 pt-3 border-top border-maroon">
                    {[{ to: '/notifications', icon: 'bi-bell', label: 'Notifications' }, { to: '/settings', icon: 'bi-gear', label: 'Settings' }].map(({ to, icon, label }) => (
                      <Nav.Link
                        as={Link}
                        to={to}
                        key={to}
                        className={`text-white py-3 d-flex align-items-center gap-2 hover:text-maroon-dark transition-all duration-300 ${activePage === to ? 'active-page' : ''}`}
                        aria-current={activePage === to ? 'page' : undefined}
                        onClick={handleNavClick}
                      >
                        <i className={`bi ${icon} nav-icon`}></i>
                        <span className="nav-label">{label}</span>
                        {activePage === to && <span className="active-indicator" />}
                      </Nav.Link>
                    ))}
                  </div>
                </Nav>

                <div className="d-none d-lg-flex align-items-center">
                  {showNotifications && (
                    <Nav className="me-3 my-3 my-lg-0">
                      <NotificationBell />
                    </Nav>
                  )}

                  {showUserMenu && (
                    <Nav>
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          variant="outline-light"
                          id="user-dropdown"
                          className="border-maroon text-white bg-transparent d-flex align-items-center gap-2 py-2 px-3 rounded user-toggle"
                          aria-label="User menu"
                        >
                          <i className="bi bi-person-circle fs-5"></i>
                          <span className="d-none d-lg-inline user-name">{user?.name || 'User'}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu 
                          className="bg-grey-dark border border-maroon p-0 overflow-hidden mt-2 rounded-lg shadow dropdown-menu-animate"
                          aria-label="User menu options"
                          popperConfig={{ strategy: 'fixed' }}
                        >
                          <Dropdown.Item
                            className="text-white hover:bg-maroon-dark hover:text-white py-3 px-4 dropdown-item-animate"
                            onClick={handleLogout}
                            role="button"
                            tabIndex={0}
                          >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Logout
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Nav>
                  )}
                </div>
                
                <div className="d-lg-none mt-4 pt-4 border-top border-maroon">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2 text-white">
                      <i className="bi bi-person-circle fs-4"></i>
                      <span>{user?.name || 'User'}</span>
                    </div>
                    {showNotifications && <NotificationBell />}
                  </div>
                  
                  <Nav.Link
                    className="text-white py-3 d-flex align-items-center gap-2 hover:text-maroon-dark transition-all duration-300"
                    onClick={handleLogout}
                    role="button"
                    tabIndex={0}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </Nav.Link>
                </div>
              </>
            ) : (
              <Nav className="ms-auto flex-row align-items-center gap-3">
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="text-white py-3 py-lg-2 px-3 d-flex align-items-center gap-2 hover:text-maroon-dark transition-all duration-300 login-link"
                  onClick={handleNavClick}
                >
                  <i className="bi bi-box-arrow-in-right"></i>
                  <span className="nav-label">Login</span>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/signup"
                  className="px-4 py-2 bg-maroon hover:bg-maroon-dark text-white rounded-lg transition-all duration-300 signup-button d-flex align-items-center gap-2"
                  onClick={handleNavClick}
                >
                  <i className="bi bi-person-plus"></i>
                  <span className="nav-label">Sign Up</span>
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {/* Add padding to the top of the page content to account for fixed navbar */}
      <div className="navbar-spacer" style={{ height: expanded ? 'var(--navbar-expanded-height, 300px)' : 'var(--navbar-height, 70px)' }}></div>
    </>
  );
}

export default Navigation;