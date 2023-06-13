const db = require('../../_db/db.service');
const helper = require('../../utils/helper');

const GetTransactionHistory = async (userID) =>{
    const result = await db.Query(
        'SELECT * FROM transaction where userID = ?',
        [userID]
    );
    const transactions = helper.EmptyOrRows(result);
    return transactions;
}

const GetTransactionHistoryDetails = async (transactionId) =>{
    //get activities
    const result = await db.Query(
        `SELECT * FROM activity INNER JOIN (transactionActivity) 
            ON transactionActivity.activityID = activity.id
            AND transactionActivity.transactionID = ?`,
            [transactionId]
    )
    const activities = helper.EmptyOrRows(result);
    //todo: get transport
    let details = {activities : activities} //, transports : transports}
    return details;
}

module.exports = {
    GetTransactionHistory,
    GetTransactionHistoryDetails
}
