const countrieRouter = require('express').Router();
const countrieController = require('../../controllers/Others/countrieController');
const verifToken = require('../../middlewares/verifyToken');

countrieRouter.use(verifToken);

countrieRouter.get('/countries', countrieController.findAllElementNationalite);

module.exports = countrieRouter
