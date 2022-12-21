const route = require("express").Router();
const { Attendance, Employee } = require("../models/model");
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

// Get all attendances
route.get("/", async (req, res) => {
  const attendances = await Attendance.find();
  return setResponse(200, null, attendances, res);
});

// Get attendance by date
route.get("/by_date/:date", async (req, res) => {
  const attendance = await Attendance.find({
    date: req.params.date,
  });
  if (!attendance) {
    return setResponse(404, "Attendance not found", attendance, res);
  }
  return setResponse(200, null, attendance, res);
});

// Get single person attendance
route.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return setResponse(405, "Invalid ID", null, res);
  }
  const attendance = await Attendance.find({
    _id: ObjectId(req.params.id),
  });
  if (!attendance) {
    return setResponse(404, "Attendance not found", attendance, res);
  }
  return setResponse(200, null, attendance, res);
});

// Add new attendance
route.post("/", async (req, res) => {
  const data = req.body;
  if (!data.cnic || data.cnic == "") {
    return setResponse(405, "Employee ID is required", null, res);
  }
  if (iterateWithFunction(data.cnic, isAlphabat)) {
    return setResponse(
      405,
      "Employee ID can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.cnic, isSymbol)) {
    return setResponse(405, "Employee ID can not contain symbol", null, res);
  }
  if (data.cnic.split("").length < 13 || data.cnic.split("").length > 13) {
    return setResponse(405, "Employee ID length should be 13", null, res);
  }
  const employeeExist = await Employee.findOne({cnic: data.cnic});
  if(!employeeExist){
    return setResponse(405, "Employee not  exist", null, res);
  }
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const now = `${day}/${month}/${year}`;
  data.date = now;
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const timeNow = `${hour}:${minutes}`;
  data.checkIn = timeNow;
  const attendanceExist = await Attendance.findOne({
    cnic: data.cnic,
    date: now,
  });
  if (attendanceExist) {
    return setResponse(
      405,
      `Already checked in at ${attendanceExist.checkIn}`,
      attendanceExist,
      res
    );
  }
  const newAttendance = new Attendance(data);
  newAttendance.save();
  return setResponse(201, "Attendance Added", newAttendance, res);
});

// Checkout
route.put("/", async (req, res) => {
  const data = req.body;
  if (!data.cnic || data.cnic == "") {
    return setResponse(405, "Cnic is required", null, res);
  }
  if (iterateWithFunction(data.cnic, isAlphabat)) {
    return setResponse(
      405,
      "Employee ID can not contain alphabat or symbol",
      null,
      res
    );
  }
  if (iterateWithFunction(data.cnic, isSymbol)) {
    return setResponse(405, "Employee ID can not contain symbol", null, res);
  }
  if (data.cnic.split("").length < 13 || data.cnic.split("").length > 13) {
    return setResponse(405, "CNIC length should be 13", null, res);
  }
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const now = `${day}/${month}/${year}`;
  data.date = now;
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const timeNow = `${hour}:${minutes}`;
  data.checkIn = timeNow;
  const attendanceExist = await Attendance.findOne({
    cnic: data.cnic,
    date: now,
  });
  if (!attendanceExist) {
    return setResponse(405, `No check-ins today`, null, res);
  }
  if(attendanceExist.checkOut){
    return setResponse(405, `Already checked out at ${attendanceExist.checkOut}`, null, res);
  }
  const newAttendance = await Attendance.updateOne(
    { _id: attendanceExist._id },
    { $set: { checkOut: timeNow } }
  );
  return setResponse(201, "Attendance Updated", newAttendance, res);
});

module.exports = route;
