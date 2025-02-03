'use strict';

// Import the required modules
const Army = require('../models/army.model');

/**
 * @swagger
 * /armies:
 *   get:
 *     summary: Get all armies
 *     description: Retrieve all armies in the database.
 *     responses:
 *       200:
 *         description: A list of armies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Army'
 *       404:
 *         description: No armies found
 */
const getAll = async (_req, res) => {
  try {
    const armies = await Army.find();
    if (!armies || armies.length === 0) {
      return res.status(404).json({ message: 'No armies found in database' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(armies);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get armies', error: error.message });
  }
};

/**
 * @swagger
 * /armies/{id}:
 *   get:
 *     summary: Get a single army by ID
 *     description: Retrieve a single army by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The army's ID
 *     responses:
 *       200:
 *         description: A single army
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Army'
 *       404:
 *         description: Army not found
 */
const getSingle = async (req, res) => {
  try {
    const army = await Army.findById(req.params.id).populate('general').populate('wave');
    if (!army) {
      return res.status(404).json({ message: 'Army not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(army);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get army', error: error.message });
  }
};

/**
 * @swagger
 * /armies:
 *   post:
 *     summary: Create a new army
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Army'
 *     responses:
 *       201:
 *         description: Army created
 *       400:
 *         description: Bad request
 */
const createSingle = async (req, res) => {
  const army = new Army({
    name: req.body.name,
    type: req.body.type,
    general: req.body.general,
    attack: req.body.attack,
    defense: req.body.defense,
    move: req.body.move,
    range: req.body.range,
    life: req.body.life,
    cost: req.body.cost,
    specialPowers: req.body.specialPowers,
    class: req.body.class,
    species: req.body.species,
    personality: req.body.personality,
    size: req.body.size,
    height: req.body.height,
    url: req.body.url,
    wave: req.body.wave
  });

  try {
    await army.save();
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ message: 'New army added', id: army._id });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create army', error: error.message });
  }
};

/**
 * @swagger
 * /armies/{id}:
 *   delete:
 *     summary: Delete an army by ID
 *     description: Delete a single army by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The army's ID
 *     responses:
 *       200:
 *         description: Army deleted
 *       404:
 *         description: Army not found
 */
const deleteSingle = async (req, res) => {
  try {
    const army = await Army.findByIdAndDelete(req.params.id);
    if (!army) {
      return res.status(404).json({ message: 'Army not found' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ message: 'Army deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete army', error: error.message });
  }
};

/**
 * @swagger
 * /armies/{id}:
 *   put:
 *     summary: Update an existing army
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the army to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Army'
 *     responses:
 *       200:
 *         description: Army updated successfully
 *       404:
 *         description: Army not found
 *       400:
 *         description: Invalid data provided
 */
const updateSingle = async (req, res) => {
  try {
    const returnArmy = await Army.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!returnArmy) {
      return res.status(404).json({ message: 'Army not found' });
    }
    res.status(200).json(returnArmy);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update army', error: error.message });
  }
};

module.exports = { getAll, getSingle, createSingle, deleteSingle, updateSingle };
