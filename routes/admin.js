const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin Login
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);

// Admin Dashboard with Pagination
router.get('/dashboard', adminController.getDashboard);

// Remove User
router.post('/remove-user', adminController.removeUser);

module.exports = router;
