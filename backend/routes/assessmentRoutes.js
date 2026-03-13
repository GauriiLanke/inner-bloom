const express = require('express');
const { requireAuth } = require('../middleware/auth');
const assessmentController = require('../controllers/assessmentController');

const router = express.Router();

router.post('/', requireAuth, assessmentController.submitAssessment);
router.get('/latest', requireAuth, assessmentController.latestAssessment);
router.get('/history', requireAuth, assessmentController.history);

module.exports = router;

