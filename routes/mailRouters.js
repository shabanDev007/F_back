// routes/mail.js
const express = require('express');
const router = express.Router();
const { addMail } = require('../controllers/mailController');

router.post('/', addMail);

module.exports = router;
