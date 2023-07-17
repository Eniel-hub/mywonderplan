const db = require("../../_db/db.service");
const helper = require("../../utils/helper");

const GetAllActivities = async (cityID) => {
  const result = await db.Query("SELECT * FROM activity WHERE cityID = ?", [
    cityID,
  ]);
  const activites = helper.EmptyOrRows(result);
  return activites;
};

const getActivity = async (id) => {
  const result = await db.Query(`SELECT * FROM activity WHERE id = ?`, [id]);
  return result;
};

const getPriceList = async (PriceListID) => {
  const result = await db.Query(`SELECT * FROM price WHERE id = ?`, [
    PriceListID,
  ]);
  return result;
};

const getSchedule = async (scheduleId) => {
  const result = await db.Query(`SELECT * FROM schedule WHERE id = ?`, [
    scheduleId,
  ]);
  return result;
};

module.exports = {
  getPriceList,
  getSchedule,
  getActivity,
  GetAllActivities,
};
