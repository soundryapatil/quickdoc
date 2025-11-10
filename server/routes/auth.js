const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: 'Missing fields' });
    const existing = await db.findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await db.addUser({ name, email, password: hash, role: 'user' });
    const token = jwt.sign({ id: user._id || user.id || user._id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await db.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id || user.id, email: user.email, role: user.role || 'user' }, process.env.JWT_SECRET || 'changeme', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id || user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /auth/me - current user
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const id = req.user.id;
    const user = await db.findUserByEmail(req.user.email) || (db.useMongo() ? await db.Models?.User?.findById(id) : null);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id || user.id, name: user.name, email: user.email, role: user.role, ...(user.address ? { address: user.address } : {}) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /auth/me - update profile
router.patch('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const id = req.user.id;
    const changes = req.body;
    const updated = await db.updateUser(id, changes);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

