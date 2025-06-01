const express = require('express');
const router = express.Router();
const Vitals = require('../models/Vitals');

// POST /api/vitals
router.post('/vitals', async (req, res) => {
  const { temperature, bpm, timestamp } = req.body;

  try {
    const newVitals = new Vitals({ temperature, bpm, timestamp });
    await newVitals.save();
    res.status(201).json({ message: '✅ Données enregistrées', data: newVitals });
  } catch (err) {
    console.error('❌ Erreur vitals:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
