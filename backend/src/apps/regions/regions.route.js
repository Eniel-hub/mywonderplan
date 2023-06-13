// const auth = require('../../auth/AuthAndAut');

const router = require ('express').Router();
const middleware = require('./regions.middleware');


//get request
router.get('/', middleware.GetAllRegions)

module.exports = router;