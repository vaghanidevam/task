const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/auth');

// User routes
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);
router.get('/dashboard', isLoggedIn, userController.getDashboard);
router.post('/click', isLoggedIn, userController.postClick);
router.get('/payout', isLoggedIn, userController.getPayout);
router.post('/payout', isLoggedIn, userController.postPayout);
router.post('/click', userController.postClick);
router.get('/user/bonus', userController.getBonus);
module.exports = router;