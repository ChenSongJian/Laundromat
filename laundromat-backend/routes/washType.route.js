const express = require('express');
const washTypesRouter = express.Router();
const getAllWashTypes = require('../controllers/washType.controller.js');

washTypesRouter.get('/', getAllWashTypes);

module.exports = washTypesRouter;
