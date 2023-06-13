// const auth = require('../../auth/AuthAndAut');

const router = require ('express').Router();
const middleware = require('./activities.middleware');


//get request
router.get('/', middleware.GetAllActivities) //citid is city id

module.exports = router;