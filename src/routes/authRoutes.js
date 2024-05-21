const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/authenticate', authController.authenticate);

module.exports = router;
