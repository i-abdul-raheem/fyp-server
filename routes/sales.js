const route = require("express").Router();
const { Sale, Product, Account } = require("../models/model");
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
    if (data[i].item == id) {
      qty = qty + parseInt(data[i].quantity);
    }
  }
  return qty;
}

// Get all sales
route.get("/", async (req, res) => {
  const sales = await Sale.find({});
  return setResponse(200, null, sales, res);
});

// Get single sale
route.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const sale = await Sale.findOne({ _id: ObjectId(req.params.id) });
  if (!sale) {
    return setResponse(404, "Sale record not found", null, res);
  }
  return setResponse(200, null, sale, res);
});

// Add new sale
route.post("/", async (req, res) => {
  const data = req.body;
  if (!data.customer) {
    return setResponse(405, "Customer is required", null, res);
  }
  const customerExist = await Account.findOne({
    _id: ObjectId(data.customer),
    accountType: "customer",
  });
  if (!customerExist) {
    return setResponse(405, "Account type not allowed", null, res);
  }
  if (!data.receivedAmount) {
    return setResponse(405, "Received Amount is required", null, res);
  }
  if (iterateWithFunction(data.receivedAmount, isAlphabat)) {
    return setResponse(
      405,
      "Amount can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (!data.product) {
    return setResponse(405, "Product is required", null, res);
  }
  if (data.product.length === 0) {
    return setResponse(405, "Product is required", null, res);
  }

  if (
    data.product.some(async (i) => {
      if (!i.item) {
        return true;
      }
      const myProduct = await Product.findOne({
        _id: ObjectId(i.item),
      });
      if (!myProduct) {
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
    return setResponse(405, "Invalid iTem", null, res);
  }
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const now = `${month}/${day}/${year}`;
  data.date = now;
  const count = await Sale.find({});
  data.invoice = count.length + 1;
  const newSale = new Sale(data);
  newSale.save();
  return setResponse(201, "Sale Added", newSale, res);
});

// Return item
route.put("/:id", async (req, res) => {
  const data = req.body;
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  if (!data.product || data.product.length === 0) {
    return setResponse(405, "Nothing to return", null, res);
  }
  const mySale = await Sale.findOne({ _id: ObjectId(req.params.id) });
  if (
    data.product.some((i) => {
      if (!i.quantity) {
        return true;
      }
      if (!i.item) {
        return true;
      }
      if (parseInt(i.quantity) < 1) {
        return true;
      }
      if (
        parseInt(getQuantity(mySale.returns, i.item)) +
          parseInt(i.quantity) >
        parseInt(getQuantity(mySale.product, i.item))
      ) {
        return true;
      }
    })
  ) {
    return setResponse(405, "Invalid Return", null, res);
  }
  const updatedData = [...mySale.returns, ...data.product];
  const update = await Sale.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { returns: updatedData } }
  );
  return setResponse(200, "Return Successful", update, res);
});

module.exports = route;
