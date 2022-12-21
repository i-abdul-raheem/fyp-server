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
    required: true
  }
});

const Department = mongoose.model("Department", departmentSchema);
const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);
const Product = mongoose.model("Product", productSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = { Department, RawMaterial, Product, Account };
