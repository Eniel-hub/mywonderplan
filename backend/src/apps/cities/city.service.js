const db = require('../../_db/db.service');
const helper = require('../../utils/helper');

//Get School by id
const GetAllCities = async (regid) =>{
    const result = await db.Query(
        'SELECT * FROM city WHERE regionID = ?',
        [regid]
    );
    const villes = helper.EmptyOrRows(result);
    return villes;
}


module.exports = {
    GetAllCities
}