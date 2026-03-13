const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true }, // Lunch/Exercise/Water/Sleep
    time: { type: String, required: true }, // "HH:mm" in user's locale
    enabled: { type: Boolean, default: true },
    lastSentAt: { type: Date, default: null },
    lastSentDay: { type: String, default: '' }, // YYYY-MM-DD to avoid re-sending same day/time
  },
  { timestamps: true },
);

module.exports = mongoose.model('Reminder', reminderSchema);

