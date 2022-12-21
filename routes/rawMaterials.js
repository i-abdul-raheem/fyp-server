const route = require("express").Router();
const { RawMaterial } = require("../models/model");
const ObjectId = require("mongoose").Types.ObjectId;

// Get all rawMaterials
route.get("/", async (req, res) => {
  const rawMaterials = await RawMaterial.find();
  const response = {
    status: 200,
    message: "",
    data: rawMaterials,
  };
  res.status(200).json(response);
});

// Get single rawMaterial
route.get("/:id", async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const rawMaterial = await RawMaterial.findOne({
      _id: ObjectId(req.params.id),
    });
    if (rawMaterial == null) {
      const response = {
        status: 404,
        message: "Raw Material not found",
        data: rawMaterial,
      };
      res.status(response.status).json(response);
    } else {
      const response = {
        status: 200,
        message: "",
        data: rawMaterial,
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

// Add new rawMaterial
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
  const isExist = await RawMaterial.findOne({ title: data.title });
  if (isExist) {
    response.status = 405;
    response.message = "Raw Material already exist";
    return res.status(response.status).json(response);
  }
  const rawMaterial = new RawMaterial(data);
  await rawMaterial.save();
  response.status = 201;
  response.message = "Raw Material added";
  response.data = rawMaterial;
  return res.status(response.status).json(response);
});

// Update rawMaterial
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
  const isExist = await RawMaterial.findOne({ title: data.title });
  if (isExist) {
    response.status = 405;
    response.message = "Raw Material already exist";
    return res.status(response.status).json(response);
  }
  const updated = await RawMaterial.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: data }
  );
  response.status = 200;
  response.message = "Raw Material updated";
  response.data = updated;
  return res.status(response.status).json(response);
});

// Delete rawMaterial
route.delete("/:id", async (req, res) => {
  const response = {
    status: null,
    message: null,
    data: null,
  };
  if (ObjectId.isValid(req.params.id)) {
    const deleted = await RawMaterial.deleteOne({
      _id: ObjectId(req.params.id),
    });
    response.status = 200;
    if (deleted.deletedCount === 1) response.message = "Raw Material Deleted";
    else response.message = "Raw Material not found";
    response.data = deleted;
    return res.status(response.status).json(response);
  } else {
    response.status = 405;
    response.message = "Invalid ID";
    return res.status(response.status).json(response);
  }
});

module.exports = route;
