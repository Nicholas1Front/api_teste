const {Router} = require('express');
const itemsController = require('../modules/items/items_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();

router.use(authMiddleware);

router.post('/create-item', itemsController.createItem);
router.put('/update-item/:id', itemsController.updateItem);
router.get('/find-items', itemsController.findItem);
router.get('/find-all-items', itemsController.findAllItems);
router.delete('/delete-item/:id', itemsController.deleteItem);

module.exports = router;
