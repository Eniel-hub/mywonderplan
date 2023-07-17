const helper = require("../../utils/helper");
const service = require("./transactions.service");
const userService = require("../user/user.service");
const actService = require("../activities/activities.service");
const pportMiddleware = require("../../auth/passport.middleware");

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
  let [user] = await userService.GetUser("user2");
  let body = req.body;
  let d = new Date();
  let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

  /**
   * Save Transaction in database. cost will be saved after the activities and transport are savec.
   * @param {number} [user] - userID
   * @param {date} [startDate]
   * @param {date} [endDate]
   * @param {number} [nbAdults]
   * @param {number} [nbKids]
   * @returns {void}
   */
  let transaction = {
    userID: user.id,
    date: date,
    startDate: body.startDate,
    endDate: body.endDate,
    nbAdults: body.nbAdults,
    nbKids: body.nbKids,
  };

  try {
    await service.SaveTransaction(transaction);

    //save activities
    const activitiesSaved = await saveActivities(date, body, user);
    console.log(activitiesSaved);
    //save transport
    for (let transport of body.transports) {
      await service.saveTransport(transport, transaction.id);
    }
  } catch (error) {
    console.log("an error occurred while saving a new record", error);
    return res.status(400).json({ error: error });
  }
};

/**
 * Save Activities. compute total cost for activities knowing.
 * @param {date} [date] - to retreived the transactionID
 * @param {object} [body]
 * for each activity:
 * - retreive the activity
 * - retreive schedule
 * - retreive priceList
 * - check valid schedule
 * - compute cost
 * @returns {number?, error?} - returns cost if all the activities are valid or an error {statut: boolean, type : string}
 */
const saveActivities = async (date, body) => {
  transaction = await service.GetTransaction(date);
  console.log(transaction);
  let cost;
  console.log(body.activities);
  for (let activity of body.activities) {
    console.log(activity);
    let [act] = await actService.getActivity(activity);
    console.log(act);
    let [sched] = await actService.getSchedule(act.scheduleID);
    let day = helper.getDay(date);
    //go through schedule and look for the availability for a specific day

    console.log(sched);
    let [priceList] = await actService.getPriceList(act.priceListID);
    console.log(priceList);
    // await service.saveActivity(activity, transaction.id);
  }
  return true;
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
