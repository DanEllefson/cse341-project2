'use strict';

const User = require('../models/user.model');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found in database' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error getting users', error: err.message });
  }
};

const updateSingleUser = async (req, res) => {
  const { preferred_name, role } = req.body;

  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }

    console.log('id:', req.params.id, 'role:', role, 'user:', req.user.role);

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only admins can update roles
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update roles' });
    }

    if (preferred_name) user.preferred_name = preferred_name;
    if (role) user.role = role;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

module.exports = { updateSingleUser, getAllUsers };
