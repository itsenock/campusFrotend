import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerForm.css';
import { toast } from 'react-toastify';

const SellerForm = ({ onAddProduct }) => {
  const [itemData, setItemData] = useState({
    name: '',
    category: 'Electronics',
    condition: 'New',
    description: '',
    price: '',
    warranty: '',
    images: [],
    quantity: 1,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.warn('Please log in to sell items.');
      navigate('/login');
      return;
    }
  }, [navigate]);

  const categories = [
    'Electronics',
    'Computers',
    'Fashion',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Musical Instruments',
    'Furniture',
    'Home Appliances',
  ];

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setItemData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...newImages],
    }));
  };

  const handleRemoveImage = (idx) => {
    setItemData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== idx),
    }));
  };

  const shouldShowWarranty = () => {
    const isElectronicsOrComputers =
      itemData.category === 'Electronics' || itemData.category === 'Computers';
    const isNewOrRefurbished =
      itemData.condition === 'New' || itemData.condition === 'Refurbished';
    return isElectronicsOrComputers && isNewOrRefurbished;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !itemData.name ||
      !itemData.description ||
      !itemData.price ||
      itemData.images.length === 0
    ) {
      toast.warn('Please fill in all required fields.');
      return;
    }

    if (shouldShowWarranty() && !itemData.warranty) {
      toast.warn('Please provide warranty information.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      Object.keys(itemData).forEach((key) => {
        if (key === 'images') {
          itemData[key].forEach((image) => {
            formData.append('images', image.file);
          });
        } else {
          formData.append(key, itemData[key]);
        }
      });

      const response = await axios.post(
        'http://localhost:5000/api/user/item',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onAddProduct(response.data);
      toast.success('Your item has been added.');

      setItemData({
        name: '',
        category: 'Electronics',
        condition: 'New',
        description: '',
        price: '',
        warranty: '',
        images: [],
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sellerForm-container">
      <div className="seller-form">
        <h2>Sell Your Item</h2>
        <form onSubmit={handleSubmit}>
          {/* Item Name */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="text"
                name="name"
                id="name"
                value={itemData.name}
                onChange={handleItemChange}
                placeholder=" "
                required
              />
              <label htmlFor="name">
                Item Name<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="input-container">
            <label htmlFor="category">
              Category<span className="required">*</span>
            </label>
            <select
              name="category"
              id="category"
              value={itemData.category}
              onChange={handleItemChange}
            >
              {categories.map((cat, idx) => (
                <option value={cat} key={idx}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
         
          <div className="input-container">
            <label htmlFor="condition">Condition<span className="required">*</span></label>
            <select
              name="condition"
              id="condition"
              value={itemData.condition}
              onChange={handleItemChange}
              required
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>


          {/* Description */}
          <div className="input-container">
            <div className="floating-label">
              <textarea
                name="description"
                id="description"
                value={itemData.description}
                onChange={handleItemChange}
                placeholder=" "
                required
              ></textarea>
              <label htmlFor="description">
                Description<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Price */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="number"
                name="price"
                id="price"
                value={itemData.price}
                onChange={handleItemChange}
                placeholder=" "
                required
              />
              <label htmlFor="price">
                Price (Ksh)<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Quantity */}
          <div className="input-container">
            <div className="floating-label">
              <input
                type="number"
                name="quantity"
                id="quantity"
                value={itemData.quantity}
                onChange={handleItemChange}
                placeholder=" "
                min="1"
                required
              />
              <label htmlFor="quantity">
                Quantity<span className="required">*</span>
              </label>
            </div>
          </div>

          {/* Warranty */}
          {shouldShowWarranty() && (
            <div className="input-container">
              <div className="floating-label">
                <input
                  type="text"
                  name="warranty"
                  id="warranty"
                  value={itemData.warranty}
                  onChange={handleItemChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="warranty">
                  Warranty<span className="required">*</span>
                </label>
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="input-container">
            <label htmlFor="image-input">
              Upload Images<span className="required">*</span>
            </label>
            <div className="image-upload">
              <div
                className="upload-icon"
                title="Upload Images"
                onClick={() => fileInputRef.current.click()}
              >
                +
              </div>
              <input
                id="image-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
            </div>
            <div className="image-preview">
              {itemData.images.map((image, idx) => (
                <div key={idx} className="image-container">
                  <img src={image.url} alt={`Preview ${idx}`} />
                  <button type="button" onClick={() => handleRemoveImage(idx)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

SellerForm.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
};

export default SellerForm;
