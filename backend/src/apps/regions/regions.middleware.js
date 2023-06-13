const service = require('./regions.service')

const GetAllRegions =  async (req, res, next) => {
    try {
        const regions = await service.GetAllRegions();
        res.json({regions})
    } catch (err) {
        console.log(`an error occured while getting the regions : ${err.message}`);
        res.status(404).json({error: err.message})
    }
}

module.exports = {
    GetAllRegions
}