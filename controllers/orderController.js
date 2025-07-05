// controllers/ordersController.js

const { Order, OrderItem } = require("../models");

exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      shippingFee,
      discount,
      promoCode,
      total,
      customer,
      orderDate,
    } = req.body;

    if (!items || items.length === 0 || !customer || !subtotal || !total) {
      return res.status(400).json({ message: "Missing order data" });
    }

    // Create the order
    const newOrder = await Order.create({
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      governorate: customer.governorate,
      notes: customer.notes,
      shippingFee,
      discount,
      promoCode,
      subtotal,
      total,
      orderDate: orderDate || new Date(),
    });

    // Add items to the order
    const orderItems = items.map((item) => ({
      orderId: newOrder.id,
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      itemPrice: item.itemPrice,
      selectedSize: item.selectedSize?.name || null,
      selectedColor: item.selectedColor?.name || null,
    }));

    await OrderItem.bulkCreate(orderItems);

    return res.status(201).json({ message: "Order created", orderId: newOrder.id });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
