const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = Schema({
  title: {
    type: String,
    required: true,
  },
});

const productSchema = Schema({
  title: {
    type: String,
    required: true,
  },
});

const rawMaterialSchema = Schema({
  title: {
    type: String,
    required: true,
  },
});

const accountSchema = Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  emergency: {
    type: String,
    required: false,
  },
  accountType: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const employeeSchema = Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  emergency: {
    type: String,
    required: false,
  },
  department: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  salaryPerMinute: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

const expenseSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const attendanceSchema = Schema({
  cnic: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  checkIn: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: false,
  },
});

const capitalSchema = Schema({
  account: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
});

const Department = mongoose.model("Department", departmentSchema);
const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);
const Product = mongoose.model("Product", productSchema);
const Account = mongoose.model("Account", accountSchema);
const Employee = mongoose.model("Employee", employeeSchema);
const Expense = mongoose.model("Expense", expenseSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const Capital = mongoose.model("Capital", capitalSchema);

module.exports = {
  Department,
  RawMaterial,
  Product,
  Account,
  Employee,
  Expense,
  Attendance,
  Capital,
};
