const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    personal: {
      name: { type: String, required: true, trim: true },
      age: { type: Number, required: true },
      heightCm: { type: Number, required: true },
      weightKg: { type: Number, required: true },
    },
    menstrual: {
      cycleRegularity: { type: String, required: true }, // Regular/Irregular/Very irregular/Absent
      cycleDurationDays: { type: Number, required: true },
    },
    symptoms: {
      acne: { type: Boolean, default: false },
      hairLoss: { type: Boolean, default: false },
      weightGain: { type: Boolean, default: false },
      fatigue: { type: Boolean, default: false },
    },
    lifestyle: {
      sleepHours: { type: Number, required: true },
      stressLevel: { type: String, required: true }, // Low/Medium/High
      exerciseFrequency: { type: String, required: true }, // Never/1-2x/3-5x/Daily
    },
    familyHistory: {
      pcosHistory: { type: String, required: true }, // Yes/No/Not sure
    },
    risk: {
      riskLevel: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
      score: { type: Number, required: true },
      explanation: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Assessment', assessmentSchema);

