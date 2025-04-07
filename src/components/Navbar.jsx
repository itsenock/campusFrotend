import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import LoginForm from './LoginForm';
import './Navbar.css';
import {
  FaHome,
  FaBoxOpen,
  FaStore,
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
} from 'react-icons/fa';

const Navbar = () => {
  const { cartItems, clearCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navLinksRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
    if (!token) {
      clearCart();
    }
  }, [location]); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        navLinksRef.current &&
        !navLinksRef.current.contains(event.target) &&
        event.target !== document.querySelector('.menu-icon')
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    closeModal();
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 450) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          {/*<h1>CAMPUS MARKET</h1>*/}
          <img src='logo.png' alt='logo'/>
        </Link>
      </div>
      <div
        className={`nav-links ${isMenuOpen ? 'open' : ''}`}
        ref={navLinksRef}
      >
        <Link to="/" onClick={handleLinkClick}>
          <FaHome className="icon" />
          Home
        </Link>
        <Link to="/products" onClick={handleLinkClick}>
          <FaBoxOpen className="icon" />
          Products
        </Link>
        <Link to="/sell" onClick={handleLinkClick}>
          <FaStore className="icon" />
          Sell
        </Link>
        <Link to="/cart" onClick={handleLinkClick}>
          <FaShoppingCart className="icon" />
          Cart ({isLoggedIn ? cartItems.length : 0})
        </Link>
        {isLoggedIn ? (
          <Link to="/profile" onClick={handleLinkClick}>
            <FaUser className="icon" />
            Profile
          </Link>
        ) : (
          <Link to="/login" onClick={handleLinkClick}>
            <FaSignInAlt className="icon" />
            Login
          </Link>
        )}
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776;
      </div>
      {isModalOpen && (
        <LoginForm closeModal={closeModal} onLoginSuccess={handleLogin} />
      )}
    </nav>
  );
};

export default Navbar;
