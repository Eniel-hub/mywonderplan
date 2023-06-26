const router = require("express").Router();
const auth = require("../../auth/AuthAndAut");
const middleware = require("./transactions.middleware");

//get request
router.get("/history", auth.IsAuth, middleware.GetHistory);

router.get("/history/detail", auth.IsAuth, middleware.GetHistoryDetails);

//post request
router.post("/save", auth.IsAuth, middleware.SaveTransaction);

router.post("/cancel", auth.IsAuth, middleware.cancelTransaction);

module.exports = router;
