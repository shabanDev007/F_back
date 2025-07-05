const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

// route.get()
router.post('/Apply',discountController.applyDiscount);
router.post('/add',discountController.addDiscount);


module.exports = router;