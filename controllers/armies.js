'use strict';

// Import the required modules
const Army = require('../models/army.model');

// Return all armies
const getAll = async (_req, res) => {
  try {
    const armies = await Army.find();
    if (!armies) {
      res.status(404).json({ message: 'No armies found in database' });
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(armies);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get armies', error: error.message });
  }
};

// Return a single army
const getSingle = async (req, res) => {
  try {
    const army = await Army.findById(req.params.id);
    if (!army) {
      res.status(404).json({ message: 'Army not found' });
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(army);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get army', error: error.message });
  }
};

// Create a new army
const createSingle = async (req, res) => {
  const army = new Army({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  });

  try {
    await army.save();
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ message: 'New army added', id: army._id });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create army', error: error.message });
  }
};

// Delete a single army
const deleteSingle = async (req, res) => {
  try {
    const army = await Army.findByIdAndDelete(req.params.id);
    if (!army) {
      res.status(404).json({ message: 'Army not found' });
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Army deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete arny', error: error.message });
  }
};

// Update a single army
const updateSingle = async (req, res) => {
  try {
    const army = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday
    };
    const returnArmy = await Army.findByIdAndUpdate(req.params.id, army, { new: true });
    if (!returnArmy) {
      res.status(404).json({ message: 'Army not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Failed to update army', error: error.message });
  }
};

module.exports = { getAll, getSingle, createSingle, deleteSingle, updateSingle };
