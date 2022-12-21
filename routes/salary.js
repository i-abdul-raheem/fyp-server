const route = require("express").Router();
const { Employee, Salary, Attendance } = require("../models/model");
const ObjectId = require("mongoose").Types.ObjectId;

function setResponse(status = null, message = null, data = null, resp) {
  const response = {};
  response.status = status;
  response.message = message;
  response.data = data;
  return resp.status(response.status).json(response);
}

// Generate Salaries
route.post("/", async (req, res) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const myDate = month + "/" + year;
  const salaryExist = await Salary.findOne({ date: myDate });
  if (salaryExist) {
    return setResponse(
      405,
      "Salaries already gennerated for this month",
      null,
      res
    );
  }
  const employees = await Employee.find({});
  const attendance = await Attendance.find({});
  const newAttendance = [];
  attendance.map((i) => {
    if (i.date.search(myDate) > -1) {
      i.checkIn =
        parseInt(i.checkIn[0] + "" + i.checkIn[1]) * 60 +
        parseInt(i.checkIn[3] + "" + i.checkIn[4]);
      i.checkOut =
        parseInt(i.checkOut[0] + "" + i.checkOut[1]) * 60 +
        parseInt(i.checkOut[3] + "" + i.checkOut[4]);
      i.checkOut = i.checkOut - i.checkIn;
      newAttendance.push(i);
    }
  });
  const final = [];
  employees.map((i) => {
    const cnic = i.cnic;
    const temp = {
      account: i._id,
      amount: 0,
      date: myDate,
    };
    newAttendance.map((j) => {
      if (j.cnic == cnic) {
        temp.amount = temp.amount + parseInt(j.checkOut);
      }
    });
    temp.amount = parseInt(temp.amount) * i.salaryPerMinute;
    final.push(temp);
  });
  await Salary.insertMany(final);
  return setResponse(200, "Salaries generated", null, res);
});

// Pay to all
route.put("/", async (req, res) => {
  const data = await Salary.updateMany({}, { $set: { payed: true } });
  return setResponse(200, "Paid to all", data, res);
});

// Pay to one
route.put("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    response.status = 405;
    response.message = "Invalid ID";
    return res.status(response.status).json(response);
  }
  const data = await Salary.updateOne({_id: ObjectId(req.params.id)}, { $set: { payed: true } });
  return setResponse(200, "Salary Paid", data, res);
});

module.exports = route;
