const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /doctor/appointments - get appointments for logged-in doctor
router.get('/appointments', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    // Get all appointments
    const allAppointments = await db.listAllAppointments();
    
    // Filter appointments for this doctor.
    // Coerce comparisons to strings so ObjectId vs string mismatches don't hide appointments.
    const doctorAppointments = allAppointments.filter(a => {
      try {
        const doc = a.doctor || {};
        // compare userId (may be ObjectId, number or string)
        if (doc.userId && String(doc.userId) === String(req.user.id)) return true;
        if (doc.userId && req.user._id && String(doc.userId) === String(req.user._id)) return true;
        // also allow comparing doctor record id to req.user.id in some edge cases
        if ((doc.id || doc._id) && String(doc.userId) === String(req.user.id)) return true;
        // sometimes doctor record may include an email property
        if (doc.email && req.user.email && String(doc.email).toLowerCase() === String(req.user.email).toLowerCase()) return true;
      } catch (err) {
        // ignore and skip
      }
      return false;
    });
    
    res.json(doctorAppointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /doctor/profile - get doctor's own profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // load doctors and attempt multiple safe comparisons (string/number/email)
    const doctors = await db.listDoctors();
    // debug logging to help diagnose "not found" issues
    console.log('doctor/profile request for user:', req.user);
    console.log('doctors count:', doctors.length);

    const doctorProfile = doctors.find(d => {
      try {
        if (!d) return false;
        // compare userId and req.user.id/ _id as strings
        if (d.userId && String(d.userId) === String(req.user.id)) return true;
        if (d.userId && req.user._id && String(d.userId) === String(req.user._id)) return true;
        // sometimes doctor record may include an email property
        if (d.email && req.user.email && String(d.email).toLowerCase() === String(req.user.email).toLowerCase()) return true;
        // fallback: compare doctor name with user name if available
        if (d.name && req.user.name && String(d.name).toLowerCase() === String(req.user.name).toLowerCase()) return true;
      } catch (err) {
        // ignore comparison errors
      }
      return false;
    });
    
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    
    res.json(doctorProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
