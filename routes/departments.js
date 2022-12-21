const route = require("express").Router();
const { Department } = require("../models/model");
const ObjectId = require("mongoose").Types.ObjectId;

// Get all departments
route.get("/", async (req, res) => {
  const departments = await Department.find();
  const response = {
    status: 200,
    message: "",
    data: departments,
  };
  res.status(200).json(response);
});

// Get single department
route.get("/:id", async (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const department = await Department.findOne({
      _id: ObjectId(req.params.id),
    });
    if (department == null) {
      const response = {
        status: 404,
        message: "Department not found",
        data: department,
      };
      res.status(response.status).json(response);
    } else {
      const response = {
        status: 200,
        message: "",
        data: department,
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

// Add new department
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
  const isExist = await Department.findOne({ title: data.title });
  if (isExist) {
    response.status = 405;
    response.message = "Department already exist";
    return res.status(response.status).json(response);
  }
  const department = new Department(data);
  await department.save();
  response.status = 201;
  response.message = "Department added";
  response.data = department;
  return res.status(response.status).json(response);
});

// Update department
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
  const isExist = await Department.findOne({ title: data.title });
  if (isExist) {
    response.status = 405;
    response.message = "Department already exist";
    return res.status(response.status).json(response);
  }
  const updated = await Department.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: data }
  );
  response.status = 200;
  response.message = "Department updated";
  response.data = updated;
  return res.status(response.status).json(response);
});

// Delete department
route.delete("/:id", async (req, res) => {
  const response = {
    status: null,
    message: null,
    data: null,
  };
  if (ObjectId.isValid(req.params.id)) {
    const deleted = await Department.deleteOne({
      _id: ObjectId(req.params.id),
    });
    response.status = 200;
    if (deleted.deletedCount === 1) response.message = "Department Deleted";
    else response.message = "Department not found";
    response.data = deleted;
    return res.status(response.status).json(response);
  } else {
    response.status = 405;
    response.message = "Invalid ID";
    return res.status(response.status).json(response);
  }
});

module.exports = route;
