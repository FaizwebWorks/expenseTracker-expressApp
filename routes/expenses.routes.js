const express = require("express");
const router = express.Router();
const expenseModel = require("../models/expense.schema");

router.get("/create", (req, res) => {
  res.render("createexpense", { title: "Expense Tracker | Create Expense" });
});

router.post("/create", async (req, res, next) => {
  try {
    const newExpense = new expenseModel(req.body);
    await newExpense.save();
    res.redirect("/expense/show");
  } catch (error) {
    next(error);
  }
});

router.get("/show", async (req, res, next) => {
  try {
    const expenses = await expenseModel.find();
    res.render("showexpense", {
      title: "Expense Tracker | Watch Expenses",
      expenses: expenses,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/details/:id", async (req, res, next) => {
  try {
    const expense = await expenseModel.findById(req.params.id);
    res.render("details", {
      title: "Expense Tracker | Details",
      expense: expense,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    await expenseModel.findByIdAndDelete(req.params.id);
    res.redirect("/expense/show");
  } catch (error) {
    next(error);
  }
});

router.get("/update/:id", async (req, res, next) => {
  try {
    const updateExpense = await expenseModel.findById(req.params.id);
    res.render("updateexpense", {
      title: "Expense Tracker | Update Expense",
      updateExpense: updateExpense,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/update/:id", async (req, res, next) => {
  try {
    await expenseModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/expense/details/" + req.params.id);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
