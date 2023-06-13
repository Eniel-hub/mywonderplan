const db = require('../../_db/db.service');
const helper = require('../../utils/helper');

const GetAllActivities = async (cityID) =>{
    const result = await db.Query(
        'SELECT * FROM activity WHERE cityID = ?',
        [cityID]
    );
    const activites = helper.EmptyOrRows(result);
    return activites;
}


module.exports = {
    GetAllActivities
}