const db = require("../../_db/db.service");
const helper = require("../../utils/helper");

const GetTransactionHistory = async (userID) => {
  const result = await db.Query("SELECT * FROM transaction where userID = ?", [
    userID,
  ]);
  const transactions = helper.EmptyOrRows(result);
  return transactions;
};

const GetTransactionHistoryDetails = async (transactionId) => {
  //get activities
  const result = await db.Query(
    `SELECT * FROM activity INNER JOIN (transactionActivity) 
            ON transactionActivity.activityID = activity.id
            AND transactionActivity.transactionID = ?`,
    [transactionId]
  );
  const activities = helper.EmptyOrRows(result);
  //todo: get transport
  let details = { activities: activities }; //, transports : transports}
  return details;
};

const CancelTransaction = async (transaction) => {
  const result = await db.Query(
    `UPDATE transaction SET status = 'Cancelled' 
     WHERE id = ?`,
    [transaction.id]
  );
  return result;
};

const SaveTransaction = async (transaction) => {
  const result = await db.query(
    `INSERT INTO transaction 
    (userID, date, startDate, endDate, cost, nbAdults, ndKids, cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      transaction.userID,
      transaction.date,
      transaction.startDate,
      transaction.endDate,
      transaction.cost,
      transaction.nbAdults,
      transaction.ndKids,
      transaction.cost,
    ]
  );
  return result;
};

const GetTransaction = async (date) => {
  const result = await db.Query(`SELECT * FROM transaction WHERE date = ?`, [
    date,
  ]);
  return result;
};

module.exports = {
  GetTransaction,
  SaveTransaction,
  CancelTransaction,
  GetTransactionHistory,
  GetTransactionHistoryDetails,
};
