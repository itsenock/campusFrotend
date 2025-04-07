import  { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css'

const ApproveItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://campusbackend-production.up.railway.app/api/admin/items/pending', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(response.data);
      } catch (err) {
        console.error(err);
        setError('Error fetching pending items.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingItems();
  }, []);

  const handleApprove = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://campusbackend-production.up.railway.app/api/admin/items/approve/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      alert('Failed to approve item.');
    }
  };

  const handleReject = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://campusbackend-production.up.railway.app/api/admin/items/reject/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      alert('Failed to reject item.');
    }
  };

  if (loading) return <div>Loading pending items...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='container'>
      <h2>Pending Items for Approval</h2>
      {items.length === 0 ? (
        <p>No pending items.</p>
      ) : (
        items.map(item => (
          <div key={item._id} style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
            <img src={`https://campusbackend-production.up.railway.app${item.images[0]}`} alt={item.name} style={{ width: '200px' }} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <button onClick={() => handleApprove(item._id)}>Approve</button>
            <button onClick={() => handleReject(item._id)}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ApproveItems;
