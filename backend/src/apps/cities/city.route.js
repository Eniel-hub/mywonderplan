// const auth = require('../../auth/AuthAndAut');

const router = require ('express').Router();
const middleware = require('./city.middleware');


//get request
router.get('/', middleware.GetAllCities) //regid is regionID

module.exports = router;