const express = require('express');
const AuthController = require('../controllers/auth/authController');
const authRouter = express.Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/change-password', AuthController.changePassword);

module.exports = authRouter
