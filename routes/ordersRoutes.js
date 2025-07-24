// routes/orders.js

const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/orderController");

// POST /api/orders
router.post('/', ordersController.createOrder);
router.get('/', ordersController.getOrders);
router.put('/:id/status',ordersController.updateStatus);
router.delete('/:id',ordersController.deleteOrder)

module.exports = router;
