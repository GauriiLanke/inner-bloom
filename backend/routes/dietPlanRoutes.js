const express = require('express');
const { requireAuth } = require('../middleware/auth');
const dietPlanController = require('../controllers/dietPlanController');

const router = express.Router();

router.post('/generate', requireAuth, dietPlanController.generate);
router.get('/latest', requireAuth, dietPlanController.latest);

module.exports = router;

