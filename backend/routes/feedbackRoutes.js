const express = require('express');
const { requireAuth } = require('../middleware/auth');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

router.post('/', requireAuth, feedbackController.submit);
router.get('/mine', requireAuth, feedbackController.listMine);
router.get('/analytics', requireAuth, feedbackController.analytics);

module.exports = router;

