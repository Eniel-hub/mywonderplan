const db = require('../../_db/db.service');
const helper = require('../../utils/helper');

//Get all regions
const GetAllRegions = async () =>{
    const result = await db.Query(
        'SELECT * FROM region',
        []
    );
    const regions = helper.EmptyOrRows(result);
    return regions;
}

module.exports = {
    GetAllRegions
}