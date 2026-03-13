const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    language: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
    planData: { type: Object, required: true }, // { days: [{ day, breakfast, lunch, dinner, snacks? }] }
    generatedForRisk: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('DietPlan', dietPlanSchema);

