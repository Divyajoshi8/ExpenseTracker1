const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const userAuthentication = require("../middlewares/auth");

router.get("/getReports", reportsController.getReports);
router.post("/daily", userAuthentication, reportsController.dailyReports);
router.post("/monthly", userAuthentication, reportsController.monthlyReports);
module.exports = router;