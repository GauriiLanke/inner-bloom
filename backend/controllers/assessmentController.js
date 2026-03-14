const Assessment = require('../models/Assessment');
const Reminder = require('../models/Reminder');
const { scoreAssessment } = require('../services/riskScoringService');
const { buildRecommendations } = require('../services/recommendationService');

async function submitAssessment(req, res) {
  const payload = req.body || {};

  const required = [
    payload?.personal?.name,
    payload?.personal?.age,
    payload?.personal?.heightCm,
    payload?.personal?.weightKg,
    payload?.menstrual?.cycleRegularity,
    payload?.menstrual?.cycleDurationDays,
    payload?.lifestyle?.sleepHours,
    payload?.lifestyle?.stressLevel,
    payload?.lifestyle?.exerciseFrequency,
    payload?.familyHistory?.pcosHistory,
  ];
  if (required.some((v) => v === undefined || v === null || v === '')) {
    return res.status(400).json({ message: 'Missing required assessment fields' });
  }

  const risk = scoreAssessment(payload);

  const assessment = await Assessment.create({
    userId: req.user.id,
    personal: payload.personal,
    menstrual: payload.menstrual,
    symptoms: payload.symptoms || {},
    lifestyle: payload.lifestyle,
    familyHistory: payload.familyHistory,
    risk,
  });

  // Ensure the user has baseline daily reminders after their first assessment.
  const existingReminderCount = await Reminder.countDocuments({ userId: req.user.id });
  if (existingReminderCount === 0) {
    const defaults = [
      { type: 'Breakfast', time: '08:00' },
      { type: 'Lunch', time: '13:00' },
      { type: 'Dinner', time: '20:00' },
    ];
    await Reminder.insertMany(
      defaults.map((d) => ({
        userId: req.user.id,
        type: d.type,
        time: d.time,
        enabled: true,
      })),
    );
  }

  return res.status(201).json({
    assessmentId: assessment._id,
    risk,
    recommendations: buildRecommendations(risk.riskLevel),
  });
}

async function latestAssessment(req, res) {
  const latest = await Assessment.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!latest) return res.status(404).json({ message: 'No assessment found' });
  return res.json({ assessment: latest, recommendations: buildRecommendations(latest.risk.riskLevel) });
}

async function history(req, res) {
  const limit = Math.max(1, Math.min(30, Number(req.query.limit || 10)));
  const items = await Assessment.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('createdAt risk personal');

  return res.json({
    history: items.map((a) => ({
      id: a._id,
      createdAt: a.createdAt,
      score: a.risk?.score ?? 0,
      riskLevel: a.risk?.riskLevel ?? 'Low',
      name: a.personal?.name ?? '',
    })),
  });
}

module.exports = { submitAssessment, latestAssessment, history };

