
import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLocation } from 'react-router-dom';
import './PaymentStatus.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const reference = query.get('reference');
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="payment-status success">
      <h2>Payment Successful!</h2>
      <p>Thank you for your purchase.</p>
      <p>Your payment reference is <strong>{reference}</strong>.</p>
    </div>
  );
};

export default PaymentSuccess;
