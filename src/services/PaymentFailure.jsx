
import { useLocation } from 'react-router-dom';
import './PaymentStatus.css';

const PaymentFailure = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const message = query.get('message');

  return (
    <div className="payment-status failure">
      <h2>Payment Failed</h2>
      <p>We are sorry, but your payment could not be processed.</p>
      <p>Reason: <strong>{message}</strong></p>
    </div>
  );
};

export default PaymentFailure;
