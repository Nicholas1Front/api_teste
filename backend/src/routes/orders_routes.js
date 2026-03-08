const {Router} = require('express');

const ordersController = require('../modules/orders/orders_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();

router.use(authMiddleware);

router.post('/create-order', ordersController.createrOrder);
router.put('/update-order/:id', ordersController.updateOrder);
router.delete('/delete-order/:id', ordersController.deleteOrder);
router.get('/find-orders', ordersController.getOrders);
router.get('/find-all-orders', ordersController.getAllOrders);

module.exports = router;