const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const items = await db.findAppointmentsByUser(req.user.id);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { doctorId, date, slot } = req.body;
    const doctor = await db.findDoctorById(doctorId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    const appt = await db.addAppointment({ user: userId, doctor: doctorId, date, slot });
    res.status(201).json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.cancelAppointment(req.params.id, req.user.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Cancelled' });
  } catch (err) {
    if (err.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /appointments/:id - update appointment (e.g., mark paid)
router.patch('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const changes = req.body;

    // Allow doctors to update appointments that belong to them.
    if (req.user.role === 'doctor') {
      // find the appointment and verify it belongs to this doctor
      const all = await db.listAllAppointments();
      const appt = all.find(a => String(a.id || a._id) === String(req.params.id));
      if (!appt) return res.status(404).json({ message: 'Appointment not found' });
      // appt.doctor may be populated (object) or an id; compare userId on doctor record when available
      const doc = appt.doctor || {};
      const doctorUserId = doc.userId || doc.user || doc.userId;
      if (doctorUserId && String(doctorUserId) === String(req.user.id)) {
        const updated = await db.updateAppointment(req.params.id, changes, userId, true); // allow
        return res.json(updated);
      }
      // fallback: sometimes doctor's id stored in appointment.doctor equals req.user.id
      if (String(appt.doctor) === String(req.user.id) || String(appt.doctor?._id) === String(req.user.id)) {
        const updated = await db.updateAppointment(req.params.id, changes, userId, true);
        return res.json(updated);
      }
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updated = await db.updateAppointment(req.params.id, changes, userId, isAdmin);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Forbidden') return res.status(403).json({ message: 'Forbidden' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
