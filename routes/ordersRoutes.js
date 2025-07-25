// routes/orders.js

const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orderController");

// POST /api/orders
router.post('/', ordersController.createOrder);
router.get('/', ordersController.getOrders);


module.exports = router;
