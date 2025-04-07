import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import './Checkout.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [amount, setAmount] = useState(0);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const productFromState = location.state?.product;

  useEffect(() => {
    if (productFromState) {
      setCheckoutItems([
        {
          ...productFromState,
          quantity: 1,
        },
      ]);
    } else {
      setCheckoutItems(cartItems);
    }
  }, [productFromState, cartItems]);

  useEffect(() => {
    const total = checkoutItems.reduce(
      (acc, item) => acc + parseFloat(item.price || 0) * item.quantity,
      0
    );
    setAmount(total);
  }, [checkoutItems]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setLoggedInUser(user);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        axios
          .get('https://campusbackend-production.up.railway.app/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setLoggedInUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      }
    }
  }, []);

  const sanitizePhoneNumber = (phone) => {
    return phone.replace(/\s+/g, ''); // Removes spaces
  };

  const handlePaystackSuccessAction = (reference) => {
    axios
      .post(
        'https://campusbackend-production.up.railway.app/api/verify-payment',
        {
          reference: reference.reference,
          item_id: checkoutItems[0]?._id, // Use optional chaining to avoid undefined error
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then((response) => {
        if (response.data.status === 'success') {
          toast.success('Payment successful!');
          if (!productFromState) {
            clearCart();
          }
          navigate('/payment-success');
        } else {
          toast.error('Payment verification failed.');
        }
      })
      .catch((error) => {
        console.error('Error during payment verification:', error);
        toast.error('An error occurred during verification.');
        navigate('/payment-failure');
      });
  };

  const handlePaystackCloseAction = () => {
    toast.info('Payment was not completed.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (amount <= 0) {
      toast.warn('Invalid amount. Please check your cart items.');
      return;
    }

    if (!loggedInUser || !loggedInUser.email) {
      toast.error('User details not found. Please log in.');
      navigate('/login');
      return;
    }

    if (typeof window.PaystackPop === 'undefined') {
      toast.error('Unable to load payment gateway. Please try again later.');
      return;
    }

    const sanitizedPhone = sanitizePhoneNumber(loggedInUser.phone || loggedInUser.phone_number);

    const paystack = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: loggedInUser.email,
      amount: amount * 100,
      currency: 'KES',
      metadata: {
        cart_items: checkoutItems.map((item) => ({
          product_id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        user_id: loggedInUser._id,
      },
      firstname: loggedInUser.username || loggedInUser.fullname,
      lastname: '',
      phone: sanitizedPhone,
      callback: handlePaystackSuccessAction,
      onClose: handlePaystackCloseAction,
    });

    paystack.openIframe();
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {checkoutItems.length === 0 ? (
        <div className="empty-cart">
          <h3>Your Cart is Empty</h3>
          <p>Please add items to your cart before proceeding to checkout.</p>
        </div>
      ) : (
        <>
          <div className="order-summary">
            {checkoutItems.map((item) => (
              <div className="checkout-item" key={item._id}>
                <img
                  src={
                    item.images && item.images.length > 0
                      ? `https://campusbackend-production.up.railway.app/${item.images[0]}`
                      : '/path/to/default-image.jpg'
                  }
                  alt={item.name}
                />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Ksh {parseFloat(item.price).toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Total: Ksh{' '}
                    {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="total-amount">
              <h3>Total Amount: Ksh {amount.toFixed(2)}</h3>
            </div>
          </div>
          <button type="button" className="pay-button" onClick={handleSubmit}>
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
