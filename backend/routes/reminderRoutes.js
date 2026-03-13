const express = require('express');
const { requireAuth } = require('../middleware/auth');
const reminderController = require('../controllers/reminderController');

const router = express.Router();

router.get('/', requireAuth, reminderController.list);
router.post('/', requireAuth, reminderController.upsertMany);

module.exports = router;

