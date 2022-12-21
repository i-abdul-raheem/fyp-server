const route = require("express").Router();
const { Account } = require("../models/model");
const ObjectId = require("mongoose").Types.ObjectId;

function setResponse(status = null, message = null, data = null, resp) {
  const response = {};
  response.status = status;
  response.message = message;
  response.data = data;
  return resp.status(response.status).json(response);
}

const isNumeric = (val) => {
  return !isNaN(val);
};

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

// Get all accounts
route.get("/", async (req, res) => {
  const accounts = await Account.find();
  return setResponse(200, null, accounts, res);
});

// Get single account
route.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const account = await Account.findOne({ _id: ObjectId(req.params.id) });
  if (!account) {
    return setResponse(404, "Account not found", account, res);
  }
  return setResponse(200, null, account, res);
});

// Add new account
route.post("/", async (req, res) => {
  const data = req.body;
  if (!data.fname || data.fname == "") {
    return setResponse(405, "First name is required", null, res);
  }
  if (iterateWithFunction(data.fname, isNumeric)) {
    return setResponse(405, "First name can not contain number", null, res);
  }
  if (iterateWithFunction(data.fname, isSymbol)) {
    return setResponse(405, "First name can not contain symbol", null, res);
  }
  if (!data.lname || data.lname == "") {
    return setResponse(405, "Last name is required", null, res);
  }
  if (iterateWithFunction(data.lname, isNumeric)) {
    return setResponse(405, "Last name can not contain number", null, res);
  }
  if (iterateWithFunction(data.lname, isSymbol)) {
    return setResponse(405, "Last name can not contain symbol", null, res);
  }
  if (!data.cnic || data.cnic == "") {
    return setResponse(405, "CNIC is required", null, res);
  }
  if (iterateWithFunction(data.cnic, isAlphabat)) {
    return setResponse(
      405,
      "CNIC can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.cnic, isSymbol)) {
    return setResponse(405, "CNIC can not contain symbol", null, res);
  }
  if (data.cnic.split("").length < 13 || data.cnic.split("").length > 13) {
    return setResponse(405, "CNIC length should be 13", null, res);
  }
  const cnicExist = await Account.findOne({ cnic: data.cnic });
  if (cnicExist) {
    return setResponse(405, "Account already exist with this cnic", null, res);
  }
  if (!data.mobile || data.mobile == "") {
    return setResponse(405, "Mobile number is required", null, res);
  }
  if (iterateWithFunction(data.mobile, isAlphabat)) {
    return setResponse(
      405,
      "Mobile number can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.mobile, isSymbol)) {
    return setResponse(405, "Mobile number can not contain symbol", null, res);
  }
  if (data.mobile.split("").length < 11 || data.mobile.split("").length > 11) {
    return setResponse(405, "Mobile number length should be 11", null, res);
  }
  if (!data.address || data.address == "") {
    return setResponse(405, "Address is required", null, res);
  }
  if (data.email) {
    const validEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!data.email.match(validEmail)) {
      return setResponse(405, "Email address is not valid", null, res);
    }
    const emailExist = await Account.findOne({ email: data.email });
    if (emailExist) {
      return setResponse(
        405,
        "Account already exist with this email",
        null,
        res
      );
    }
  }
  if (data.emergency) {
    if (iterateWithFunction(data.emergency, isAlphabat)) {
      return setResponse(
        405,
        "Emergency number can not contain alphabat or symbol",
        null,
        res
      );
    }
    if (iterateWithFunction(data.emergency, isSymbol)) {
      return setResponse(
        405,
        "Emergency number can not contain symbol",
        null,
        res
      );
    }
    if (
      data.emergency.split("").length < 11 ||
      data.emergency.split("").length > 11
    ) {
      return setResponse(
        405,
        "Emergency number length should be 11",
        null,
        res
      );
    }
  }
  if (!data.accountType || data.accountType == "") {
    return setResponse(405, "Account Type is required", null, res);
  }
  data.status = true;
  const newAccount = new Account(data);
  newAccount.save();
  return setResponse(201, "Account Created", newAccount, res);
});

// Update account
route.put("/:id", async (req, res) => {
  const data = req.body;
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const accountExist = await Account.findOne({ _id: ObjectId(req.params.id) });
  if (!accountExist) {
    return setResponse(404, "Account does not exist", null, res);
  }
  if (!data.fname || data.fname == "") {
    return setResponse(405, "First name is required", null, res);
  }
  if (iterateWithFunction(data.fname, isNumeric)) {
    return setResponse(405, "First name can not contain number", null, res);
  }
  if (iterateWithFunction(data.fname, isSymbol)) {
    return setResponse(405, "First name can not contain symbol", null, res);
  }
  if (!data.lname || data.lname == "") {
    return setResponse(405, "Last name is required", null, res);
  }
  if (iterateWithFunction(data.lname, isNumeric)) {
    return setResponse(405, "Last name can not contain number", null, res);
  }
  if (iterateWithFunction(data.lname, isSymbol)) {
    return setResponse(405, "Last name can not contain symbol", null, res);
  }
  if (!data.cnic || data.cnic == "") {
    return setResponse(405, "CNIC is required", null, res);
  }
  if (iterateWithFunction(data.cnic, isAlphabat)) {
    return setResponse(
      405,
      "CNIC can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.cnic, isSymbol)) {
    return setResponse(405, "CNIC can not contain symbol", null, res);
  }
  if (data.cnic.split("").length < 13 || data.cnic.split("").length > 13) {
    return setResponse(405, "CNIC length should be 13", null, res);
  }

  if (!data.mobile || data.mobile == "") {
    return setResponse(405, "Mobile number is required", null, res);
  }
  if (iterateWithFunction(data.mobile, isAlphabat)) {
    return setResponse(
      405,
      "Mobile number can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.mobile, isSymbol)) {
    return setResponse(405, "Mobile number can not contain symbol", null, res);
  }
  if (data.mobile.split("").length < 11 || data.mobile.split("").length > 11) {
    return setResponse(405, "Mobile number length should be 11", null, res);
  }
  if (!data.address || data.address == "") {
    return setResponse(405, "Address is required", null, res);
  }
  if (data.emergency) {
    if (iterateWithFunction(data.emergency, isAlphabat)) {
      return setResponse(
        405,
        "Emergency number can not contain alphabat or symbol",
        null,
        res
      );
    }
    if (iterateWithFunction(data.emergency, isSymbol)) {
      return setResponse(
        405,
        "Emergency number can not contain symbol",
        null,
        res
      );
    }
    if (
      data.emergency.split("").length < 11 ||
      data.emergency.split("").length > 11
    ) {
      return setResponse(
        405,
        "Emergency number length should be 11",
        null,
        res
      );
    }
  }
  if (!data.accountType || data.accountType == "") {
    return setResponse(405, "Account Type is required", null, res);
  }
  // fname, lname, cnic, mobile, address, email, emergency, accountType
  const newData = {};
  if (accountExist.fname != data.fname) {
    newData.fname = data.fname;
  }
  if (accountExist.lname != data.lname) {
    newData.lname = data.lname;
  }
  if (accountExist.cnic != data.cnic) {
    newData.cnic = data.cnic;
  }
  if (accountExist.mobile != data.mobile) {
    newData.mobile = data.mobile;
  }
  if (accountExist.address != data.address) {
    newData.address = data.address;
  }
  if (accountExist.email != data.email) {
    newData.email = data.email;
  }
  if (accountExist.emergency != data.emergency) {
    newData.emergency = data.emergency;
  }
  if (accountExist.accountType != data.accountType) {
    newData.accountType = data.accountType;
  }
  const cnicExist = await Account.findOne({ cnic: newData.cnic });
  if (cnicExist) {
    return setResponse(405, "Account already exist with this cnic", null, res);
  }

  if (newData.email) {
    const validEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!newData.email.match(validEmail)) {
      return setResponse(405, "Email address is not valid", null, res);
    }
    const emailExist = await Account.findOne({ email: newData.email });
    if (emailExist) {
      return setResponse(
        405,
        "Account already exist with this email",
        null,
        res
      );
    }
  }
  const updated = await Account.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: newData }
  );
  if (!updated.acknowledged)
    return setResponse(200, "Account not updated", updated, res);
  return setResponse(200, "Account updated", updated, res);
});

// Delete account
route.delete("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const accountExist = await Account.findOne({ _id: ObjectId(req.params.id) });
  if (!accountExist) {
    return setResponse(404, "Account not found", null, res);
  }
  const deleted = await Account.deleteOne({ _id: ObjectId(req.params.id) });
  return setResponse(200, "Account deleted", deleted, res);
});

// Activate account
route.put("/:id/activate", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const accountExist = await Account.findOne({ _id: ObjectId(req.params.id) });
  if (!accountExist) {
    return setResponse(404, "Account not found", null, res);
  }
  const updated = await Account.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { status: true } }
  );
  setResponse(200, "Account activated", updated, res);
});

// Deactivate account
route.put("/:id/deactivate", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const accountExist = await Account.findOne({ _id: ObjectId(req.params.id) });
  if (!accountExist) {
    return setResponse(404, "Account not found", null, res);
  }
  const updated = await Account.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { status: false } }
  );
  setResponse(200, "Account deactivated", updated, res);
});

module.exports = route;
