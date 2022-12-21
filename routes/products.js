const route = require("express").Router();
const { Product } = require("../models/model");
const ObjectId = require("mongoose").Types.ObjectId;

// Get all products
route.get("/", async (req, res) => {
  const products = await Product.find();
  const response = {
    status: 200,
    message: "",
    data: products,
  };
  res.status(200).json(response);
});

// Get single product
route.get("/:id", async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const product = await Product.findOne({
      _id: ObjectId(req.params.id),
    });
    if (product == null) {
      const response = {
        status: 404,
        message: "Product not found",
        data: product,
      };
      res.status(response.status).json(response);
    } else {
      const response = {
        status: 200,
        message: "",
        data: product,
      };
      res.status(response.status).json(response);
    }
  } else {
    const response = {
      status: 405,
      message: "Invild ID",
      data: {},
    };
    res.status(response.status).json(response);
  }
});

// Add new product
route.post("/", async (req, res) => {
  const data = req.body;
  const response = {
    status: null,
    message: null,
    data: null,
  };
  if (!data.title || data.title == "") {
    response.status = 405;
    response.message = "Title field is required";
    return res.status(response.status).json(response);
  }
  const isExist = await Product.findOne({ title: data.title });
  if (isExist) {
    response.status = 405;
    response.message = "Product already exist";
    return res.status(response.status).json(response);
  }
  const product = new Product(data);
  await product.save();
  response.status = 201;
  response.message = "Product added";
  response.data = product;
  return res.status(response.status).json(response);
});

// Update product
route.put("/:id", async (req, res) => {
  const response = {
    status: null,
    message: null,
    data: null,
  };
  const data = req.body;
  if (!ObjectId.isValid(req.params.id)) {
    response.status = 405;
    response.message = "Invalid ID";
    return res.status(response.status).json(response);
  }
  if (!data.title || data.title == "") {
    response.status = 405;
    response.message = "Title field is required";
    return res.status(response.status).json(response);
  }
  const isExist = await Product.findOne({ title: data.title });
  if (isExist) {
    response.status = 405;
    response.message = "Product already exist";
    return res.status(response.status).json(response);
  }
  const updated = await Product.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: data }
  );
  response.status = 200;
  response.message = "Product updated";
  response.data = updated;
  return res.status(response.status).json(response);
});

// Delete product
route.delete("/:id", async (req, res) => {
  const response = {
    status: null,
    message: null,
    data: null,
  };
  if (ObjectId.isValid(req.params.id)) {
    const deleted = await Product.deleteOne({
      _id: ObjectId(req.params.id),
    });
    response.status = 200;
    if (deleted.deletedCount === 1) response.message = "Product Deleted";
    else response.message = "Product not found";
    response.data = deleted;
    return res.status(response.status).json(response);
  } else {
    response.status = 405;
    response.message = "Invalid ID";
    return res.status(response.status).json(response);
  }
});

module.exports = route;
