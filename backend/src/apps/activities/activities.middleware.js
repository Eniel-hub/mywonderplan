const service = require('./activities.service')

const GetAllActivities =  async (req, res, next) => {
    let cityID = req.query.citid; //citid is city id
    try {
        const activites = await service.GetAllActivities(cityID);
        res.json({activites})
    } catch (err) {
        console.log(`an error occured in getting activities : ${err.message}`);
        res.status(404).json({error: err.message})
    }
}

module.exports = {
    GetAllActivities
}