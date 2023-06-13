const service = require('./city.service')

const GetAllCities =  async (req, res, next) => {
    let regid = req.query.regid;
    //pour recevoir toutes les villes
    try {
        const villes = await service.GetAllCities(regid);
        res.json({villes})
    } catch (err) {
        console.log(`an error occured while getting all cities: ${err.message}`);
        res.status(404).json({error: err.message})
    }
}

module.exports = {
    GetAllCities
}