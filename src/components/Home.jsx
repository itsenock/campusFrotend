import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to Campus Market</h1>
        <p>Your one-stop shop for all your needs</p>
        <div className="home-buttons">
          <Link to="/products">
            <button aria-label="Shop Now">Shop Now</button>
          </Link>
          <Link to="/sell">
            <button aria-label="Sell with Us">Sell with Us</button>
          </Link>
        </div>
      </div>

      {/* Flash Sales Section */}
      <div className="flash-sales-section">
        <h2>Save Shopping Cost with Today’s Flash Sales</h2>
        <div className="flash-sales-button">
          <Link to="/flashsales">
            <button aria-label="Explore Flash Sales">
              Explore Flash Sales
              <span className="arrow">→</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2>Explore Categories</h2>
        <div className="card-container">
          {/* Additions for better categorization */}
          <Link to="/products?category=Electronics" className="card-link">
            <div className="card" aria-label="Electronics category">
              <img
                src="https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Electronics - Discover the latest in tech and gadgets"
              />
              <h3>Electronics</h3>
              <p>Discover the latest in tech and gadgets.</p>
            </div>
          </Link>

          <Link to="/products?category=Fashion" className="card-link">
            <div className="card" aria-label="Fashion category">
              <img
                src="https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Fashion - Explore trending styles and accessories"
              />
              <h3>Fashion</h3>
              <p>Explore trending styles and accessories.</p>
            </div>
          </Link>

          <Link to="/products?category=Home%20%26%20Kitchen" className="card-link">
            <div className="card" aria-label="Home & Kitchen category">
              <img
                src="https://images.pexels.com/photos/30617433/pexels-photo-30617433/free-photo-of-cozy-vintage-kitchen-with-rustic-decor.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Home & Kitchen - Upgrade your home with our range of products"
              />
              <h3>Home & Kitchen</h3>
              <p>Upgrade your home with our range of products.</p>
            </div>
          </Link>

          <Link to="/products?category=Sports%20%26%20Outdoors" className="card-link">
            <div className="card" aria-label="Sports & Outdoors category">
              <img
                src="https://images.pexels.com/photos/2923156/pexels-photo-2923156.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Sports & Outdoors - Gear up for adventure"
              />
              <h3>Sports & Outdoors</h3>
              <p>Gear up for adventure with our top-notch products.</p>
            </div>
          </Link>

          <Link to="/products?category=Musical%20Instruments" className="card-link">
            <div className="card" aria-label="Musical Instruments category">
              <img
                src="https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg?auto=compress&cs=tinysrgb&w=400"
                alt="Musical Instruments - Unlock your musical potential"
              />
              <h3>Musical Instruments</h3>
              <p>Unlock your musical potential with high-quality instruments.</p>
            </div>
          </Link>

          <Link to="/products?category=Furniture" className="card-link">
            <div className="card" aria-label="Furniture category">
              <img
                src="https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Furniture - Transform your space"
              />
              <h3>Furniture</h3>
              <p>Transform your space with stylish and comfortable furniture.</p>
            </div>
          </Link>

          <Link to="/products?category=Home%20Appliances" className="card-link">
            <div className="card" aria-label="Home Appliances category">
              <img
                src="https://images.pexels.com/photos/8082206/pexels-photo-8082206.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Home Appliances - Upgrade your home"
              />
              <h3>Home Appliances</h3>
              <p>Upgrade your home with top-of-the-line appliances.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Add call-to-action or testimonials */}
      <div className="testimonials-section">
        <h2>Why Shop With Us?</h2>
        <p>"Campus Market transformed the way I shop! Their deals are unbeatable." - Happy Customer</p>
      </div>
    </div>
  );
};

export default Home;
