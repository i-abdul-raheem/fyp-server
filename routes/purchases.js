const route = require("express").Router();
const { Purchase, RawMaterial, Account } = require("../models/model");
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

const iterateWithFunction = (data, func) => {
  return data.split("").some((i) => {
    return func(i);
  });
};

function getQuantity(data, id) {
  if (data.length === 0) return 0;
  let qty = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].material == id) {
      qty = qty + parseInt(data[i].quantity);
    }
  }
  return qty;
}

// Get all purchases
route.get("/", async (req, res) => {
  const purchases = await Purchase.find({});
  return setResponse(200, null, purchases, res);
});

// Get single purchase
route.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const purchase = await Purchase.findOne({ _id: ObjectId(req.params.id) });
  if (!purchase) {
    return setResponse(404, "Purchase record not found", null, res);
  }
  return setResponse(200, null, purchase, res);
});

// Add new purchase
route.post("/", async (req, res) => {
  const data = req.body;
  if (!data.vendor) {
    return setResponse(405, "Vendor is required", null, res);
  }
  const vendorExist = await Account.findOne({
    _id: ObjectId(data.vendor),
    accountType: "vendor",
  });
  if (!vendorExist) {
    return setResponse(405, "Account type not allowed", null, res);
  }
  if (!data.paidAmount) {
    return setResponse(405, "Paid Amount is required", null, res);
  }
  if (iterateWithFunction(data.paidAmount, isAlphabat)) {
    return setResponse(
      405,
      "Amount can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (!data.rawMaterial) {
    return setResponse(405, "Raw Material is required", null, res);
  }
  if (data.rawMaterial.length === 0) {
    return setResponse(405, "Raw Material is required", null, res);
  }

  if (
    data.rawMaterial.some(async (i) => {
      if (!i.material) {
        return true;
      }
      const myRawMaterial = await RawMaterial.findOne({
        _id: ObjectId(i.material),
      });
      if (!myRawMaterial) {
        return true;
      }
      if (!i.quantity) {
        return true;
      }
      if (parseInt(i.quantity) < 1) {
        return true;
      }
      if (!i.unitPrice) {
        return true;
      }
      if (parseFloat(i.unitPrice) < 0.1) {
        return true;
      }
    })
  ) {
    return setResponse(405, "Invalid Material", null, res);
  }
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const now = `${month}/${day}/${year}`;
  data.date = now;
  const count = await Purchase.find({});
  data.invoice = count.length + 1;
  const newPurchase = new Purchase(data);
  newPurchase.save();
  return setResponse(201, "Purchase Added", newPurchase, res);
});

// Return material
route.put("/:id", async (req, res) => {
  const data = req.body;
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  if (!data.rawMaterial || data.rawMaterial.length === 0) {
    return setResponse(405, "Nothing to return", null, res);
  }
  const myPurchase = await Purchase.findOne({ _id: ObjectId(req.params.id) });
  if (
    data.rawMaterial.some((i) => {
      if (!i.quantity) {
        return true;
      }
      if (!i.material) {
        return true;
      }
      if (parseInt(i.quantity) < 1) {
        return true;
      }
      if (
        parseInt(getQuantity(myPurchase.returns, i.material)) +
          parseInt(i.quantity) >
        parseInt(getQuantity(myPurchase.rawMaterial, i.material))
      ) {
        return true;
      }
    })
  ) {
    return setResponse(405, "Invalid Return", null, res);
  }
  const updatedData = [...myPurchase.returns, ...data.rawMaterial];
  const update = await Purchase.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { returns: updatedData } }
  );
  return setResponse(200, "Return Successful", update, res);
});

module.exports = route;
