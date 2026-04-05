const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserCreate, validateUserUpdate } = require('../middleware/validators');

router.get('/', userController.listUsers);
router.post('/', validateUserCreate, userController.createUser);
router.put('/:id', validateUserUpdate, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
