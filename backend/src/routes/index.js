const { Router } = require('express');
const authRoutes = require('./auth_routes');
const itemsRoutes = require('./items_routes');
const ordersRoutes = require('./orders_routes');

const router = Router();
router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);
router.use('/orders', ordersRoutes);

module.exports = router;