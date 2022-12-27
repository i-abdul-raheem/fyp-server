const route = require("express").Router();
const { Expense, Purchase } = require("../models/model");
const ObjectId = require("mongoose").Types.ObjectId;

function setResponse(status = null, message = null, data = null, resp) {
  const response = {};
  response.status = status;
  response.message = message;
  response.data = data;
  return resp.status(response.status).json(response);
}

const isAlphabat = (val) => {
  return isNaN(val);
};

const isSymbol = (val) => {
  const ascii = val.charCodeAt(0);
  if (ascii < 48 || ascii > 122) {
    return true;
  }
  if (ascii > 57 && ascii < 65) {
    return true;
  }
  if (ascii > 90 && ascii < 97) {
    return true;
  }
  return false;
};

const iterateWithFunction = (data, func) => {
  return data.split("").some((i) => {
    return func(i);
  });
};

// Get all expenses
route.get("/", async (req, res) => {
  const expenses = await Expense.find();
  return setResponse(200, null, expenses, res);
});

// Get single expense
route.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const expense = await Expense.findOne({ _id: ObjectId(req.params.id) });
  if (!expense) {
    return setResponse(404, "Expense not found", expense, res);
  }
  return setResponse(200, null, expense, res);
});

// Add new expense
route.post("/", async (req, res) => {
  const data = req.body;
  if (!data.title || data.title == "") {
    return setResponse(405, "Title is required", null, res);
  }
  if (!data.amount || data.amount == "") {
    return setResponse(405, "Amount is required", null, res);
  }
  if (iterateWithFunction(data.amount, isAlphabat)) {
    return setResponse(
      405,
      "AMOUNT can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.amount, isSymbol)) {
    return setResponse(405, "Amount can not contain symbol", null, res);
  }
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const now = `${month}/${day}/${year}`;
  data.date = now;
  const newExpense = new Expense(data);
  await newExpense.save();
  return setResponse(201, "Expense Added", newExpense, res);
});

// Delete expense
route.delete("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const expenseExist = await Expense.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!expenseExist) {
    return setResponse(404, "Expense not found", null, res);
  }
  const deleted = await Expense.deleteOne({ _id: ObjectId(req.params.id) });
  return setResponse(200, "Expense deleted", deleted, res);
});

module.exports = route;
