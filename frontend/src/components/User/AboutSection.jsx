import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AboutSection() {
  const appVersion = '1.0.0';
  const lastUpdate = 'December 2023';
  const technologies = [
    'React 18', 'React Bootstrap', 'Chart.js', 'Vite', 'LocalStorage API'
  ];

  const features = [
    {
      icon: 'bi-wallet2',
      title: 'Financial Tracking',
      description: 'Track income and expenses with detailed categorization'
    },
    {
      icon: 'bi-graph-up',
      title: 'Visual Reports',
      description: 'Beautiful charts and analytics for better insights'
    },
    {
      icon: 'bi-piggy-bank',
      title: 'Budget Management',
      description: 'Set and monitor budgets for different categories'
    },
    {
      icon: 'bi-trophy',
      title: 'Goal Tracking',
      description: 'Set savings goals and track your progress'
    },
    {
      icon: 'bi-phone',
      title: 'Responsive Design',
      description: 'Works perfectly on desktop, tablet, and mobile'
    },
    {
      icon: 'bi-shield',
      title: 'Privacy Focused',
      description: 'Your data stays on your device - no cloud storage'
    }
  ];

  const openExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-white mb-4">
        <i className="bi bi-info-circle me-2"></i>
        About Revia
      </h2>

      {/* App Info Card */}
      <Card className="border border-[#3a506b] bg-[#2c3e50] mb-4">
        <Card.Body className="p-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#3a506b]">
            <span className="text-3xl text-white">
              <i className="bi bi-currency-rupee"></i>
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Revia</h3>
          <p className="text-gray-300 mb-2">Indian Finance Tracker</p>
          <div className="flex justify-center gap-2 mb-3">
            <Badge className="px-3 py-1 bg-gradient-to-r from-[#ff5252] to-[#ff7b46]">v{appVersion}</Badge>
            <Badge className="px-3 py-1 bg-[#243447]">Last updated: {lastUpdate}</Badge>
          </div>
          <p className="text-white">
            A modern, privacy-focused finance tracker built for Indian users. 
            Manage your money in ₹ with powerful features and beautiful design.
          </p>
        </Card.Body>
      </Card>

      {/* Features Grid */}
      <Card className="border border-[#3a506b] bg-[#2c3e50] mb-4">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            <i className="bi bi-stars me-2"></i>
            Features
          </h3>
          <Row>
            {features.map((feature, index) => (
              <Col md={6} key={index} className="mb-3">
                <div className="flex items-start p-3 rounded-lg bg-[#243447] hover:bg-[#2c3e50] transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <i className={`${feature.icon} text-white`}></i>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Technology Stack */}
      <Card className="border border-[#3a506b] bg-[#2c3e50] mb-4">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-code-slash me-2"></i>
            Built With
          </h3>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <Badge key={index} className="px-3 py-2 text-sm bg-[#243447]">
                {tech}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Links & Actions */}
      <Card className="border border-[#3a506b] bg-[#2c3e50] mb-4">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-link me-2"></i>
            Links
          </h3>
          <div className="space-y-2">
            <Button
              variant="outline-light"
              className="w-100 text-start d-flex align-items-center mb-3 border-[#3a506b] text-white"
              onClick={() => openExternalLink('https://github.com/yourusername/revia')}
            >
              <i className="bi bi-github me-3"></i>
              GitHub Repository
            </Button>
            <Button
              variant="outline-light"
              className="w-100 text-start d-flex align-items-center mb-3 border-[#3a506b] text-white"
              onClick={() => openExternalLink('https://github.com/yourusername/revia/issues')}
            >
              <i className="bi bi-bug me-3"></i>
              Report an Issue
            </Button>
            <Button
              variant="outline-light"
              className="w-100 text-start d-flex align-items-center mb-3 border-[#3a506b] text-white"
              onClick={() => openExternalLink('https://github.com/yourusername/revia/discussions')}
            >
              <i className="bi bi-chat-dots me-3"></i>
              Community Discussions
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Developer Info */}
      <Card className="border border-[#3a506b] bg-[#2c3e50]">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-heart me-2"></i>
            REVIA is made by ARC-VORTEX
          </h3>
          <p className="text-white mb-3">
            Revia is developed by <strong>ARC-VORTEX</strong> as a free and open-source project 
            to help people manage their finances better.
          </p>
          <div className="space-y-2">
            <Button
              variant="outline-info"
              className="w-100 text-start d-flex align-items-center mb-3 border-[#3a506b] text-white"
              onClick={() => openExternalLink('https://github.com/ARC-VORTEX')}
            >
              <i className="bi bi-person-circle me-3"></i>
              ARC-VORTEX on GitHub
            </Button>
            <Button
              variant="outline-info"
              className="w-100 text-start d-flex align-items-center border-[#3a506b] text-white"
              onClick={() => openExternalLink('mailto:imdeenathayalan@gmail.com')}
            >
              <i className="bi bi-envelope me-3"></i>
              Contact Developer
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Quick Stats */}
      <Card className="border border-[#3a506b] bg-[#2c3e50] mt-4">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-bar-chart me-2"></i>
            App Statistics
          </h3>
          <Row>
            <Col sm={6} className="mb-3">
              <div className="text-center p-3 bg-[#243447] rounded-lg">
                <div className="text-2xl font-bold text-gray-300 mb-1">
                  <i className="bi bi-currency-rupee"></i>
                  {localStorage.getItem('transactions') 
                    ? JSON.parse(localStorage.getItem('transactions')).length 
                    : 0
                  }
                </div>
                <div className="text-white text-sm">Total Transactions</div>
              </div>
            </Col>
            <Col sm={6} className="mb-3">
              <div className="text-center p-3 bg-[#243447] rounded-lg">
                <div className="text-2xl font-bold text-gray-300 mb-1">
                  {localStorage.getItem('budgets') 
                    ? JSON.parse(localStorage.getItem('budgets')).length 
                    : 0
                  }
                </div>
                <div className="text-white text-sm">Active Budgets</div>
              </div>
            </Col>
            <Col sm={6} className="mb-3">
              <div className="text-center p-3 bg-[#243447] rounded-lg">
                <div className="text-2xl font-bold text-gray-300 mb-1">
                  {localStorage.getItem('goals') 
                    ? JSON.parse(localStorage.getItem('goals')).length 
                    : 0
                  }
                </div>
                <div className="text-white text-sm">Savings Goals</div>
              </div>
            </Col>
            <Col sm={6} className="mb-3">
              <div className="text-center p-3 bg-[#243447] rounded-lg">
                <div className="text-2xl font-bold text-gray-300 mb-1">
                  {Math.round(performance.now())}
                </div>
                <div className="text-white text-sm">MS Load Time</div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AboutSection;