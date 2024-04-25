const express = require('express');
const coinTypesRouter = express.Router();
const getAllCoinTypes = require('../controllers/coinType.controller.js');

coinTypesRouter.get('/', getAllCoinTypes);

module.exports = coinTypesRouter;
