import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  // State for change password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // State for delete account feedback
  const [deleteMessage, setDeleteMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }
        const response = await axios.get('https://campusbackend-fk2p.onrender.com/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;

  const getInitials = () => {
    if (userData.username) {
      return userData.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setEditValue(userData[field]);
  };

  const handleSave = async () => {
    if (!editingField) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'https://campusbackend-fk2p.onrender.com/api/auth/update',
        { [editingField]: editValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setUserData({ ...userData, [editingField]: editValue });
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update user data. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Handler for changing password
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('All password fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('New password and confirm password do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://campusbackend-fk2p.onrender.com/api/auth/change-password',
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setPasswordMessage(response.data.message);
      // Clear password fields and close the form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        setPasswordMessage(error.response.data.error);
      } else {
        setPasswordMessage('Failed to change password. Please try again.');
      }
    }
  };

  // Handler for deleting account
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        'https://campusbackend-fk2p.onrender.com/api/auth/delete-account',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeleteMessage(response.data.message);
      // Remove token and redirect after deletion
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        setDeleteMessage(error.response.data.error);
      } else {
        setDeleteMessage('Failed to delete account. Please try again.');
      }
    }
  };

  const personalDetailsFields = [
    { key: 'fullname', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone_number', label: 'Phone Number' },
  ];

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {userData ? (
        <div className="profile-container">
          <div className="profile-photo">
            <span>{getInitials()}</span>
          </div>
          <div className="profile-sections">
            <div className="section personal-details">
              <h3>Personal Details</h3>
              <div className="profile-details">
                {personalDetailsFields.map((field) => (
                  <p key={field.key}>
                    <strong>{field.label}:</strong>{' '}
                    {editingField === field.key ? (
                      <>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                        <button className="save-button" onClick={handleSave}>
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        {userData[field.key]}{' '}
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(field.key)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </p>
                ))}
              </div>
            </div>

            <div className="section manage-items">
              <h3>Manage Items</h3>
              <Link to="/manage-items" className="manage-items-link">
                Manage Your Items
              </Link>
            </div>

            <div className="section account">
              <h3>Account</h3>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
              <button
                className="delete-account-button"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>

            <div className="section change-password">
              <h3>Change Password</h3>
              {!showChangePassword ? (
                <button
                  className="change-password-button"
                  onClick={() => setShowChangePassword(true)}
                >
                  Change Password
                </button>
              ) : (
                <div className="change-password-form">
                  <div>
                    <label>Old Password:</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>New Password:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Confirm New Password:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {passwordMessage && (
                    <p className="password-message">{passwordMessage}</p>
                  )}
                  <button
                    className="save-password-button"
                    onClick={handleChangePassword}
                  >
                    Save Password
                  </button>
                  <button
                    className="cancel-password-button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordMessage('');
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {deleteMessage && (
              <p className="delete-message">{deleteMessage}</p>
            )}
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
