const express = require('express');

const router = express.Router();
const authRoutes = require('./authRoutes');
const assessmentRoutes = require('./assessmentRoutes');
const dietPlanRoutes = require('./dietPlanRoutes');
const reminderRoutes = require('./reminderRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const chatRoutes = require('./chatRoutes');

// Route modules (to be implemented)
router.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Inner Bloom API' });
});

router.use('/auth', authRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/diet-plans', dietPlanRoutes);
router.use('/reminders', reminderRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/chat', chatRoutes);

module.exports = router;

