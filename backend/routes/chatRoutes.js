const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Public AI chat endpoint – no auth required.
router.post('/', chatController.chat);

module.exports = router;

