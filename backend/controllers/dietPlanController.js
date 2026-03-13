const DietPlan = require('../models/DietPlan');
const Assessment = require('../models/Assessment');
const { generate7DayDietPlan } = require('../services/dietPlanService');

async function generate(req, res) {
  const { language = 'en' } = req.body || {};
  const lang = ['en', 'hi', 'mr'].includes(language) ? language : 'en';

  const latest = await Assessment.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!latest) return res.status(400).json({ message: 'Complete an assessment first' });

  const plan = generate7DayDietPlan({ riskLevel: latest.risk.riskLevel, language: lang });

  const doc = await DietPlan.create({
    userId: req.user.id,
    language: lang,
    planData: plan,
    generatedForRisk: latest.risk.riskLevel,
  });

  return res.status(201).json({ dietPlanId: doc._id, plan });
}

async function latest(req, res) {
  const latestPlan = await DietPlan.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!latestPlan) return res.status(404).json({ message: 'No diet plan found' });
  return res.json({ dietPlan: latestPlan });
}

module.exports = { generate, latest };

