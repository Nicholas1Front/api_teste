const { Router } = require('express');
const authRoutes = require('./auth_routes');
const itemsRoutes = require('./items_routes');

const router = Router();
router.use('/auth', authRoutes);
router.use('/items', itemsRoutes);

module.exports = router;