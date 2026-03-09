const {Router} = require('express');
const devController = require('../modules/dev/dev_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();

router.post('/reset-database', authMiddleware, devController.resetDatabase);

module.exports = router;