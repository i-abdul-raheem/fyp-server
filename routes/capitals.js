const route = require("express").Router();
const { Capital, Account } = require("../models/model");
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

// Get all capitals
route.get("/", async (req, res) => {
  const capitals = await Capital.find();
  return setResponse(200, null, capitals, res);
});

// Get single capital
route.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const capital = await Capital.findOne({ _id: ObjectId(req.params.id) });
  if (!capital) {
    return setResponse(404, "Capital not found", capital, res);
  }
  return setResponse(200, null, capital, res);
});

// Add new capital
route.post("/", async (req, res) => {
  const data = req.body;
  if (!data.account || data.account == "") {
    return setResponse(405, "Account is required", null, res);
  }
  if (!ObjectId.isValid(data.account)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const accountExist = await Account.findOne({
    _id: ObjectId(data.account),
    accountType: "investor",
  });
  if (!accountExist) {
    return setResponse(405, "Invalid account id", null, res);
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
  const newCapital = new Capital(data);
  newCapital.save();
  return setResponse(201, "Capital Added", newCapital, res);
});

// Delete capital
route.delete("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const capitalExist = await Capital.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!capitalExist) {
    return setResponse(404, "Capital not found", null, res);
  }
  const deleted = await Capital.deleteOne({ _id: ObjectId(req.params.id) });
  return setResponse(200, "Capital deleted", deleted, res);
});

module.exports = route;
