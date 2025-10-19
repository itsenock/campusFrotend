import { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css'

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://campusbackend-fk2p.onrender.com/api/admin/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='container'>
      <h2>Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table border="1" cellSpacing="0" cellPadding="5">
          <thead>
            <tr>
              <th>Buyer (Name, Email, Phone)</th>
              <th>Seller (Name, Email, Phone)</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>
                  {transaction.buyer
                    ? `${transaction.buyer.fullname}, ${transaction.buyer.email}, ${transaction.buyer.phone}`
                    : "Unknown"}
                </td>
                <td>
                  {transaction.seller
                    ? `${transaction.seller.fullname} (${transaction.seller.email}, ${transaction.seller.phone})`
                    : "Unknown"}
                </td>
                <td>{transaction.item || "Unknown"}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.status}</td>
                <td>
                  {transaction.paid_at
                    ? new Date(transaction.paid_at).toLocaleString()
                    : "Invalid Date"}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
};

export default Transactions;
