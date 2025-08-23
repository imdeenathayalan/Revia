import { Card, Row, Col } from 'react-bootstrap';

function SummaryCards({ balance, income, expenses }) {
  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      variant: balance >= 0 ? 'success' : 'danger',
      icon: '💰',
      bgColor: balance >= 0 ? 'bg-green-50' : 'bg-red-50' // Tailwind
    },
    {
      title: 'Total Income',
      amount: income,
      variant: 'success',
      icon: '📈',
      bgColor: 'bg-blue-50' // Tailwind
    },
    {
      title: 'Total Expenses',
      amount: expenses,
      variant: 'danger',
      icon: '📉',
      bgColor: 'bg-orange-50' // Tailwind
    }
  ];

  return (
    <Row className="g-4 mb-6"> {/* Tailwind */}
      {cards.map((card, index) => (
        <Col md={4} key={index}>
          <Card className={`h-100 text-center border-0 shadow-lg transition-transform hover:scale-105 ${card.bgColor}`}> {/* Tailwind */}
            <Card.Body className="p-6"> {/* Tailwind */}
              <div className="text-4xl mb-3">{card.icon}</div> {/* Tailwind */}
              <Card.Title className="text-lg font-semibold text-gray-700 mb-2"> {/* Tailwind */}
                {card.title}
              </Card.Title>
              <Card.Text className={`text-3xl font-bold ${card.variant === 'success' ? 'text-green-600' : 'text-red-600'}`}> {/* Tailwind */}
                ${card.amount.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default SummaryCards;