import { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminItems.css';

const AdminItems = () => {
  const [boughtItems, setBoughtItems] = useState([]);
  const [unboughtItems, setUnboughtItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/items', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // The response should include keys 'bought_items' and 'unbought_items'
      setBoughtItems(response.data.bought_items);
      setUnboughtItems(response.data.unbought_items);
    } catch (err) {
      setError('Error fetching items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the item from both lists
      setBoughtItems(boughtItems.filter(item => item._id !== itemId));
      setUnboughtItems(unboughtItems.filter(item => item._id !== itemId));
    } catch (err) {
      alert('Failed to remove item.');
    }
  };

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-items-page">
      <h2>Admin Panel - Manage Items</h2>

      <div className="item-section">
        <h3>Unbought Items</h3>
        {unboughtItems.length === 0 ? (
          <p>No unbought items available.</p>
        ) : (
          <div className="items-grid">
            {unboughtItems.map(item => (
              <div key={item._id} className="item-card">
                {item.images && item.images.length > 0 ? (
                  <img src={`http://localhost:5000${item.images[0]}`} alt={item.name} />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
                <h4>{item.name}</h4>
                <p>Price: Ksh {item.price}</p>
                <p>Category: {item.category}</p>
                <p>Condition: {item.condition}</p>
                <button onClick={() => handleRemoveItem(item._id)} className="remove-button">
                  Remove Item
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="item-section">
        <h3>Bought Items</h3>
        {boughtItems.length === 0 ? (
          <p>No bought items available.</p>
        ) : (
          <div className="items-grid">
            {boughtItems.map(item => (
              <div key={item._id} className="item-card">
                {item.images && item.images.length > 0 ? (
                  <img src={`http://localhost:5000${item.images[0]}`} alt={item.name} />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
                <h4>{item.name}</h4>
                <p>Price: Ksh {item.price}</p>
                <p>Category: {item.category}</p>
                <p>Condition: {item.condition}</p>
                <button onClick={() => handleRemoveItem(item._id)} className="remove-button">
                  Remove Item
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminItems;
