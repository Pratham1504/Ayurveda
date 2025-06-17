const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const addressController = require('../controllers/AddressController');
const { isAuth} = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/verify',userController.verifyotp);
router.post('/forgot',userController.forgotPassword);
router.post('/reset',userController.resetPassword);
router.get('/me',isAuth,userController.profile);
router.post('/addAddress',isAuth,addressController.addAddress);
router.post('/removeAddress',isAuth,addressController.removeAddress);
router.get('/getAddress',isAuth,addressController.getAddresses);
router.patch('/updateAddress', isAuth, addressController.updateAddress);
module.exports = router;
