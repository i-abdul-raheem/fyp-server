const route = require("express").Router();
const { Employee } = require("../models/model");
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

// Get all employees
route.get("/", async (req, res) => {
  const employees = await Employee.find();
  return setResponse(200, null, employees, res);
});

// Get single employee
route.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const employee = await Employee.findOne({ _id: ObjectId(req.params.id) });
  if (!employee) {
    return setResponse(404, "Employee not found", employee, res);
  }
  return setResponse(200, null, employee, res);
});

// Add new employee
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
  const cnicExist = await Employee.findOne({ cnic: data.cnic });
  if (cnicExist) {
    return setResponse(405, "Employee already exist with this cnic", null, res);
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
    const emailExist = await Employee.findOne({ email: data.email });
    if (emailExist) {
      return setResponse(
        405,
        "Employee already exist with this email",
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
  if (!data.department || data.department == "") {
    return setResponse(405, "Department is required", null, res);
  }
  if (!ObjectId.isValid(data.department)) {
    return setResponse(405, "Department type is invalid", null, res);
  }
  if (!data.salary || data.salary == "") {
    return setResponse(405, "Salary is required", null, res);
  }
  if (iterateWithFunction(data.salary, isAlphabat)) {
    return setResponse(
      405,
      "Salary can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.salary, isSymbol)) {
    return setResponse(405, "Salary can not contain symbol", null, res);
  }
  data.status = true;
  const eSalary = parseFloat(data.salary);
  const minuteSalary = (eSalary / 40) / 60;
  data.salaryPerMinute = Math.round(minuteSalary);
  const newEmployee = new Employee(data);
  newEmployee.save();
  return setResponse(201, "Employee Created", newEmployee, res);
});

// Update employee
route.put("/:id", async (req, res) => {
  const data = req.body;
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const employeeExist = await Employee.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!employeeExist) {
    return setResponse(404, "Employee does not exist", null, res);
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
  if (!data.department || data.department == "") {
    return setResponse(405, "Employee Type is required", null, res);
  }
  if (!ObjectId.isValid(data.department)) {
    return setResponse(405, "Department type is invalid", null, res);
  }
  if (!data.salary || data.salary == "") {
    return setResponse(405, "Salary is required", null, res);
  }
  if (iterateWithFunction(data.salary, isAlphabat)) {
    return setResponse(
      405,
      "Salary can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.salary, isSymbol)) {
    return setResponse(405, "Salary can not contain symbol", null, res);
  }
  const newData = {};
  if (employeeExist.fname != data.fname) {
    newData.fname = data.fname;
  }
  if (employeeExist.lname != data.lname) {
    newData.lname = data.lname;
  }
  if (employeeExist.cnic != data.cnic) {
    newData.cnic = data.cnic;
  }
  if (employeeExist.mobile != data.mobile) {
    newData.mobile = data.mobile;
  }
  if (employeeExist.address != data.address) {
    newData.address = data.address;
  }
  if (employeeExist.email != data.email) {
    newData.email = data.email;
  }
  if (employeeExist.emergency != data.emergency) {
    newData.emergency = data.emergency;
  }
  if (employeeExist.department != data.department) {
    newData.department = data.department;
  }
  if (employeeExist.salary != data.salary) {
    newData.salary = data.salary;
  }
  const cnicExist = await Employee.findOne({ cnic: newData.cnic });
  if (cnicExist) {
    return setResponse(405, "Employee already exist with this cnic", null, res);
  }

  if (newData.email) {
    const validEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!newData.email.match(validEmail)) {
      return setResponse(405, "Email address is not valid", null, res);
    }
    const emailExist = await Employee.findOne({ email: newData.email });
    if (emailExist) {
      return setResponse(
        405,
        "Employee already exist with this email",
        null,
        res
      );
    }
  }
  const updated = await Employee.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: newData }
  );
  if (!updated.acknowledged)
    return setResponse(200, "Employee not updated", updated, res);
  return setResponse(200, "Employee updated", updated, res);
});

// Delete employee
route.delete("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const employeeExist = await Employee.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!employeeExist) {
    return setResponse(404, "Employee not found", null, res);
  }
  const deleted = await Employee.deleteOne({ _id: ObjectId(req.params.id) });
  return setResponse(200, "Employee deleted", deleted, res);
});

// Activate employee
route.put("/:id/activate", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const employeeExist = await Employee.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!employeeExist) {
    return setResponse(404, "Employee not found", null, res);
  }
  const updated = await Employee.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { status: true } }
  );
  setResponse(200, "Employee activated", updated, res);
});

// Deactivate employee
route.put("/:id/deactivate", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const employeeExist = await Employee.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!employeeExist) {
    return setResponse(404, "Employee not found", null, res);
  }
  const updated = await Employee.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { status: false } }
  );
  setResponse(200, "Employee deactivated", updated, res);
});

route.put("/:id/confirm", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const employeeExist = await Employee.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!employeeExist) {
    return setResponse(404, "Employee not found", null, res);
  }
  const updated = await Employee.updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { confirmed: true } }
  );
  setResponse(200, "Employee request confirmed", updated, res);
});

module.exports = route;
