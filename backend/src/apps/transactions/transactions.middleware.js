const service = require("./transactions.service");
const pportMiddleware = require("../../auth/passport.middleware");
const { json } = require("express");

const GetHistory = async (req, res, next) => {
  let [user] = await pportMiddleware.GetUser({ username: req.user });
  let userID = user.id;
  try {
    const history = await service.GetTransactionHistory(userID);
    res.status(200).json({ history });
  } catch (err) {
    console.log(`an error occured while getting the history : ${err.message}`);
    res.status(404).json({ error: err.message });
  }
};

const GetHistoryDetails = async (req, res, next) => {
  let transactionId = req.query.tranid;

  try {
    const details = await service.GetTransactionHistoryDetails(transactionId);
    res.json({ details });
  } catch (err) {
    console.log(
      `une erreure c'est produite au moment de retrouver les details: ${err.message}`
    );
    res.status(404).json({ error: err.message });
  }
};

const SaveTransaction = async (req, res, next) => {
  let user = req.user;
  let body = req.body;
  let d = new Date();
  let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  //save transaction first
  let transaction = {
    userID: user,
    date: date,
    startDate: body.startDate,
    endDate: body.endDate,
    nbAdults: body.nbAdults,
    nbKids: body.nbKids,
    cost: body.cost,
  };

  try {
    await service.SaveTransaction(transaction);

    //save activities
    transaction = await service.GetTransaction(date);
    for (let activity of body.activities) {
      await service.saveActivity(activity, transaction.id);
    }

    //save transport
    for (let transport of body.transports) {
      await service.saveTransport(transport, transaction.id);
    }
  } catch (error) {
    console.log("an error occurred while saving a new record", error);
    return res.status(400).json({ error: error });
  }
};

const cancelTransaction = async (req, res, next) => {
  let transaction = req.body;

  if (transaction.status != "Pending" && transaction.status != "Paid")
    return res.status(400).json({ error: "cannot be cancelled" });

  if (Date(transaction.startDate() - Date.now() < 2 * 24 * 60 * 60))
    return res.status(400).json({ error: "cannot be cancelled" });

  try {
    await service.CancelTransaction(transaction);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(`error while cancelling a transaction ${error}`);
    return res.status(400).json({ error: error });
  }
};

module.exports = {
  GetHistory,
  SaveTransaction,
  GetHistoryDetails,
  cancelTransaction,
};
