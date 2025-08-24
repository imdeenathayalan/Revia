import { Card, Row, Col } from 'react-bootstrap';
import { formatIndianCurrency } from '../../utils/storage.js';

function SummaryCards({ balance, income, expenses }) {
  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      variant: balance >= 0 ? 'success' : 'danger',
      icon: 'bi-wallet2',
      bgColor: 'bg-grey-dark',
      textColor: balance >= 0 ? 'text-green-400' : 'text-red-400',
      borderColor: 'border-maroon'
    },
    {
      title: 'Total Income',
      amount: income,
      variant: 'success',
      icon: 'bi-arrow-up-circle',
      bgColor: 'bg-grey-dark',
      textColor: 'text-green-400',
      borderColor: 'border-maroon'
    },
    {
      title: 'Total Expenses',
      amount: expenses,
      variant: 'danger',
      icon: 'bi-arrow-down-circle',
      bgColor: 'bg-grey-dark',
      textColor: 'text-red-400',
      borderColor: 'border-maroon'
    }
  ];

  return (
    <Row className="g-4 mb-6">
      {cards.map((card, index) => (
        <Col md={4} key={index}>
          <Card className={`h-100 text-center border-0 shadow-lg transition-transform hover:scale-105 ${card.bgColor} ${card.borderColor}`}>
            <Card.Body className="p-6">
              <div className="text-4xl mb-3 text-white">
                <i className={card.icon}></i>
              </div>
              <Card.Title className={`text-lg font-semibold mb-2 text-white`}>
                {card.title}
              </Card.Title>
              <Card.Text className={`text-3xl font-bold ${card.textColor}`}>
                {formatIndianCurrency(card.amount)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default SummaryCards;