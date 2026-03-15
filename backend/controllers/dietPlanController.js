const DietPlan = require('../models/DietPlan');
const Assessment = require('../models/Assessment');
const { generate7DayDietPlan } = require('../ai/dietGenerator');
const { generateDietPlanPDF } = require('../services/pdfService');

async function generate(req, res) {
  const { language = 'en' } = req.body || {};
  const lang = ['en', 'hi', 'mr'].includes(language) ? language : 'en';

  const latest = await Assessment.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!latest) return res.status(400).json({ message: 'Complete an assessment first' });

  const params = {
    riskLevel: latest.risk.riskLevel,
    language: lang,
    bmi: (latest.personal?.weightKg / ((latest.personal?.heightCm / 100) ** 2)).toFixed(1),
    lifestyle: latest.lifestyle,
    symptoms: latest.symptoms
  };

  const plan = await generate7DayDietPlan(params);
  
  // Generate base64 PDF
  const pdfBase64 = await generateDietPlanPDF(plan);

  const doc = await DietPlan.create({
    userId: req.user.id,
    language: lang,
    planData: plan,
    generatedForRisk: latest.risk.riskLevel,
  });

  return res.status(201).json({ dietPlanId: doc._id, plan, pdfBase64 });
}

async function latest(req, res) {
  const latestPlan = await DietPlan.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
  if (!latestPlan) return res.status(404).json({ message: 'No diet plan found' });
  return res.json({ dietPlan: latestPlan });
}

module.exports = { generate, latest };

