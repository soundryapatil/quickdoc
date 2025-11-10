const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /admin/appointments - admin and doctor can access
router.get('/appointments', auth, async (req, res) => {
  try {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'doctor')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const items = await db.listAllAppointments();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
