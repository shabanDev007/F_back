const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const discountRouters = require('./routes/discountRouters');
const orderRoutes = require('./routes/ordersRoutes');


const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());





// تفعيل CORS لكل الطلبات القادمة من origin محدد
app.use(cors({
    origin: '*',  // اسم الموقع الذي ترغب في السماح له بالوصول
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // إذا أردت تحديد طرق الطلب المسموح بها
    allowedHeaders: ['Content-Type', 'Authorization'],  // إذا أردت السماح برؤوس معينة
  }));
  

// Routes
app.use('/api/products', productRoutes);
app.use('/api/discount', discountRouters);
app.use('/api/orders', orderRoutes);


module.exports = app;