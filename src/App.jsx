import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import SellerForm from './components/SellerForm';
import Home from './components/Home';
import ErrorBoundary from './components/ErrorBoundary';
import { CartProvider } from './contexts/CartContext';
import Checkout from './components/Checkout';
import UserProfile from './components/UserProfile';
import ManageItems from './components/ManageItems';
import PaymentSuccess from './services/PaymentSuccess';
import PaymentFailure from './services/PaymentFailure';
import AboutUs from './components/AboutUs'; 
import ContactUs from './components/ContactUs'; 
import TermsOfService from './components/TermsOfService'; 
import PrivacyPolicy from './components/PrivacyPolicy'; 
import ViewLoggedInUsers from './admin/ViewLoggedInUsers';
import Transactions from './admin/Transactions';
import ApproveItems from './admin/ApproveItems';
import AdminItems from './admin/AdminItems';
import Maintenance from './components/Maintenance';
import './App.css';


function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://campusbackend-production.up.railway.app/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addProductToList = (product) => {
    setProducts([...products, product]);
  };
  const isUnderMaintenance = false; 

  return (
    <CartProvider>
      <Router>
        <ErrorBoundary>
          {isUnderMaintenance ? (
            // Only show Maintenance page
            <Routes>
              <Route path="*" element={<Maintenance />} />
            </Routes>
          ) : (
            <>
              <Navbar />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductList products={products} />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<LoginForm />} />
                  <Route path="/product/:id" element={<ProductDetails products={products} />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/sell" element={<SellerForm onAddProduct={addProductToList} />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/manage-items" element={<ManageItems />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failure" element={<PaymentFailure />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/approve" element={<ApproveItems />} />
                  <Route path="/users" element={<ViewLoggedInUsers />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/items" element={<AdminItems />} />
                </Routes>
              </div>
              <Footer />
            </>
          )}
        </ErrorBoundary>
      </Router>
    </CartProvider>
  );
  
}

export default App;
