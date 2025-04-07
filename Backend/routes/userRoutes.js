const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyJWT} = require('../middleware/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/verify',userController.verifyotp);
router.post('/forgot',userController.forgotPassword);
router.post('/reset',userController.resetPassword);
router.post('/profile',verifyJWT,userController.profile);

module.exports = router;
