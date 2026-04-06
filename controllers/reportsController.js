const path = require("path");
const Expense = require("../models/expenseModel");

exports.getReports = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};

exports.dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date;
    const expenses = await Expense.find({ date: date, userId: req.user._id });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;
    const userId = req.user._id;

    const expenses = await Expense.find({
      date: { $regex: `.*-${month}-.*` },
      userId: userId,
    });
    
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

