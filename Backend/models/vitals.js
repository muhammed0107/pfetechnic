const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  temperature: Number,
  bpm: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vitals', vitalsSchema,'Braclet-iot');
