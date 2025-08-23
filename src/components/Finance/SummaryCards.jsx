import { Card, Row, Col } from 'react-bootstrap';

function SummaryCards({ balance, income, expenses }) {
  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      variant: balance >= 0 ? 'success' : 'danger',
      icon: '💰',
      bgColor: balance >= 0 ? 'bg-green-900' : 'bg-red-900', // Dark colors
      textColor: balance >= 0 ? 'text-green-300' : 'text-red-300'
    },
    {
      title: 'Total Income',
      amount: income,
      variant: 'success',
      icon: '📈',
      bgColor: 'bg-gray-800', // Dark gray
      textColor: 'text-blue-300'
    },
    {
      title: 'Total Expenses',
      amount: expenses,
      variant: 'danger',
      icon: '📉',
      bgColor: 'bg-gray-800', // Dark gray
      textColor: 'text-red-300'
    }
  ];

  return (
    <Row className="g-4 mb-6">
      {cards.map((card, index) => (
        <Col md={4} key={index}>
          <Card className={`h-100 text-center border-0 shadow-lg transition-transform hover:scale-105 ${card.bgColor} border border-red-700`}> {/* Dark red border */}
            <Card.Body className="p-6">
              <div className="text-4xl mb-3">{card.icon}</div>
              <Card.Title className={`text-lg font-semibold mb-2 ${card.textColor}`}> {/* Colored text */}
                {card.title}
              </Card.Title>
              <Card.Text className={`text-3xl font-bold ${card.textColor}`}> {/* Colored amount */}
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