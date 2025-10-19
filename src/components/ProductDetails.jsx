import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { useCart } from '../contexts/CartContext';
import axios from 'axios';
import PropTypes from 'prop-types';
import './ProductDetails.css';
import { toast } from 'react-toastify';

const ProductDetails = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    if (id && products.length > 0) {
      const productData = products.find((product) => product._id === id);
      if (productData) {
        setProduct(productData);
        setMainImage(`https://campusbackend-fk2p.onrender.com/${productData.images[0]}`);
      } else {
        const fetchProduct = async () => {
          try {
            const response = await axios.get(`https://campusbackend-fk2p.onrender.com/api/product/${id}`);
            const productData = response.data;
            setProduct(productData);
            setMainImage(`https://campusbackend-fk2p.onrender.com/${productData.images[0]}`);
          } catch (error) {
            console.error('Error fetching product:', error);
          }
        };
        fetchProduct();
      }
    }
  }, [id, products]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    const cartProduct = {
      product_id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      images: product.images,
    };
    addToCart(cartProduct);
    toast.success('Product added to cart.');
  };

  const handleBuyNow = () => {

    navigate('/checkout', { state: { product } });
  };

  return (
    <div className="product-details">
      <div className="detailed-image">
        <div className="main-image-reviews">
          <img src={mainImage} alt={product.name} />
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={`https://campusbackend-production.up.railway.app/${image}`}
                alt={`${product.name} ${index + 1}`}
                onClick={() => setMainImage(`https://campusbackend-fk2p.onrender.com/${image}`)}
              />
            ))}
          </div>
        </div>
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: Ksh {product.price}</p>
          {product.warranty && <p>Warranty: {product.warranty}</p>}
          <p>Rating: {product.rating} / 5</p>
          <div className="product-buttons">
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleBuyNow} className="buy-now-button">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <div className="reviews">
        <h3>Customer Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div key={index} className="review">
              <p>
                <strong>{review.user}</strong>
              </p>
              <p>Rating: {review.rating} / 5</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

ProductDetails.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      reviews: PropTypes.arrayOf(
        PropTypes.shape({
          user: PropTypes.string.isRequired,
          rating: PropTypes.number.isRequired,
          comment: PropTypes.string.isRequired,
        })
      ),
      warranty: PropTypes.string,
      rating: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ProductDetails;
