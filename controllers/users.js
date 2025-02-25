'use strict';

const User = require('../models/user.model');
const axios = require('axios');

// Return all users if logged in as an admin, or return the current user
const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found in database' });
    }

    // Only admins can see all users. Regular users can only see themselves.
    if (req.user.role !== 'admin') {
      const userIndex = users.findIndex((user) => user._id.toString() === req.user.userId);
      users = users.slice(userIndex, userIndex + 1);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error getting users', error: err.message });
  }
};

// Return any single user if logged in as an admin or the user themselves
const getSingleUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    // Only admins can see all users. Regular users can only see themselves.
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Only the user or admin can view the selected user' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error getting user', error: err.message });
  }
};

// Delete a single user (only accessible by the user or admin)
const deleteSingleUser = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res
        .status(403)
        .json({ message: 'Only the user or admin can delete the selected user' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete user', error: error.message });
  }
};

// Update user info (only accessible by the user or admin)
const updateSingleUser = async (req, res) => {
  const { preferred_name, role } = req.body;

  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only admins can update roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update roles' });
    }

    // Only the user or an admin can update the preferred name
    if (preferred_name && req.user.role !== 'admin' && req.user.userId !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Only the user or an admin can update the preferred name' });
    }

    if (preferred_name) user.preferred_name = preferred_name;
    if (role) user.role = role;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
};

// Logout the user and revoke the Google token
const userLogout = async (req, res) => {
  try {
    const googleToken = req.user?.googleAccessToken;

    if (!googleToken) {
      console.error('No Google access token found.');
      return res.status(400).json({ message: 'Google access token not found.' });
    }

    // Revoke the Google token
    await axios.post(`https://oauth2.googleapis.com/revoke?token=${googleToken}`, null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Respond to Swagger immediately after revocation to prevent it from hanging
    return res.status(200).json({ message: 'User logged out and token revoked successfully.' });
  } catch (err) {
    console.error('Logout error:', err.response?.data || err.message);
    return res.status(500).json({ message: 'Error logging out.' });
  }
};

module.exports = { updateSingleUser, getAllUsers, getSingleUser, deleteSingleUser, userLogout };
