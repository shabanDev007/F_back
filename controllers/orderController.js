const db = require("../models");
const { Customer, Order, OrderItem, Product } = db;

exports.createOrder = async (req, res) => {
  const transaction = await db.sequelize.transaction();
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
    // التحقق من البيانات المطلوبة
    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !customer ||
      !customer.email ||
      !customer.name ||
      !customer.phone ||
      !subtotal ||
      !total ||
      !customer.address
    ) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required order data (items, customer details, subtotal, total)" });
    }

    // التحقق من وجود المنتجات
    for (const item of items) {
      if (!item.id || !item.quantity || !item.itemPrice || !item.name) {
        await transaction.rollback();
        return res.status(400).json({ message: "Each item must have id, quantity, itemPrice, and name" });
      }
      const product = await Product.findByPk(item.id, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(400).json({ message: `Product with ID ${item.id} not found` });
      }
    }

    // البحث عن العميل أو إنشاء واحد جديد
    let customerRecord = await Customer.findOne({
      where: { phone: customer.phone },
      transaction,
    });

    if (!customerRecord) {
      customerRecord = await Customer.create(
        {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city || null,
          governorate: customer.governorate || null,
          totalOrders: 1,
          totalSpent: total,
          status: "active",
          joinDate: new Date(),
        },
        { transaction }
      );
    } else {
      // تحديث بيانات العميل لو موجود
      await customerRecord.update(
        {
          totalOrders: customerRecord.totalOrders + 1,
          totalSpent: parseFloat(customerRecord.totalSpent) + parseFloat(total),
          lastOrder: new Date(),
          address: customer.address || customerRecord.address,
          phone: customer.phone || customerRecord.phone,
          city: customer.city || customerRecord.city,
          governorate: customer.governorate || customerRecord.governorate,
        },
        { transaction }
      );
    }

    // إنشاء الطلبية
    const newOrder = await Order.create(
      {
        orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // توليد orderNumber فريد
        customerId: customerRecord.id,
        totalAmount: total,
        shippingFee: shippingFee || 0,
        discount: discount || 0,
        promoCode: promoCode || null,
        shippingAddress: customer.address,
        status: "pending",
        orderDate: orderDate ? new Date(orderDate) : new Date(),
      },
      { transaction }
    );

    // إنشاء عناصر الطلبية
    const orderItems = items.map((item) => ({
      orderId: newOrder.id,
      productId: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.itemPrice,
      selectedSize: item.selectedSize?.name || null,
      selectedColor: item.selectedColor?.name || null,
    }));

    await OrderItem.bulkCreate(orderItems, { transaction });

    await transaction.commit();
    return res.status(201).json({ message: "Order created successfully", orderId: newOrder.id });
  } catch (error) {
    await transaction.rollback();
    console.error("Order creation error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Customer, as: "customer" },
        { model: OrderItem, as: "items", include: [{ model: Product, as: "product" }] },
      ],
      order: [["createdAt", "DESC"]], // ترتيب الطلبيات حسب تاريخ الإنشاء (الأحدث أولاً)
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};