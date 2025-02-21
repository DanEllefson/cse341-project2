'use strict';

const User = require('../models/user.model');

const updateUser = async (req, res) => {
  const { user_id, preferred_name, role } = req.body;

  try {
    const user = await User.findById(user_id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Only admins can update roles
    if (req.user.role !== 'admin') {
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

module.exports = { updateUser };
