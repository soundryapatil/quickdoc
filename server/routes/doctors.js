const express = require('express');
const router = express.Router();
const db = require('../db');
const authMw = require('../middleware/auth');

// GET /doctors
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.specialty) filter.specialty = req.query.specialty;
    const docs = await db.listDoctors(filter);
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /doctors/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.findDoctorById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /doctors (protected)
router.post('/', authMw, async (req, res) => {
  try {
    const doc = await db.addDoctor(req.body);
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /doctors/:id - update doctor (doctor owner or admin)
router.patch('/:id', authMw, async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;
    // only admin or the doctor owner can update
    const doc = await db.findDoctorById(id);
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    if (user.role !== 'admin' && String(doc.userId) !== String(user.id) && String(doc.userId) !== String(user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updated = await db.updateDoctor(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
