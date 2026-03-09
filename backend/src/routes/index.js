const { Router } = require('express');
const authRoutes = require('./auth_routes');
const itemsRoutes = require('./items_routes');
const ordersRoutes = require('./orders_routes');
const devRoutes = require('./dev_routes');

const router = Router();
router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);
router.use('/orders', ordersRoutes);
router.use('/dev', devRoutes);

module.exports = router;